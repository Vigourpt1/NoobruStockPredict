import { OrderData } from '../types';

export function calculateAnalytics(orders: OrderData[]) {
  if (!orders.length) {
    return {
      totalOrders: 0,
      averageOrderSize: 0,
      topSellingSkus: [],
      monthOverMonthGrowth: 0
    };
  }

  // Group orders by month
  const monthlyOrders = orders.reduce((acc, order) => {
    const month = order.date.substring(0, 7); // YYYY-MM
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(order);
    return acc;
  }, {} as Record<string, OrderData[]>);

  // Calculate month-over-month growth
  const months = Object.keys(monthlyOrders).sort();
  const lastMonth = monthlyOrders[months[months.length - 1]];
  const previousMonth = monthlyOrders[months[months.length - 2]];
  
  const lastMonthTotal = lastMonth?.length || 0;
  const previousMonthTotal = previousMonth?.length || 0;
  
  const monthOverMonthGrowth = previousMonthTotal === 0 ? 0 :
    ((lastMonthTotal - previousMonthTotal) / previousMonthTotal) * 100;

  // Calculate SKU totals
  const skuTotals = orders.reduce((acc, order) => {
    if (!acc[order.sku]) {
      acc[order.sku] = 0;
    }
    acc[order.sku] += order.quantity;
    return acc;
  }, {} as Record<string, number>);

  // Sort SKUs by total quantity
  const topSellingSkus = Object.entries(skuTotals)
    .map(([sku, quantity]) => ({ sku, quantity }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  // Calculate average order size
  const orderSizes = new Map<string, number>();
  orders.forEach(order => {
    const current = orderSizes.get(order.order_number) || 0;
    orderSizes.set(order.order_number, current + order.quantity);
  });
  
  const averageOrderSize = Array.from(orderSizes.values())
    .reduce((sum, size) => sum + size, 0) / orderSizes.size;

  return {
    totalOrders: orderSizes.size,
    averageOrderSize,
    topSellingSkus,
    monthOverMonthGrowth
  };
}