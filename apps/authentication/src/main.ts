import { NestFactory } from '@nestjs/core';
import { AuthenticationModule } from './authentication.module';
import {
  AsyncMicroserviceOptions,
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<AsyncMicroserviceOptions>(
    AuthenticationModule,
    {
      useFactory: (configService: ConfigService) => ({
        transport: Transport.TCP,
        options: {
          host: configService.get<string>('AUTH_SERVICE_HOST'),
          port: configService.get<number>('AUTH_SERVICE_PORT'),
        },
      }),
      inject: [ConfigService],
    },
  );
  await app.listen();
}
bootstrap();
