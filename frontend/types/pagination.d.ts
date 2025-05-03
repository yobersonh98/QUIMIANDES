export interface SearchParamToNavigation {
  limit: number;
  offset: number;
};

export interface PaginationSearchParamsPage {
  limit?: string;
  offset?: string;
  search?: string;
}

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

export interface ParamsPage {
  id?: string
}
export interface PageProps<T extends PaginationSearchParamsPage,P extends ParamsPage = ParamsPage> {
  searchParams?: Promise<T>
  params?: Promise<P>
}