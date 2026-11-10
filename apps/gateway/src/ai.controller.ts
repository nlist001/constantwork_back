import { Controller, Get, Post, Param, Body, Redirect, UseGuards, Put, Delete, Query, UseInterceptors, Inject } from '@nestjs/common';

//import { AuthGuard } from '@nestjs/passport';
import { Logger } from '@nestjs/common';
//import { MessagePattern, EventPattern } from '@nestjs/microservices';
import { TaskDTO, UpdateTaskDTO,  FilterDTO, ITask } from '@app/contract/todo';
import { AiEvents } from '@app/contract/ai';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BodyIdCacheInterceptor } from './cache/bodyid-cache.interceptor';
import { AI_SERVICE } from './constants';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { AiDTO } from '@app/contract/ai';

@ApiTags('ai')
@Controller()
export class AiController {
  private logger = new Logger('AiController');

  constructor(
    @Inject(AI_SERVICE) private readonly aiService: ClientProxy

  ) {}



  @Post('aitask/break')
  @UseInterceptors(BodyIdCacheInterceptor)
  async breakOnSubtasks(@Body() task: UpdateTaskDTO ) {
    this.logger.verbose('breakOnSubtasks',task);

    return await lastValueFrom<ITask[]>(
      this.aiService.send(AiEvents.breakTaskOnSubtasks,task)
    )
  }




}