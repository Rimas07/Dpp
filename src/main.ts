/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { JsonExceptionFilter } from './filters/json-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Add global validation pipe with detailed error messages
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
    exceptionFactory: (errors) => {
      const messages = errors.map(error => ({
        property: error.property,
        constraints: error.constraints,
      }));
      return {
        statusCode: 400,
        message: 'Validation failed',
        errors: messages,
      };
    },
  }));

  // Add global JSON exception filter
  app.useGlobalFilters(new JsonExceptionFilter());

  const config = app.get(ConfigService);
  const port = config.get('server.port') || 3005;

  const logger = new Logger('Bootstrap');
  logger.log(`Starting application on port ${port}`);
  logger.log(`Config loaded: ${config.get('server.port') ? 'Yes' : 'No'}`);

  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
}

bootstrap().catch((error) => {
  console.error('Error starting application:', error);
  process.exit(1);
});

// /* eslint-disable prettier/prettier */
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// // import middleware1 from './middlewares/middleware1';
// import { ValidationPipe } from '@nestjs/common';
// // Добавляем импорт HttpExceptionFilter
// // import { HttpExceptionFilter } from './filters/http-exception.filter'; // Укажите правильный путь к вашему фильтру

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   // app.use(middleware1);

//   // app.useGlobalFilters(new HttpExceptionFilter(loggerInstance));
//   app.useGlobalPipes(new ValidationPipe({ disableErrorMessages: true, whitelist: true, forbidNonWhitelisted:true}));

//   await app.listen(process.env.PORT ?? 3000);
// }
// void bootstrap();
