import { Order, PackagingRequirement, Prediction } from '../types';

function parseSkuQuantity(sku: string, quantity: number): { baseSku: string; totalQuantity: number } {
  // Special cases for sachet and half
  if (sku.includes('sachet') || sku.includes('half')) {
    return { baseSku: sku, totalQuantity: quantity };
  }

  // Split by underscore
  const parts = sku.split('_');
  const basePart = parts[0];
  
  if (parts.length === 1) {
    return { baseSku: sku, totalQuantity: quantity };
  }

  // Sum all numeric parts after the base SKU
  let multiplier = 0;
  for (let i = 1; i < parts.length; i++) {
    const num = parseInt(parts[i]);
    if (!isNaN(num)) {
      multiplier += num;
    }
  }

  // If we found valid numbers, multiply quantity
  if (multiplier > 0) {
    return { 
      baseSku: basePart, 
      totalQuantity: quantity * multiplier 
    };
  }

  return { baseSku: sku, totalQuantity: quantity };
}

export function analyzeOrders(orders: Order[]): {
  ordersByMonth: Record<string, Order[]>;
  uniqueSkus: string[];
  historicalData: Prediction[];
} {
  const ordersByMonth: Record<string, Order[]> = {};
  const skuSet = new Set<string>();
  const historicalData: Prediction[] = [];

  // Group orders by month
  orders.forEach(order => {
    const { baseSku, totalQuantity } = parseSkuQuantity(order.sku, order.quantity);
    const date = new Date(order.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!ordersByMonth[monthKey]) {
      ordersByMonth[monthKey] = [];
    }
    ordersByMonth[monthKey].push({
      ...order,
      sku: baseSku,
      quantity: totalQuantity
    });
    skuSet.add(baseSku);
  });

  // Generate historical data in same format as predictions
  const months = Object.keys(ordersByMonth).sort();
  months.forEach(month => {
    const monthOrders = ordersByMonth[month];
    const skuPredictions: Record<string, number> = {};
    
    // Calculate total quantities per SKU
    Array.from(skuSet).forEach(sku => {
      const total = monthOrders
        .filter(order => order.sku === sku)
        .reduce((sum, order) => sum + order.quantity, 0);
      skuPredictions[sku] = total;
    });

    const packaging = calculatePackaging(monthOrders);
    const totalOrders = new Set(monthOrders.map(order => order.order_number)).size;
    
    historicalData.push({
      month,
      skuPredictions,
      orderSizes: {
        small: packaging.envelopes,
        medium: packaging.sixMonthBoxes,
        large: packaging.twelveMonthBoxes
      },
      packaging,
      totalOrders
    });
  });

  return {
    ordersByMonth,
    uniqueSkus: Array.from(skuSet),
    historicalData
  };
}

export function calculatePackaging(orders: Order[]): PackagingRequirement {
  const orderGroups = orders.reduce((acc, order) => {
    if (!acc[order.order_number]) {
      acc[order.order_number] = [];
    }
    acc[order.order_number].push(order);
    return acc;
  }, {} as Record<string, Order[]>);

  let envelopes = 0;
  let sixMonthBoxes = 0;
  let twelveMonthBoxes = 0;

  Object.values(orderGroups).forEach(orderItems => {
    const totalItems = orderItems.reduce((sum, item) => sum + item.quantity, 0);
    const hasBottle = orderItems.some(item => 
      item.sku.startsWith('nb-btl') || 
      item.sku.startsWith('nb-bt-')
    );

    if (hasBottle || totalItems >= 9) {
      twelveMonthBoxes++;
    } else if (totalItems >= 5) {
      sixMonthBoxes++;
    } else {
      envelopes++;
    }
  });

  return { envelopes, sixMonthBoxes, twelveMonthBoxes };
}

export function predictNextMonths(
  historicalData: Record<string, Order[]>, 
  uniqueSkus: string[],
  growthRate: number = 1
): Prediction[] {
  const months = Object.keys(historicalData).sort();
  const predictions: Prediction[] = [];

  // Calculate average orders per month
  const avgOrdersPerMonth = Math.round(
    Object.values(historicalData).reduce((sum, orders) => 
      sum + new Set(orders.map(o => o.order_number)).size, 0
    ) / months.length
  );

  // Get the last month's data as base
  const lastMonth = months[months.length - 1];

  // Generate predictions for next 3 months
  for (let i = 1; i <= 3; i++) {
    const nextDate = new Date(lastMonth + '-01');
    nextDate.setMonth(nextDate.getMonth() + i);
    const monthKey = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}`;

    const skuPredictions: Record<string, number> = {};
    uniqueSkus.forEach(sku => {
      const skuHistory = months.map(month => 
        historicalData[month].filter(order => order.sku === sku)
          .reduce((sum, order) => sum + order.quantity, 0)
      );
      
      const lastValue = skuHistory[skuHistory.length - 1] || 0;
      const predictedValue = Math.max(0, Math.round(lastValue * Math.pow(growthRate, i)));
      skuPredictions[sku] = predictedValue;
    });

    // Simulate orders based on predictions
    const simulatedOrders: Order[] = [];
    let orderCounter = 0;

    Object.entries(skuPredictions).forEach(([sku, quantity]) => {
      if (quantity > 0) {
        // Calculate average quantity per order for this SKU from historical data
        const historicalAvg = Math.max(1, Math.round(
          Object.values(historicalData).reduce((sum, orders) => 
            sum + orders.filter(o => o.sku === sku).reduce((s, o) => s + o.quantity, 0), 0
          ) / Math.max(1, Object.values(historicalData).reduce((sum, orders) => 
            sum + orders.filter(o => o.sku === sku).length, 0
          ))
        ));

        const numOrders = Math.ceil(quantity / historicalAvg);
        const baseQuantity = Math.floor(quantity / numOrders);
        let remainingQuantity = quantity;

        for (let j = 0; j < numOrders && remainingQuantity > 0; j++) {
          const orderQuantity = Math.min(baseQuantity, remainingQuantity);
          simulatedOrders.push({
            order_number: `pred-${monthKey}-${orderCounter++}`,
            sku,
            quantity: orderQuantity,
            date: `${monthKey}-01`
          });
          remainingQuantity -= orderQuantity;
        }
      }
    });

    const packaging = calculatePackaging(simulatedOrders);
    const adjustedTotalOrders = Math.round(avgOrdersPerMonth * Math.pow(growthRate, i));
    
    predictions.push({
      month: monthKey,
      skuPredictions,
      orderSizes: {
        small: packaging.envelopes,
        medium: packaging.sixMonthBoxes,
        large: packaging.twelveMonthBoxes
      },
      packaging,
      totalOrders: Math.max(orderCounter, adjustedTotalOrders)
    });
  }

  return predictions;
}