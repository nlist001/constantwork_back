import { NestFactory } from '@nestjs/core';
import { TodoModule } from './todo.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(TodoModule,{
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://admin:1@localhost:5672'],

      queue: 'todo_queue',
      queueOptions: {
        durable: false
      },
    },

    // transport: Transport.TCP,
    // options: {
    //   port: 3001
    // }
  });
  await app.listen();
}
bootstrap();
