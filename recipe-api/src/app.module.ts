import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { IngredientModule } from './ingredient/ingredient.module';
import { IngredientTypeModule } from './ingredient-types/ingredient-type.module';
import { RecipeModule } from './recipe/recipe.module';
import { TagModule } from './tag/tag.module';
import { UploadModule } from './upload/upload.module';
import { ReviewModule } from './review/review.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'recipe.db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 120,
      },
    ]),
    IngredientModule,
    IngredientTypeModule,
    RecipeModule,
    TagModule,
    UploadModule,
    ReviewModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
