import { IsDateString, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { PaginationMetadata, PaginationResponse } from "../interfaces/IPaginationResponse";
import { Type } from "class-transformer";


export class Pagination {
    limit: number;
    offset: number;
    constructor(paginationDto: PaginationDto) {
        const { limit = 10, offset = 0 } = paginationDto;
        this.limit = Number(limit);
        this.offset = Number(offset)
    }

    calculatePagination(totalItems: number): PaginationMetadata {
        const totalPages = Math.ceil(totalItems / this.limit);

        const nextPage = this.offset + this.limit < totalItems
            ? { limit: this.limit, offset: this.offset + this.limit }
            : null;

        const backPage = this.offset - this.limit >= 0
            ? { limit: this.limit, offset: this.offset - this.limit }
            : null;

        const lastPage = totalItems > 0
            ? { limit: this.limit, offset: Math.max(0, totalItems - this.limit) }
            : null;

        const currentPage = totalItems > 0
            ? Math.ceil(this.offset / this.limit) + 1
            : 1;

        const firstPage = { limit: this.limit, offset: 0 };

        return {
            nextPage,
            backPage,
            totalItems,
            totalPages,
            lastPage,
            currentPage,
            firstPage
        }
    }

    paginationResponse<T>(totalItems: number, data: T): PaginationResponse<T> {
        return {
            data,
            meta: this.calculatePagination(totalItems)
        }
    }
}


export class PaginationDto {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1) // Evita valores 0 o negativos
    limit: number = 10;
  
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    offset: number = 0;

    @IsString()
    @IsOptional()
    search?: string;

    @IsOptional()
    @IsDateString()
    initDate?: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;
    
}