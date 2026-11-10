import {IsString, IsInt, MaxLength, MinLength, IsEnum} from 'class-validator';
import { Priority, Status } from './todo.model';

export class UpdateTaskDTO {
    @IsString()
    id: string;
  
    @IsString()
    @MinLength(10)
    @MaxLength(1000)
    name: string;
  
    @IsString()
    @MinLength(0)
    @MaxLength(5000)
    description: string;
  
    @IsEnum(Priority)
    priority: Priority;
  
    @IsEnum(Status)
    status: Status;
  
    @IsInt()
    durationMinutes: number;
  
    @IsString()
    parent: null | string = null;
  }
  