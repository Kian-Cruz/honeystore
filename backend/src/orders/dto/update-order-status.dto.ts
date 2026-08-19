import { IsEnum } from "class-validator";

import {
  OrderStatus,
  PaymentStatus,
} from "../../generated/prisma/client";

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status!: OrderStatus;

  @IsEnum(PaymentStatus)
  paymentStatus!: PaymentStatus;
}