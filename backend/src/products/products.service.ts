import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  // CREATE
  async create(createProductDto: CreateProductDto) {
    const existingProduct =
      await this.prisma.product.findUnique({
        where: {
          slug: createProductDto.slug,
        },
      });

    if (existingProduct) {
      throw new ConflictException(
        "A product with this slug already exists"
      );
    }

    return this.prisma.product.create({
      data: {
        ...createProductDto,
        images:
          createProductDto.images.length > 0
            ? createProductDto.images
            : [createProductDto.image],
      },
    });
  }

  // READ ALL
  findAll() {
    return this.prisma.product.findMany({
      where: {
        active: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // READ FEATURED
  findFeatured() {
    return this.prisma.product.findMany({
      where: {
        active: true,
        featured: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // READ ONE BY SLUG
  async findBySlug(slug: string) {
    const product =
      await this.prisma.product.findUnique({
        where: {
          slug,
        },
      });

    if (!product || !product.active) {
      throw new NotFoundException(
        "Product not found"
      );
    }

    return product;
  }

  // UPDATE
  async update(
    id: string,
    updateProductDto: UpdateProductDto
  ) {
    await this.findById(id);

    if (updateProductDto.slug) {
      const productWithSlug =
        await this.prisma.product.findUnique({
          where: {
            slug: updateProductDto.slug,
          },
        });

      if (
        productWithSlug &&
        productWithSlug.id !== id
      ) {
        throw new ConflictException(
          "A product with this slug already exists"
        );
      }
    }

    return this.prisma.product.update({
      where: {
        id,
      },
      data: updateProductDto,
    });
  }

  // DELETE
  async remove(id: string) {
    const product = await this.findById(id);

    await this.prisma.product.delete({
      where: {
        id,
      },
    });

    return {
      message: "Product deleted successfully",
      product,
    };
  }

  // INTERNAL ID LOOKUP
  private async findById(id: string) {
    const product =
      await this.prisma.product.findUnique({
        where: {
          id,
        },
      });

    if (!product) {
      throw new NotFoundException(
        "Product not found"
      );
    }

    return product;
  }
}