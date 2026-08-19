import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type { Request } from "express";

export type CustomerPayload = {
  sub: string;
  email: string;
  role: "customer";
};

export type CustomerRequest = Request & {
  customer?: CustomerPayload;
};

@Injectable()
export class CustomerAuthGuard
  implements CanActivate
{
  constructor(
    private readonly jwtService: JwtService
  ) {}

  async canActivate(
    context: ExecutionContext
  ): Promise<boolean> {
    const request =
      context.switchToHttp().getRequest<CustomerRequest>();

    const authorization =
      request.headers.authorization;

    if (
      !authorization?.startsWith("Bearer ")
    ) {
      throw new UnauthorizedException(
        "Customer authentication is required"
      );
    }

    const token = authorization.slice(7);

    try {
      const payload =
        await this.jwtService.verifyAsync<CustomerPayload>(
          token
        );

      if (payload.role !== "customer") {
        throw new UnauthorizedException(
          "Customer access is required"
        );
      }

      request.customer = payload;

      return true;
    } catch {
      throw new UnauthorizedException(
        "Invalid or expired customer token"
      );
    }
  }
}