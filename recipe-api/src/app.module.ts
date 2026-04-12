import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredientModule } from './ingredient/ingredient.module';
import { IngredientTypeModule } from './ingredient-types/ingredient-type.module';
import { RecipeModule } from './recipe/recipe.module';
import { TagModule } from './tag/tag.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'recipe.db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    IngredientModule,
    IngredientTypeModule,
    RecipeModule,
    TagModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
