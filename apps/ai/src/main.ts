import { NestFactory } from '@nestjs/core';
import { AiModule } from './ai.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AiModule,{
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://admin:1@localhost:5672'],
      queue: 'ai_queue',
      queueOptions: {
        durable: false
      },
    },
    // transport: Transport.TCP,
    // options: {
    //   port: 3002
    // }
  });

  await app.listen();


}
bootstrap();
