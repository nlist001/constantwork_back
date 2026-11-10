import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule, { cors: true });

  const config = new DocumentBuilder()
    .setTitle('Todo API')
    .setDescription('Документация сервиса задач с приоритетами и статусами')
    .setVersion('1.0')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe({
    // Очищает входящий объект от полей, которых нет в DTO
    whitelist: true, 
    
    // Выкидывает ошибку, если в запросе есть лишние поля (защита от лишнего)
    forbidNonWhitelisted: true, 
    
    // АВТО-ПРЕОБРАЗОВАНИЕ: превращает строки в числа и объекты в классы DTO
    transform: true, 
    
    // Настройки трансформации для @Query параметров
    transformOptions: { enableImplicitConversion: true },
  }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
