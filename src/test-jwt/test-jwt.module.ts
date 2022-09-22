import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TestJwtService } from './test-jwt.service';
import { TestJwtController } from './test-jwt.controller';
import { AuthModule } from 'src/Modules/auth/auth.module';
import { JwtValidateMiddleware } from 'src/middelwares/jwt_validate_middelware';

@Module({
  imports: [AuthModule],
  providers: [TestJwtService],
  controllers: [TestJwtController],
})
export class TestJwtModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtValidateMiddleware).forRoutes(TestJwtController);
  }
}
