import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { PORT, CORS } from './utils/EnvironmentVariables';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });
  app.use(cookieParser());
  await app
    .listen(PORT)
    .then(() => {
      console.log('Server is up and listening to port ' + PORT);
    })
    .catch((err: any) => {
      console.error('Error!', err.massage);
    });
}
bootstrap();
