import {
  Module,
  OnModuleInit,
} from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AdminAuthGuard } from "./guards/admin-auth.guard";

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => {
        const secret = process.env.JWT_SECRET;

        if (!secret) {
          throw new Error(
            "JWT_SECRET is missing from the backend .env file"
          );
        }

        return {
          secret,
          signOptions: {
            expiresIn: "1h",
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AdminAuthGuard,
  ],
  exports: [
    JwtModule,
    AdminAuthGuard,
  ],
})
export class AuthModule implements OnModuleInit {
  onModuleInit() {
    if (
      !process.env.ADMIN_EMAIL ||
      !process.env.ADMIN_PASSWORD_HASH
    ) {
      throw new Error(
        "ADMIN_EMAIL or ADMIN_PASSWORD_HASH is missing"
      );
    }
  }
}