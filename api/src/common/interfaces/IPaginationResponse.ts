export type SearchParamToNavigation = {
  limit: number;
  offset: number;
};

export interface PaginationMetadata {
  nextPage: SearchParamToNavigation | null;
  backPage: SearchParamToNavigation | null;
  totalItems: number;
  totalPages: number;
  lastPage: SearchParamToNavigation | null;
  currentPage: number;
  firstPage: SearchParamToNavigation;
}

export interface PaginationResponse<T> {
  data: T;
  meta: PaginationMetadata;
}