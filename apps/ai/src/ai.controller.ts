import { AiService } from './ai.service';
import { Controller, Logger } from "@nestjs/common";
import { AiDTO, AiEvents } from "@app/contract/ai";
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UpdateTaskDTO } from '@app/contract/todo';

@Controller()
export class AiController {
  private logger = new Logger('AiController');

  constructor(private readonly aiService: AiService) {}



  @MessagePattern(AiEvents.breakTaskOnSubtasks)
  breakOnSubtasks(@Payload() task: UpdateTaskDTO ) {
    this.logger.verbose('breakOnSubtasks',task);

    return this.aiService.breakOnSubtasks(task);
  }

}