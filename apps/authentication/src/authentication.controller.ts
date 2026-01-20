import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthenticationService } from './authentication.service';
import { RegisterDto } from '@common/dtos/register.dto';
import { LoginDto } from '@common/dtos/login.dto';

@Controller()
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @MessagePattern('register')
  async register(@Payload() credentials: RegisterDto) {
    return await this.authenticationService.registerUser(credentials);
  }

  @MessagePattern('login')
  async login(@Payload() credentials: LoginDto) {
    return await this.authenticationService.loginUser(credentials);
  }

  @MessagePattern('validateToken')
  async validateToken(@Payload() data: { token: string }) {
    return await this.authenticationService.validateToken(data.token);
  }

  @MessagePattern('getAllUsers')
  async allUsers() {
    return await this.authenticationService.getAllUsers();
  }
}
