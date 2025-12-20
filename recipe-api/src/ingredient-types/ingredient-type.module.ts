import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredientType } from './ingredient-type.entity';
import { IngredientTypeService } from './ingredient-type.service';
import { IngredientTypeController } from './ingredient-type.controller';

@Module({
  imports: [TypeOrmModule.forFeature([IngredientType])],
  providers: [IngredientTypeService],
  controllers: [IngredientTypeController],
  exports: [IngredientTypeService],
})
export class IngredientTypeModule {}
