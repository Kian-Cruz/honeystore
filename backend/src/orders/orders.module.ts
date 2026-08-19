import { Module } from "@nestjs/common";

import { AuthModule } from "../auth/auth.module";
import { CustomerAuthModule } from "../customer-auth/customer-auth.module";
import { PrismaModule } from "../prisma/prisma.module";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    CustomerAuthModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}