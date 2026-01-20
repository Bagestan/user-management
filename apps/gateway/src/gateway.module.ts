import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

const THROTTLE_TTL = 60000;
const THROTTLE_LIMIT = 10;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ClientsModule.registerAsync([
      {
        name: 'AUTH_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('AUTH_SERVICE_HOST') || 'localhost',
            port: configService.get<number>('AUTH_SERVICE_PORT') || 3001,
          },
        }),
        inject: [ConfigService],
      },
    ]),
    ThrottlerModule.forRoot([
      {
        ttl: THROTTLE_TTL,
        limit: THROTTLE_LIMIT,
      },
    ]),
  ],
  controllers: [GatewayController],
  providers: [GatewayService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class GatewayModule {}
