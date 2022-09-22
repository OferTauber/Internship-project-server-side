import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './Modules/user/users.module';
import { TestJwtModule } from './test-jwt/test-jwt.module';
import { PortsModule } from './Modules/ports/ports.module';
import { ConfigModule } from '@nestjs/config';
ConfigModule.forRoot();

@Module({
  imports: [UserModule, TestJwtModule, PortsModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
