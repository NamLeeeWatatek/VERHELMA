import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDto {
  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  identifier!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  oldPassword!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  newPassword!: string;
}
