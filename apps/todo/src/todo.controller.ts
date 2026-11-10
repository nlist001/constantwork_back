import { Controller,  Body, } from '@nestjs/common';

//import { AuthGuard } from '@nestjs/passport';
import { Logger } from '@nestjs/common';
//import { MessagePattern, EventPattern } from '@nestjs/microservices';
import { TaskDTO, UpdateTaskDTO , FilterDTO, TodoEvents } from '@app/contract/todo';
import { TodoService } from './todo.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MessagePattern, Payload } from '@nestjs/microservices';

//создавать, читать, обновлять и удалять задачи.
@ApiTags('todo')
@Controller()
export class TodoController {
  private logger = new Logger('TodoController');

  constructor(
    private todoService: TodoService,
  ) {}

  @MessagePattern(TodoEvents.getTaskList)
  @ApiOperation({ summary: "Get task list" })
  async getTaskList(@Payload() paginationAndFilterDto: FilterDTO) {
    return await this.todoService.getTaskList(paginationAndFilterDto);
  }


  @MessagePattern(TodoEvents.createTask)
  @ApiOperation({ summary: "Create task " })
  createTask(@Payload() task: TaskDTO ) {
    return this.todoService.createTask(task);
  }

  @MessagePattern(TodoEvents.createSeveralTasks)
  @ApiOperation({ summary: "Create tasks " })
  createSeveralTasks(@Payload() tasks: TaskDTO[] ) {

    return this.todoService.createSeveralTasks(tasks);
  }

  @MessagePattern(TodoEvents.updateTask)
  updateTask(@Payload() task: UpdateTaskDTO ) {
    return this.todoService.updateTask(task);
  }

  @MessagePattern(TodoEvents.getTaskById)
  getTaskById(@Payload() id: string) {
    this.logger.verbose('Payload findById:  ',id);

    return this.todoService.getTaskById(id);
  }

  @MessagePattern(TodoEvents.deleteTask)
  deleteTask(@Payload() id: string) {
    return this.todoService.deleteTask(id);
  }



}