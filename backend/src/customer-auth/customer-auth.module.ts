import { Module } from "@nestjs/common";

import { AuthModule } from "../auth/auth.module";
import { PrismaModule } from "../prisma/prisma.module";
import { CustomerAuthController } from "./customer-auth.controller";
import { CustomerAuthService } from "./customer-auth.service";
import { CustomerAuthGuard } from "./guards/customer-auth.guard";
import { OptionalCustomerAuthGuard } from "./guards/optional-customer-auth.guard";

@Module({
  imports: [
    PrismaModule,
    AuthModule,
  ],
  controllers: [CustomerAuthController],
  providers: [
    CustomerAuthService,
    CustomerAuthGuard,
    OptionalCustomerAuthGuard,
  ],
  exports: [
    CustomerAuthService,
    CustomerAuthGuard,
    OptionalCustomerAuthGuard,
  ],
})
export class CustomerAuthModule {}