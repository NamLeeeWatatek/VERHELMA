import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DocumentCreateDto {
  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  isPublic?: boolean = true;

  @ApiPropertyOptional()
  @IsOptional()
  categoryId?: Uuid;
}
