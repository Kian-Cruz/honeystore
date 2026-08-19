import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from "class-validator";

import { PaymentMethod } from "../../generated/prisma/client";

export class CreateOrderItemDto {
  @IsString()
  @IsNotEmpty()
  productId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  customerName!: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(150)
  email?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  phone!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  address!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  city!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  township?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @IsEnum(PaymentMethod)
  paymentMethod!: PaymentMethod;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  paymentProofUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  paymentReference?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({
    each: true,
  })
  @Type(() => CreateOrderItemDto)
  items!: CreateOrderItemDto[];
}