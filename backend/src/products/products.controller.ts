import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";

import { AdminAuthGuard } from "../auth/guards/admin-auth.guard";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductsService } from "./products.service";

@Controller("products")
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService
  ) {}

  // ADMIN: CREATE
  @Post()
  @UseGuards(AdminAuthGuard)
  create(
    @Body() createProductDto: CreateProductDto
  ) {
    return this.productsService.create(
      createProductDto
    );
  }

  // PUBLIC: READ ALL
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  // PUBLIC: READ FEATURED
  @Get("featured")
  findFeatured() {
    return this.productsService.findFeatured();
  }

  // PUBLIC: READ ONE
  @Get(":slug")
  findOne(@Param("slug") slug: string) {
  return this.productsService.findBySlug(slug);
  }

  // ADMIN: UPDATE
  @Patch(":id")
  @UseGuards(AdminAuthGuard)
  update(
    @Param("id") id: string,
    @Body() updateProductDto: UpdateProductDto
  ) {
    return this.productsService.update(
      id,
      updateProductDto
    );
  }

  // ADMIN: DELETE
  @Delete(":id")
  @UseGuards(AdminAuthGuard)
  remove(@Param("id") id: string) {
    return this.productsService.remove(id);
  }
}