export interface ElectricCar {
  id: number;
  brand: string;
  model: string;
  bodystyle: string;
  segment: string;
  powertrain: string;
  range_km: number;
  efficiency_wh_km: number;
  fastcharge_km_h: number;
  price_euro: number;
  availability: string;
}

export interface FilterOperator {
  operator: 'contains' | 'equals' | 'startsWith' | 'endsWith' | 'isEmpty' | 'greaterThan' | 'lessThan';
  value: string | number;
}

export interface FilterObject {
  [key: string]: FilterOperator;
}

export interface QueryParams {
  search?: string;
  filter?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface ApiResponse<T> {
  data: T;
  total?: number;
  message?: string;
}

export interface ErrorResponse {
  error: string;
}
