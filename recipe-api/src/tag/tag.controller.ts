import { TagService } from './tag.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

@Controller('tag')
export class TagController {
  constructor(
    private readonly tagsService: TagService,
  ) {}

  @Get()
  findAll() {
    return this.tagsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.tagsService.findOne(id);
  }

  @Post()
  create(@Body() body: any) {
    return this.tagsService.create(body);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() body: any) {
    return this.tagsService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.tagsService.delete(id);
  }
}
