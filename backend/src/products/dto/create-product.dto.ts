import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  slug!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  price!: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  compareAtPrice?: number;

  @IsString()
  @IsIn(["fashion", "footwear", "beauty"])
  category!: "fashion" | "footwear" | "beauty";

  @IsOptional()
  @IsString()
  subcategory?: string;

  @IsString()
  @IsNotEmpty()
  brand!: string;

  @IsString()
  @IsNotEmpty()
  image!: string;

  @IsArray()
  @IsString({ each: true })
  images!: string[];

  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock!: number;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsBoolean()
  newArrival?: boolean;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}