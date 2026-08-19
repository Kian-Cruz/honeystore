import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule
  );

  app.setGlobalPrefix("api");

  const allowedOrigins = [
    "http://localhost:3000",
    process.env.FRONTEND_URL,
  ].filter(
    (origin): origin is string =>
      Boolean(origin)
  );

  app.enableCors({
    origin(
      origin,
      callback
    ) {
      if (
        !origin ||
        allowedOrigins.includes(origin)
      ) {
        callback(null, true);
        return;
      }

      callback(
        new Error(
          `Origin ${origin} is not allowed by CORS`
        )
      );
    },
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  );

  const port = Number(
    process.env.PORT ?? 4000
  );

  await app.listen(port, "0.0.0.0");

  console.log(
    `HONEYSTORE API running on port ${port}`
  );
}

bootstrap();