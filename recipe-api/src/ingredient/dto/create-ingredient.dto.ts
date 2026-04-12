import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsObject, IsString } from 'class-validator';
import type { Multilingual } from '../../common/interfaces/multilingual.interface';

export class CreateIngredientDto {
  @ApiProperty({ description: 'The name of the ingredient (Multilingual)' })
  @IsObject()
  name: Multilingual;

  @ApiProperty({ description: 'The description of the ingredient (Multilingual)', required: false })
  @IsObject()
  @IsOptional()
  description?: Multilingual;

  @ApiProperty({ description: 'The unit of the ingredient (e.g. gram, ml, piece)', required: false })
  @IsString()
  @IsOptional()
  unit?: string;

  @ApiProperty({ description: 'The IDs of the ingredient types', type: [Number] })
  @IsArray()
  @IsInt({ each: true })
  @IsNotEmpty()
  typeIds: number[];

  @ApiProperty({ description: 'Whether the ingredient is active', default: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
