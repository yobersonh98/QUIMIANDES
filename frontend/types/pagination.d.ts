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


export interface PageProps<T extends PaginationSearchParamsPage> {
  searchParams?: T
  params?:  {
    id: string
  }
}