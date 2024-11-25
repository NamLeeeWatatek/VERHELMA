import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class SubtaskCreateDto {
  @ApiPropertyOptional()
  @IsString()
  @Length(1, 255)
  content!: string;
}
