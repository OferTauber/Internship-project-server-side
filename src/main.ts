import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { PORT, CORS } from './utils/EnvironmentVariables';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: CORS });
  app.use(cookieParser());
  await app
    .listen(PORT)
    .then(() => {
      console.log('Server is up and listening to port ' + PORT);
    })
    .catch((err) => {
      console.error('Error!', err.massage);
    });
}
bootstrap();
