import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TaskEntity } from "./task.entity";
import { DeleteResult, FindManyOptions, Repository } from "typeorm";
import { ITodoRepository } from "./todo.model";
import { TaskDTO, UpdateTaskDTO, FilterDTO } from "@app/contract/todo";




@Injectable()
export class TodoRepository implements ITodoRepository {
  private logger = new Logger('TodoRepository');
  constructor(
    @InjectRepository(TaskEntity)
    private readonly repo: Repository<TaskEntity>,
  ) {}

  async findById(id: string): Promise<TaskEntity | null> {
    const res =  await this.repo.findOneBy({ id });
    this.logger.verbose('findById:  ',id,' res: ',res)
    return res
  }

  async findAndCount(options?: FindManyOptions<TaskEntity> | undefined, filterDto?: FilterDTO): Promise<[TaskEntity[], number]> {
    const query = this.repo.createQueryBuilder('task');
    this.logger.verbose('findAndCount filterDto: ',filterDto)

    if (filterDto?.status && Array.isArray(filterDto?.status)) {
      query.andWhere("task.status IN (:...status)", {  status: filterDto.status })
    } else if(filterDto?.status) {
      query.andWhere('task.status = :status', { status: filterDto.status });
    }

    if (filterDto?.priority && Array.isArray(filterDto?.priority)) {
      query.andWhere('task.priority IN (:...priority)', { priority: filterDto.priority });
    } else if (filterDto?.priority){
      query.andWhere('task.priority = :priority', { priority: filterDto.priority });
    }

    if (filterDto?.exceptionId && Array.isArray(filterDto.exceptionId)) {
      query.andWhere('task.id NOT IN (:...exceptionId)', { exceptionId: filterDto.exceptionId });
    } else if (filterDto?.exceptionId){
      query.andWhere('task.id != :exceptionId', { exceptionId: filterDto.exceptionId });
    }

    if (filterDto?.parent) {
       query.andWhere('task.parent = :parent', { parent: filterDto.parent });
     }


    if (filterDto?.durationMinutes) {
      query.andWhere(
        '(task.durationMinutes <= :durationMinutes)',
        { durationMinutes: filterDto.durationMinutes },
      );
    }
    

    if (filterDto?.search) {
      // ILIKE — поиск без учета регистра (только для PostgreSQL)
      query.andWhere(
        '(task.name ILIKE :search OR task.description ILIKE :search)',
        { search: `%${filterDto.search}%` },
      );
    }
    if (options?.take && !filterDto?.all) query.take(options.take);
    if (options?.skip && !filterDto?.all) query.skip(options.skip);
    query.orderBy('updated', 'DESC');

    return await query.getManyAndCount();
    //return this.repo.findAndCount(options);
  }

  async save(task: Partial<TaskEntity>): Promise<TaskEntity> {
    return this.repo.save(task);
  }

  async create(data: TaskDTO): Promise<TaskEntity> {
    const newTask = await this.repo.create(data);
    this.logger.verbose('newTask',newTask);
    return this.save(newTask)
  }

  async update(data: UpdateTaskDTO): Promise<TaskEntity> {
    const updatedTask = await this.repo.preload(data);
    this.logger.verbose('updatedTask', updatedTask)
    if (!updatedTask) {
      throw new NotFoundException(`Задача с ID ${data.id} не найдена`);
    }

    return this.repo.save(updatedTask);
  }

  async delete(id: string): Promise<DeleteResult> {
    return this.repo.delete(id);
  }
}