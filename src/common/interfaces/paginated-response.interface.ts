export interface IPaginatedResponse<T> {
  offset: number;
  limit: number;
  arrayList: T;
  total: number;
}
