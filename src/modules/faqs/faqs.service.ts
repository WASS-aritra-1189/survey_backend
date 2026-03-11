import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FAQ } from './entities/faq.entity';
import { CreateFaqDto, UpdateFaqDto } from './dto/faq.dto';

@Injectable()
export class FaqService {
  constructor(
    @InjectRepository(FAQ)
    private readonly faqRepository: Repository<FAQ>,
  ) {}

  async create(dto: CreateFaqDto, accountId: string): Promise<FAQ> {
    const faq = this.faqRepository.create({
      ...dto,
      createdBy: accountId,
    });
    return await this.faqRepository.save(faq);
  }

  async findAll(): Promise<FAQ[]> {
    return await this.faqRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findPublic(): Promise<FAQ[]> {
    return await this.faqRepository.find({ 
      where: { isActive: true },
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string): Promise<FAQ> {
    return await this.faqRepository.findOneOrFail({ where: { id } });
  }

  async update(id: string, dto: UpdateFaqDto): Promise<FAQ> {
    await this.faqRepository.update(id, dto);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.faqRepository.delete(id);
  }
}