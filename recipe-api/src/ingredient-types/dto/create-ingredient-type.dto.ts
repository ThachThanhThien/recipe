import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsObject } from 'class-validator';
import type { Multilingual } from '../../common/interfaces/multilingual.interface';

export class CreateIngredientTypeDto {
  @ApiProperty({ description: 'The name of the ingredient type (Multilingual)' })
  @IsObject()
  name: Multilingual;

  @ApiProperty({ description: 'The description of the ingredient type (Multilingual)', required: false })
  @IsObject()
  @IsOptional()
  description?: Multilingual;

  @ApiProperty({ description: 'Whether the ingredient type is active', default: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
