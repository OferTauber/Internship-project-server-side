import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { PortsController } from './ports.controller';
import { PortsService } from './ports.service';
import { AuthModule } from 'src/Modules/auth/auth.module';
import { JwtValidateMiddleware } from 'src/middelwares/jwt_validate_middelware';

@Module({
  imports: [AuthModule],
  controllers: [PortsController],
  providers: [PortsService],
})
export class PortsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtValidateMiddleware).forRoutes(PortsController);
  }
}
