import { Module } from "@nestjs/common";
import { TodoRepository } from "./todo.repository";
import { TodoService } from "./todo.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TaskEntity } from "./task.entity";
import { TodoController } from "./todo.controller";
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true, 
      }),
  
      TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          type: 'postgres',
          host: config.get<string>('DB_HOST'),
          port: config.get<number>('DB_PORT'),
          username: config.get<string>('DB_USERNAME'),
          password: config.get<string>('DB_PASSWORD'),
          database: config.get<string>('DB_NAME'),
          autoLoadEntities: true,
          synchronize: true, // Включай только на этапе разработки!
        })
      }),
      TypeOrmModule.forFeature([TaskEntity])
    ],
    controllers:[TodoController],
    providers: [
      {
        provide: 'ITodoRepository', // Токен для инъекции
        useClass: TodoRepository,
      },
  
      TodoService,
    ],
  })
  export class TodoModule {}