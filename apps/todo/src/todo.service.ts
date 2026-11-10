import { Inject, Injectable, Logger } from "@nestjs/common";
import { TaskDTO, UpdateTaskDTO,FilterDTO } from "@app/contract/todo";
import { TaskEntity } from "./task.entity";
import type { ITaskList, ITodoRepository } from "./todo.model";


@Injectable()
export class TodoService {
  private logger = new Logger('TodoService');

  constructor(
    @Inject('ITodoRepository') 
    private readonly todoRepository: ITodoRepository,
  ) {}

  async getTaskList(paginationAndFilterDto: FilterDTO): Promise<ITaskList> {

    const { page, limit } = paginationAndFilterDto;
    const skip = (page - 1) * limit;

    const [data, total] = await this.todoRepository.findAndCount({
      take: limit,
      skip,
    }, paginationAndFilterDto);

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };

  }

  async getTaskById(id: string): Promise<TaskEntity | null> {
    this.logger.verbose('findById:  ',id);

    return await this.todoRepository.findById(id);
  }

  async createTask(data: TaskDTO): Promise<TaskEntity> {
    
    return await this.todoRepository.create(data);
  }

  async createSeveralTasks(tasks: TaskDTO[]): Promise<PromiseSettledResult<TaskEntity>[]> {
    this.logger.verbose(`Attempting to create ${tasks.length} tasks`);

    const results = await Promise.allSettled(
      tasks.map(t => this.todoRepository.create(t))
    );
  
    // Логируем ошибки, если они были
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        this.logger.error(`Task at index ${index} failed: ${result.reason}`);
      }
    });
  
    return results; 
  }

  async updateTask(data: UpdateTaskDTO): Promise<TaskEntity> {
    return await this.todoRepository.update(data);
  }

  async deleteTask(id: string) {
    return await this.todoRepository.delete(id);
  }

}