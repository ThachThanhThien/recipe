import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { SeedModule } from './seed.module';
import { SeedService } from './seed.service';

async function bootstrap() {
  const logger = new Logger('SeedCLI');
  const args = process.argv.slice(2);
  const shouldClear = args.includes('--clear') || args.includes('--reset');
  const shouldSeed = args.includes('--seed') || args.includes('--reset') || args.length === 0;

  const app = await NestFactory.createApplicationContext(SeedModule, { logger: false });
  const seed = app.get(SeedService);

  try {
    if (shouldClear) {
      logger.log('Clearing all recipes...');
      await seed.clearRecipes();
    }
    if (shouldSeed) {
      logger.log('Seeding recipes...');
      const result = await seed.seedAll();
      logger.log(
        `Done. Recipes created: ${result.recipes}. New ingredients added: ${result.ingredientsCreated}.`,
      );
    }
    if (!shouldClear && !shouldSeed) {
      logger.log('No action selected. Use --seed, --clear, or --reset.');
    }
  } catch (err) {
    logger.error('Seed failed:', err instanceof Error ? err.stack : String(err));
    process.exitCode = 1;
  } finally {
    await app.close();
  }
}

bootstrap();
