import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './tag.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private tagRepo: Repository<Tag>,
  ) {}

  findAll() {
    return this.tagRepo.find();
  }

  findOne(id: number) {
    return this.tagRepo.findOne({ where: { id } });
  }

  create(data: Partial<Tag>) {
    const type = this.tagRepo.create({...data, isActive: true});
    return this.tagRepo.save(type);
  }

  update(id: number, data: Partial<Tag>) {
    return this.tagRepo.update(id, data);
  }

  delete(id: number) {
    return this.tagRepo.delete(id);
  }
}
