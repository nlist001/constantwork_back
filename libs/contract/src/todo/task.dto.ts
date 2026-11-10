import {IsString, IsInt, MaxLength, MinLength, IsEnum, IsOptional} from 'class-validator';
import { Priority, Status } from './todo.model';

export class TaskDTO {
  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  name: string;

  @IsString()
  @MinLength(0)
  @MaxLength(5000)
  description: string;

  @IsEnum(Priority)
  priority: Priority = Priority.low;

  @IsEnum(Status)
  status: Status = Status.pending;

  @IsInt()
  durationMinutes: number = 0;

  @IsString()
  @IsOptional()
  parent?: null | string = null;
}
