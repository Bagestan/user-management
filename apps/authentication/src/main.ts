import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuthenticationModule } from './authentication.module';
import { LoggingInterceptor } from '@core/interceptors/logging/logging.interceptor';

async function bootstrap() {
  const appContext =
    await NestFactory.createApplicationContext(AuthenticationModule);
  const configService = appContext.get(ConfigService);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthenticationModule,
    {
      transport: Transport.TCP,
      options: {
        host: configService.get<string>('AUTH_SERVICE_HOST') || 'localhost',
        port: configService.get<number>('AUTH_SERVICE_PORT') || 3001,
      },
    },
  );

  app.useGlobalInterceptors(new LoggingInterceptor());
  await app.listen();
}
bootstrap();
