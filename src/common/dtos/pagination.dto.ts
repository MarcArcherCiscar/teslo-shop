import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {

    @ApiProperty({
        default: 10,
        minimum: 1,
        maximum: 100,
        description: 'Number of items per page',
        required: false
    })
    @IsOptional()
    @IsPositive()
    @Type( () => Number ) //enableImplicitConversions: true
    limit?: number;

    @ApiProperty({
        default: 0,
        minimum: 0,
        description: 'Number of items to skip',
        required: false
    })
    @IsOptional()
    @Min(0)
    @Type( () => Number ) //enableImplicitConversions: true
    offset?: number;
}