import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type { Request } from "express";

type AdminPayload = {
  sub: string;
  email: string;
  role: "admin";
};

type AuthenticatedRequest = Request & {
  admin?: AdminPayload;
};

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService
  ) {}

  async canActivate(
    context: ExecutionContext
  ): Promise<boolean> {
    const request =
      context.switchToHttp().getRequest<AuthenticatedRequest>();

    const authorization = request.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      throw new UnauthorizedException(
        "Admin authentication is required"
      );
    }

    const token = authorization.slice(7);

    try {
      const payload =
        await this.jwtService.verifyAsync<AdminPayload>(
          token
        );

      if (payload.role !== "admin") {
        throw new UnauthorizedException(
          "Admin access is required"
        );
      }

      request.admin = payload;

      return true;
    } catch {
      throw new UnauthorizedException(
        "Invalid or expired access token"
      );
    }
  }
}