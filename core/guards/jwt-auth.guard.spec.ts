import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  it('should be defined', () => {
    const mockClientProxy = {} as ClientProxy;
    expect(new JwtAuthGuard(mockClientProxy)).toBeDefined();
  });
});
