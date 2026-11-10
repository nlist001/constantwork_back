import { Controller, Get, Post, Param, Body, Redirect, UseGuards, Put, Delete, Query, UseInterceptors, Inject } from '@nestjs/common';

//import { AuthGuard } from '@nestjs/passport';
import { Logger } from '@nestjs/common';
//import { MessagePattern, EventPattern } from '@nestjs/microservices';
import { TaskDTO, UpdateTaskDTO,  FilterDTO, ITask, TodoEvents } from '@app/contract/todo';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BodyIdCacheInterceptor } from './cache/bodyid-cache.interceptor';
import { TODO_SERVICE } from './constants';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

//создавать, читать, обновлять и удалять задачи.
@ApiTags('task')
@Controller()
export class TodoController {
  private logger = new Logger('TodoController');

  constructor(
    @Inject(TODO_SERVICE) private readonly todoService: ClientProxy

  ) {}

  @Get('tasks')
  @ApiOperation({ summary: "Get task list" })
  async getTaskList(@Query() paginationAndFilterDto: FilterDTO): Promise<ITask[]> {
    this.logger.verbose('paginationAndFilterDto',paginationAndFilterDto)
    return await lastValueFrom<ITask[]>(
      this.todoService.send(TodoEvents.getTaskList,paginationAndFilterDto)
    )
  }

  @Post('task/create')
  @ApiOperation({ summary: "Create task " })
  async create(@Body() task: TaskDTO ): Promise<ITask> {
   
    return await lastValueFrom<ITask>(
      this.todoService.send(TodoEvents.createTask,task)
    )
  }

  @Post('tasks/create')
  @ApiOperation({ summary: "Create tasks " })
  async createTasks(@Body() tasks: TaskDTO[] ):  Promise<ITask[]> {
    return await lastValueFrom<ITask[]>(
      this.todoService.send(TodoEvents.createSeveralTasks,tasks)
    )
  }

  @Put('task/update')
  async update(@Body() task: UpdateTaskDTO ):  Promise<ITask>  {
    return await lastValueFrom<ITask>(
      this.todoService.send(TodoEvents.updateTask,task)
    )
  }

  @Get('task/:id')
  async read(@Param('id') id: string) {
    this.logger.verbose('Param findById:  ',id);

    return await lastValueFrom(
      this.todoService.send(TodoEvents.getTaskById,id)
    )
  }

  @Delete('task/:id')
  async delete(@Param('id') id: string) {
    return await lastValueFrom(
      this.todoService.send(TodoEvents.deleteTask,id)
    )
  }




}