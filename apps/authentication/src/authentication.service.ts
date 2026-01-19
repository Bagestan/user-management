import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { LoginDto } from 'common/dtos/login.dto';
import { RegisterDto } from 'common/dtos/register.dto';
import { LoginResponseRto } from 'common/rtos/login-response.rto';
import { RegisterResponseRto } from 'common/rtos/register-response.rto';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(credentials: RegisterDto): Promise<RegisterResponseRto> {
    try {
      const existingUser = await this.userRepository.findByEmail(
        credentials.email,
      );

      if (existingUser) {
        throw new RpcException({
          statusCode: 409,
          message: 'User already exists',
        });
      }

      const user = await this.userRepository.create(credentials);

      return { id: `${user._id}`, email: user.email };
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }

      throw new RpcException({
        statusCode: 500,
        message: error.message || 'Failed to register user',
      });
    }
  }

  async loginUser(credentials: LoginDto): Promise<LoginResponseRto> {
    try {
      const user = await this.userRepository.findByEmail(credentials.email);

      if (!user) {
        throw new RpcException({
          statusCode: 401,
          message: 'Invalid credentials',
        });
      }

      if (user.password !== credentials.password) {
        throw new RpcException({
          statusCode: 401,
          message: 'Invalid credentials',
        });
      }

      const payload = { sub: user._id, email: user.email };
      const accessToken = this.jwtService.sign(payload);

      return {
        access_token: accessToken,
        id: user._id.toString(),
        email: user.email,
      };
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }

      throw new RpcException({
        statusCode: 500,
        message: 'Failed to login',
      });
    }
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.userRepository.findById(payload.sub);

      if (!user) {
        throw new RpcException({
          statusCode: 401,
          message: 'Invalid token',
        });
      }

      return {
        id: user._id,
        email: user.email,
      };
    } catch (error) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired token',
      });
    }
  }

  async getAllUsers() {
    try {
      return await this.userRepository.findAll();
    } catch (error) {
      throw new RpcException({
        statusCode: 500,
        message: 'Failed to get users',
      });
    }
  }
}
