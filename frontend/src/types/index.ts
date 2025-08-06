export interface ElectricCar {
  id: number;
  brand: string;
  model: string;
  accelsec: string;
  topspeed_kmh: number;
  range_km: number;
  efficiency_whkm: number;
  fastcharge_kmh: number;
  rapidcharge: string;
  powertrain: string;
  plugtype: string;
  bodystyle: string;
  segment: string;
  seats: number;
  priceeuro: number;
  date: string;
  // Legacy fields for backward compatibility
  efficiency_wh_km?: number;
  fastcharge_km_h?: number;
  price_euro?: number;
  availability?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  total?: number;
  message?: string;
  error?: string;
}

export type FilterOperator = 'contains' | 'equals' | 'startsWith' | 'endsWith' | 'isEmpty' | 'greaterThan' | 'lessThan';

export interface FilterOperatorObject {
  operator: FilterOperator;
  value: string | number;
}

export interface FilterObject {
  [key: string]: FilterOperator;
}

export interface GridFilter {
  [key: string]: {
    filterType: string;
    type: string;
    filter?: string | number;
    filterTo?: string | number;
  };
}

export interface SortModel {
  colId: string;
  sort: 'asc' | 'desc';
}

export interface CarDetailParams {
  id: string;
}
