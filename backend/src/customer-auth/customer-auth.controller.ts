import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from "@nestjs/common";

import { CustomerAuthService } from "./customer-auth.service";
import { LoginCustomerDto } from "./dto/login-customer.dto";
import { RegisterCustomerDto } from "./dto/register.dto";

@Controller("customers/auth")
export class CustomerAuthController {
  constructor(
    private readonly customerAuthService: CustomerAuthService
  ) {}

  @Post("register")
  register(
    @Body()
    registerDto: RegisterCustomerDto
  ) {
    return this.customerAuthService.register(
      registerDto
    );
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  login(
    @Body()
    loginDto: LoginCustomerDto
  ) {
    return this.customerAuthService.login(
      loginDto
    );
  }
}