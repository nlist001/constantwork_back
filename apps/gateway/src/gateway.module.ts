import { Module } from '@nestjs/common';
import { AI_SERVICE, TODO_SERVICE } from './constants';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppCacheModule } from './cache/app-cache.module';
import { TodoController } from './todo.controller';
import { AiController } from './ai.controller';
import { ConfigModule } from '@nestjs/config';


@Module({
  controllers: [TodoController, AiController ],
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env', 
      isGlobal: true,
    }),
    ClientsModule.register([
      {
        name: TODO_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RMQ_URL || ''],
          queue: 'todo_queue',
          queueOptions: {
            durable: false
          },
        },
      },
      {
        name: AI_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RMQ_URL || ''],
          queue: 'ai_queue',
          queueOptions: {
            durable: false
          },
        },
      },
    ]),

    AppCacheModule
  ]
})
export class GatewayModule {}
