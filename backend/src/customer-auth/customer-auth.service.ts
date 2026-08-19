import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";

import { PrismaService } from "../prisma/prisma.service";
import { LoginCustomerDto } from "./dto/login-customer.dto";
import { RegisterCustomerDto } from "./dto/register.dto";

@Injectable()
export class CustomerAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async register(
    registerDto: RegisterCustomerDto
  ) {
    const email =
      registerDto.email.trim().toLowerCase();

    const existingUser =
      await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (existingUser) {
      throw new ConflictException(
        "An account with this email already exists"
      );
    }

    const passwordHash = await bcrypt.hash(
      registerDto.password,
      12
    );

    const user = await this.prisma.user.create({
      data: {
        name: registerDto.name.trim(),
        email,
        passwordHash,
        phone:
          registerDto.phone?.trim() || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
      },
    });

    const accessToken =
      await this.jwtService.signAsync({
        sub: user.id,
        email: user.email,
        role: "customer",
      });

    return {
      accessToken,
      user,
    };
  }

  async login(loginDto: LoginCustomerDto) {
    const email =
      loginDto.email.trim().toLowerCase();

    const user =
      await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (!user) {
      throw new UnauthorizedException(
        "Invalid email or password"
      );
    }

    const passwordMatches =
      await bcrypt.compare(
        loginDto.password,
        user.passwordHash
      );

    if (!passwordMatches) {
      throw new UnauthorizedException(
        "Invalid email or password"
      );
    }

    const accessToken =
      await this.jwtService.signAsync({
        sub: user.id,
        email: user.email,
        role: "customer",
      });

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        createdAt: user.createdAt,
      },
    };
  }
}