import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DocumentCategoryCreateDto {
  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional()
  name!: string;
}
