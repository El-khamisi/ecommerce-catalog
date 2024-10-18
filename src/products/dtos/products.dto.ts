import { ApiProperty, ApiPropertyOptional, OmitType, PartialType } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import { Type } from "class-transformer";
import { IsArray, IsIn, IsNotEmpty, IsOptional, IsPositive, IsString } from "class-validator";

export class ListQueryDto {
    @IsOptional()
    @IsString()
    @ApiPropertyOptional({ description: 'search param' })
    q?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsPositive()
    @Type(() => Number)
    @ApiPropertyOptional({
        description: 'Used for pagination to specify a specific page',
        default: 1,
    })
    page?: number = 1;

    @IsOptional()
    @IsNotEmpty()
    @IsPositive()
    @Type(() => Number)
    @ApiPropertyOptional({
        description:
            'Used for pagination to specify a specific number of records',
        default: 10,
    })
    limit?: number = 10;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @ApiPropertyOptional({
        description:
            'Used for pagination to specify a field to sort records by',
    })
    sortBy?: string = 'id';

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @IsIn(['asc', 'desc'])
    @ApiPropertyOptional({
        description:
            'Used for pagination to sort records in a specific direction',
        default: 'asc',
    })
    sortDir?: Prisma.SortOrder = 'asc';
}

export class FindOneParamDto {
    @IsNotEmpty()
    @ApiProperty()
    id: string;
}

export class CreateOneBodyDto {

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    name: string

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    description: string

    @IsNotEmpty()
    @IsPositive()
    @Type(() => Number)
    @ApiProperty()
    price: number

    @IsOptional()
    @IsArray()
    @IsNotEmpty({ each: true })
    @ApiPropertyOptional()
    images: string[]
}

export class UpdateOneBodyDto extends PartialType(CreateOneBodyDto) { }