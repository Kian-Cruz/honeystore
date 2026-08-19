import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import {
  type CustomerPayload,
  type CustomerRequest,
} from "./customer-auth.guard";

@Injectable()
export class OptionalCustomerAuthGuard
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

    if (!authorization) {
      return true;
    }

    if (
      !authorization.startsWith("Bearer ")
    ) {
      throw new UnauthorizedException(
        "Invalid authorization header"
      );
    }

    try {
      const payload =
        await this.jwtService.verifyAsync<CustomerPayload>(
          authorization.slice(7)
        );

      if (payload.role !== "customer") {
        throw new UnauthorizedException();
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