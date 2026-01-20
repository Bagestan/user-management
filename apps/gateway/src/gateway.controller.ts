import { LoginDto } from '@common/dtos/login.dto';
import { RegisterDto } from '@common/dtos/register.dto';
import { JwtAuthGuard } from '@core/guards/jwt-auth.guard';
import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller()
export class GatewayController {
  constructor(@Inject('AUTH_SERVICE') private authClient: ClientProxy) {}

  @Post('auth/register')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async register(@Body() credentials: RegisterDto) {
    return await firstValueFrom(this.authClient.send('register', credentials));
  }

  @Post('auth/login')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async login(@Body() credentials: LoginDto) {
    return await firstValueFrom(this.authClient.send('login', credentials));
  }

  @Get('auth/users')
  @UseGuards(JwtAuthGuard)
  async getAllUsers() {
    return await firstValueFrom(this.authClient.send('getAllUsers', {}));
  }
}
