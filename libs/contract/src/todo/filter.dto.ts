import {IsString, IsInt, MaxLength, ValidateNested, IsEnum, IsOptional, IsBoolean, IsUUID} from 'class-validator';
import { Priority, Status } from './todo.model';
import { PaginationDto } from '../pagination/pagination.dto';
import { Type } from 'class-transformer';





export class FilterDTO extends PaginationDto {
  @IsString()
  @IsOptional()
  @MaxLength(500)
  search?: string;


  @IsInt()
  @IsOptional()
  durationMinutes?: number;

  @IsBoolean()
  @IsOptional()
  all?: boolean;


  @IsOptional()
  @IsEnum(Priority, { each: true })
  priority?: Priority[];

  @IsOptional()
  @IsEnum(Status, { each: true })
  status?: Status[];

  @IsOptional()
  @IsUUID('all', { each: true }) 
  exceptionId?: string[]

  @IsString()
  @IsOptional()
  @IsUUID() 
  parent?:string
}
