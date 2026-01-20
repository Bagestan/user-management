import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const contextType = context.getType();
    const now = Date.now();

    if (contextType === 'http') {
      const request = context.switchToHttp().getRequest();
      const response = context.switchToHttp().getResponse();

      const { method, url } = request;
      this.logger.log(`   --> ${method} ${url}`);

      return next.handle().pipe(
        tap(() => {
          const statusCode = response.statusCode;
          const responseTime = Date.now() - now;

          this.logger.log(
            `<-- ${method} ${url} (${statusCode}) ${responseTime}ms`,
          );
        }),
      );
    }

    if (contextType === 'rpc') {
      const rpcContext = context.switchToRpc();
      const data = rpcContext.getData();

      const pattern =
        context.getHandler().name ||
        context.getClass().name + '.' + context.getHandler().name;

      this.logger.log(`   --> RPC ${pattern}`);

      return next.handle().pipe(
        tap(() => {
          const responseTime = Date.now() - now;
          this.logger.log(`<-- RPC ${pattern} ${responseTime}ms`);
        }),
      );
    }
    return next.handle();
  }
}
