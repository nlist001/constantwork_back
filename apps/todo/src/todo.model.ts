import { FilterDTO, TaskDTO, UpdateTaskDTO } from "@app/contract/todo";
import { TaskEntity } from "./task.entity";
import { DeleteResult, FindManyOptions } from "typeorm";

export interface ITodoRepository {
    findById(id: string): Promise<TaskEntity | null>;
    findAndCount(options?: FindManyOptions<TaskEntity> | undefined, filterDto?: FilterDTO): Promise<[TaskEntity[], number]>;
    save(task: Partial<TaskEntity>): Promise<TaskEntity>;
    create(data: TaskDTO): Promise<TaskEntity>;
    delete(id: string): Promise<DeleteResult>;
    update(data: UpdateTaskDTO): Promise<TaskEntity>;
}

export interface ITaskList {
    data: TaskEntity[];
    total: number;
    page: number;
    lastPage: number;
  }