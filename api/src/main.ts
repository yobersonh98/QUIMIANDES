import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('QuimiAndes API')
    .setDescription('API de QuimiAndes')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, documentFactory);

  // Habilitar CORS
  app.enableCors({
    origin: '*',
    methods: 'GET, POST, PUT, DELETE, PATCH',
    allowedHeaders: 'Content-Type, Authorization',
  });

  // Configuración del ValidationPipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // ❗ Elimina las propiedades desconocidas
      forbidNonWhitelisted: false, // No lanza error si llegan propiedades extra
      transform: true, // Convierte los datos al tipo esperado
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
