import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";

import { AdminAuthGuard } from "../auth/guards/admin-auth.guard";
import {
  CustomerAuthGuard,
  type CustomerRequest,
} from "../customer-auth/guards/customer-auth.guard";
import { OptionalCustomerAuthGuard } from "../customer-auth/guards/optional-customer-auth.guard";
import { CreateOrderDto } from "./dto/create-order.dto";
import { TrackOrderDto } from "./dto/track-order.dto";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import { OrdersService } from "./orders.service";

@Controller("orders")
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService
  ) {}

  // PUBLIC: TRACK AN ORDER
  @Post("track")
  trackOrder(
    @Body() trackOrderDto: TrackOrderDto
  ) {
    return this.ordersService.trackOrder(
      trackOrderDto
    );
  }

  // PUBLIC OR LOGGED-IN CUSTOMER: CREATE
  @Post()
  @UseGuards(OptionalCustomerAuthGuard)
  create(
    @Body() createOrderDto: CreateOrderDto,
    @Req() request: CustomerRequest
  ) {
    return this.ordersService.create(
      createOrderDto,
      request.customer?.sub
    );
  }

  // CUSTOMER: READ OWN ORDERS
  @Get("my-orders")
  @UseGuards(CustomerAuthGuard)
  findMyOrders(
    @Req() request: CustomerRequest
  ) {
    return this.ordersService.findForCustomer(
      request.customer!.sub
    );
  }

  // ADMIN: READ ALL ORDERS
  @Get()
  @UseGuards(AdminAuthGuard)
  findAll() {
    return this.ordersService.findAll();
  }

  // ADMIN: READ ONE ORDER
  @Get(":id")
  @UseGuards(AdminAuthGuard)
  findOne(@Param("id") id: string) {
    return this.ordersService.findOne(id);
  }

  // ADMIN: UPDATE ORDER STATUS
  @Patch(":id/status")
  @UseGuards(AdminAuthGuard)
  updateStatus(
    @Param("id") id: string,
    @Body()
    updateOrderStatusDto: UpdateOrderStatusDto
  ) {
    return this.ordersService.updateStatus(
      id,
      updateOrderStatusDto
    );
  }
}