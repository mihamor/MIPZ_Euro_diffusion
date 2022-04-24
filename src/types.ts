

export type BalanceMap = {
  [countryName: string]: number;
};

export interface CountryType {
  name: string;
  xl: number;
  yl: number;
  xh: number;
  yh: number;
  cities: CityType[];
  judgmentDay: number;
};

export interface MapType {
  cities: CityType[];
  countries: CountryType[];
  grid: Grid;
}

export interface CityType {
  x: number;
  y: number;
  currentBalance: BalanceMap;
  incomingBalance: BalanceMap;
  outcomingBalance: BalanceMap;
  neighbours: CityType[];
  country: CountryType;
};

export type Grid = number[][];