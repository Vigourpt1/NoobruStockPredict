interface OrderData {
  order_number: string;
  sku: string;
  quantity: number;
  date: string;
}

interface OrderSizes {
  small: number;
  medium: number;
  large: number;
}

export function processSku(sku: string, quantity: number): number {
  const parts = sku.split('_');
  
  if (parts.some(part => part.includes('sachet') || part === 'half')) {
    return quantity;
  }

  if (parts.length === 3 && !isNaN(Number(parts[1])) && !isNaN(Number(parts[2]))) {
    return quantity * (Number(parts[1]) + Number(parts[2]));
  }

  if (parts.length === 2 && !isNaN(Number(parts[1]))) {
    return quantity * Number(parts[1]);
  }

  return quantity;
}

function calculateOrderSize(totalItems: number, hasBottle: boolean): keyof OrderSizes {
  if (hasBottle || totalItems >= 9) {
    return 'large';
  }
  if (totalItems >= 5) {
    return 'medium';
  }
  return 'small';
}

export function calculatePackaging(orders: OrderData[]): {
  envelopes: number;
  sixMonthBoxes: number;
  twelveMonthBoxes: number;
  orderSizes: OrderSizes;
} {
  if (!Array.isArray(orders) || orders.length === 0) {
    return {
      envelopes: 0,
      sixMonthBoxes: 0,
      twelveMonthBoxes: 0,
      orderSizes: { small: 0, medium: 0, large: 0 }
    };
  }

  const orderTotals = new Map<string, { total: number; hasBottle: boolean }>();
  const orderSizes: OrderSizes = { small: 0, medium: 0, large: 0 };

  // Calculate totals per order
  orders.forEach(order => {
    const current = orderTotals.get(order.order_number) || { total: 0, hasBottle: false };
    const processedQuantity = processSku(order.sku, order.quantity);
    
    orderTotals.set(order.order_number, {
      total: current.total + processedQuantity,
      hasBottle: current.hasBottle || order.sku.includes('nb-btl')
    });
  });

  let envelopes = 0;
  let sixMonthBoxes = 0;
  let twelveMonthBoxes = 0;

  orderTotals.forEach(({ total, hasBottle }, orderNumber) => {
    const size = calculateOrderSize(total, hasBottle);
    orderSizes[size]++;

    if (size === 'large') {
      twelveMonthBoxes++;
    } else if (size === 'medium') {
      sixMonthBoxes++;
    } else {
      envelopes++;
    }
  });

  return { envelopes, sixMonthBoxes, twelveMonthBoxes, orderSizes };
}

function groupByMonth(orders: OrderData[]): Record<string, OrderData[]> {
  if (!Array.isArray(orders) || orders.length === 0) {
    return {};
  }

  return orders.reduce((acc, order) => {
    const date = new Date(order.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(order);
    return acc;
  }, {} as Record<string, OrderData[]>);
}

export function predictFutureSales(
  historicalData: OrderData[],
  growthRate: number = 0
): OrderData[] {
  if (!Array.isArray(historicalData) || historicalData.length === 0) {
    return [];
  }

  const monthlyData = groupByMonth(historicalData);
  const months = Object.keys(monthlyData).sort();
  
  if (months.length === 0) {
    return [];
  }

  const lastMonth = months[months.length - 1];
  const lastMonthData = monthlyData[lastMonth];

  if (!lastMonthData || lastMonthData.length === 0) {
    return [];
  }

  const predictions: OrderData[] = [];

  // Calculate average quantities per SKU per month
  const skuAverages = new Map<string, number>();
  const uniqueSkus = new Set(historicalData.map(order => order.sku));

  uniqueSkus.forEach(sku => {
    const monthlyQuantities = months.map(month => 
      (monthlyData[month] || [])
        .filter(order => order.sku === sku)
        .reduce((sum, order) => sum + order.quantity, 0)
    );
    
    const average = monthlyQuantities.reduce((sum, qty) => sum + qty, 0) / monthlyQuantities.length;
    skuAverages.set(sku, average);
  });

  // Generate predictions for next 3 months
  for (let i = 1; i <= 3; i++) {
    const predictionDate = new Date(lastMonth + '-01');
    predictionDate.setMonth(predictionDate.getMonth() + i);
    const monthKey = `${predictionDate.getFullYear()}-${String(predictionDate.getMonth() + 1).padStart(2, '0')}`;

    // Use last month's order pattern but adjust quantities based on growth rate
    lastMonthData.forEach((order, index) => {
      const avgQuantity = skuAverages.get(order.sku) || order.quantity;
      const growthFactor = 1 + (growthRate / 100);
      const predictedQuantity = Math.round(avgQuantity * Math.pow(growthFactor, i));

      if (predictedQuantity > 0) {
        predictions.push({
          order_number: `pred-${monthKey}-${index}`,
          sku: order.sku,
          quantity: predictedQuantity,
          date: `${monthKey}-01`
        });
      }
    });
  }

  return predictions;
}