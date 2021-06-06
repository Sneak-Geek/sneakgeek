export type District = {
  Code: string; // district code
  DistrictID: number;
  DistrictName: string;
  MiningText: string; // short cut for district, e.g. Quan 1 = Q1
  ProvinceID: number;
  ProvinceName: string;
}

export type Ward = {
  WardCode: string;
  WardName: string;
  DistrictCode: string;
  ProvinceID: number;
  DistrictID: number;
}
