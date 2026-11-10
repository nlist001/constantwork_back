import {IsString, MaxLength} from 'class-validator';

export class AiDTO {
  @IsString()
  @MaxLength(1000)
  prompt: string; 

}
