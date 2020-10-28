import { NestFactory } from '@nestjs/core';
import { AppModule } from './App/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
    },
  });
  await app.listen(3000);
}
bootstrap();
