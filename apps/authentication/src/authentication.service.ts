import { LoginDto } from '@common/dtos/login.dto';
import { RegisterDto } from '@common/dtos/register.dto';
import { LoginResponseRto } from '@common/rtos/login-response.rto';
import { RegisterResponseRto } from '@common/rtos/register-response.rto';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { UserRepository } from './users/user.repository';
import { hash, compare } from 'bcrypt';

const BCRYPT_SALT_ROUNDS = 10;

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

      const hashedPassword = await hash(
        credentials.password || '',
        BCRYPT_SALT_ROUNDS,
      );

      const user = await this.userRepository.create({
        email: credentials.email,
        password: hashedPassword,
      });

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

  private async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findByEmail(email);

    if (user && (await compare(password, user.password))) {
      const { password: _, ...result } = user.toObject();
      return result;
    }

    return null;
  }

  async loginUser(credentials: LoginDto): Promise<LoginResponseRto> {
    try {
      const { email, password } = credentials;
      const user = await this.validateUser(email, password);

      if (!user) {
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
