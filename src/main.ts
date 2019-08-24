// import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as proxy from 'express-http-proxy';

import { AppModule } from './app.module';

const port = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(
    /^\/(?!(graphql|download)).*/,
    proxy('http://localhost:8080', {
      proxyReqPathResolver(req) {
        return req.originalUrl;
      },
    }),
  );
  // app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);
}
bootstrap();
