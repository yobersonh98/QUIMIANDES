import { PaginationDto } from "../../common/dtos/pagination.dto";

export class ClienteListarDto extends PaginationDto {
    search?: string;
}