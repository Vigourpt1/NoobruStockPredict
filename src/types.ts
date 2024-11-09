export interface OrderData {
  order_number: string;
  sku: string;
  quantity: number;
  date: string;
}

export interface PackagingRequirement {
  envelopes: number;
  sixMonthBoxes: number;
  twelveMonthBoxes: number;
}

export interface ColumnMapping {
  order_number: string;
  sku: string;
  quantity: string;
  date: string;
}

export interface ChartData {
  month: string;
  envelopes: number;
  sixMonthBoxes: number;
  twelveMonthBoxes: number;
  isHistorical?: boolean;
}