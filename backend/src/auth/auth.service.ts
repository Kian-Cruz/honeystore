import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";

import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(loginDto: LoginDto) {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPasswordHash =
      process.env.ADMIN_PASSWORD_HASH;

    if (!adminEmail || !adminPasswordHash) {
      throw new InternalServerErrorException(
        "Admin authentication is not configured"
      );
    }

    const emailMatches =
      loginDto.email.toLowerCase() ===
      adminEmail.toLowerCase();

    const passwordMatches = await bcrypt.compare(
      loginDto.password,
      adminPasswordHash
    );

    if (!emailMatches || !passwordMatches) {
      throw new UnauthorizedException(
        "Invalid email or password"
      );
    }

    const accessToken = await this.jwtService.signAsync({
      sub: adminEmail,
      email: adminEmail,
      role: "admin",
    });

    return {
      accessToken,
      admin: {
        email: adminEmail,
        role: "admin",
      },
    };
  }
}