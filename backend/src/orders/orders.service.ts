import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { TrackOrderDto } from "./dto/track-order.dto";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  // CREATE ORDER
  async create(
    createOrderDto: CreateOrderDto,
    userId?: string
  ) {
    const quantities = new Map<string, number>();

    for (const item of createOrderDto.items) {
      quantities.set(
        item.productId,
        (quantities.get(item.productId) ?? 0) +
          item.quantity
      );
    }

    const productIds = Array.from(
      quantities.keys()
    );

    const products =
      await this.prisma.product.findMany({
        where: {
          id: {
            in: productIds,
          },
          active: true,
        },
      });

    if (products.length !== productIds.length) {
      throw new NotFoundException(
        "One or more products are unavailable"
      );
    }

    const productsById = new Map(
      products.map((product) => [
        product.id,
        product,
      ])
    );

    let subtotal = 0;

    for (const [
      productId,
      quantity,
    ] of quantities) {
      const product = productsById.get(productId);

      if (!product) {
        throw new NotFoundException(
          "Product not found"
        );
      }

      if (product.stock < quantity) {
        throw new BadRequestException(
          `${product.name} does not have enough stock`
        );
      }

      subtotal += product.price * quantity;
    }

    const shippingFee =
      subtotal >= 200000 ? 0 : 5000;

    const total = subtotal + shippingFee;

    const orderNumber = `HS-${Date.now()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    const paymentProofUrl =
      createOrderDto.paymentProofUrl?.trim() ||
      null;

    const paymentReference =
      createOrderDto.paymentReference?.trim() ||
      null;

    return this.prisma.$transaction(
      async (transaction) => {
        for (const [
          productId,
          quantity,
        ] of quantities) {
          const updated =
            await transaction.product.updateMany({
              where: {
                id: productId,
                active: true,
                stock: {
                  gte: quantity,
                },
              },
              data: {
                stock: {
                  decrement: quantity,
                },
              },
            });

          if (updated.count !== 1) {
            throw new BadRequestException(
              "A product no longer has enough stock"
            );
          }
        }

        return transaction.order.create({
          data: {
            userId: userId ?? null,
            orderNumber,
            customerName:
              createOrderDto.customerName.trim(),
            email:
              createOrderDto.email?.trim() ||
              null,
            phone:
              createOrderDto.phone.trim(),
            address:
              createOrderDto.address.trim(),
            city:
              createOrderDto.city.trim(),
            township:
              createOrderDto.township?.trim() ||
              null,
            notes:
              createOrderDto.notes?.trim() ||
              null,
            paymentMethod:
              createOrderDto.paymentMethod,
            paymentStatus: "PENDING",
            paymentProofUrl,
            paymentReference,
            subtotal,
            shippingFee,
            total,
            items: {
              create: Array.from(
                quantities.entries()
              ).map(
                ([productId, quantity]) => {
                  const product =
                    productsById.get(productId)!;

                  return {
                    productId: product.id,
                    name: product.name,
                    slug: product.slug,
                    image: product.image,
                    price: product.price,
                    quantity,
                  };
                }
              ),
            },
          },
          include: {
            items: true,
          },
        });
      }
    );
  }

  // PUBLIC: TRACK ORDER
  async trackOrder(
    trackOrderDto: TrackOrderDto
  ) {
    const orderNumber =
      trackOrderDto.orderNumber
        .trim()
        .toUpperCase();

    const suppliedPhone = normalizePhone(
      trackOrderDto.phone
    );

    const order =
      await this.prisma.order.findUnique({
        where: {
          orderNumber,
        },
        include: {
          items: true,
        },
      });

    if (
      !order ||
      normalizePhone(order.phone) !==
        suppliedPhone
    ) {
      throw new NotFoundException(
        "Order not found or the phone number does not match"
      );
    }

    return order;
  }

  // CUSTOMER: READ OWN ORDERS
  async findForCustomer(userId: string) {
    return this.prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // ADMIN: READ ALL ORDERS
  async findAll() {
    return this.prisma.order.findMany({
      include: {
        items: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // ADMIN: READ ONE ORDER
  async findOne(id: string) {
    const order =
      await this.prisma.order.findUnique({
        where: {
          id,
        },
        include: {
          items: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      });

    if (!order) {
      throw new NotFoundException(
        "Order not found"
      );
    }

    return order;
  }

  // ADMIN: UPDATE ORDER STATUS
  async updateStatus(
    id: string,
    updateOrderStatusDto: UpdateOrderStatusDto
  ) {
    const order = await this.findOne(id);

    if (
      order.status === "CANCELLED" &&
      updateOrderStatusDto.status !==
        "CANCELLED"
    ) {
      throw new BadRequestException(
        "A cancelled order cannot be reopened"
      );
    }

    return this.prisma.$transaction(
      async (transaction) => {
        const isBeingCancelled =
          updateOrderStatusDto.status ===
            "CANCELLED" &&
          order.status !== "CANCELLED";

        if (isBeingCancelled) {
          for (const item of order.items) {
            await transaction.product.updateMany({
              where: {
                id: item.productId,
              },
              data: {
                stock: {
                  increment: item.quantity,
                },
              },
            });
          }
        }

        const isBeingMarkedPaid =
          updateOrderStatusDto.paymentStatus ===
            "PAID" &&
          order.paymentStatus !== "PAID";

        return transaction.order.update({
          where: {
            id,
          },
          data: {
            status:
              updateOrderStatusDto.status,
            paymentStatus:
              updateOrderStatusDto.paymentStatus,
            paidAt: isBeingMarkedPaid
              ? new Date()
              : order.paidAt,
          },
          include: {
            items: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        });
      }
    );
  }
}

function normalizePhone(value: string) {
  return value.replace(/\D/g, "");
}