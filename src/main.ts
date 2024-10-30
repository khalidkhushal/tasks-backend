import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from './utils/secrets';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/handleError';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.setGlobalPrefix("/api/v1") // we can add global prefix as well fro APIs But I have added with every API to access root (/) without global prefix

  const config = new DocumentBuilder()
    .setTitle('Tasks')
    .setDescription('Tasks APIs')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  app.useGlobalFilters(new AllExceptionsFilter());


  await app.listen(PORT ?? 3000);

  console.log(`App is running on port ${PORT}`)
}

bootstrap();
