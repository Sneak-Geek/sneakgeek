import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Shoes } from './shoes.schema';
import { ShoesService } from './shoes.service';

describe('ShoesService', () => {
  let service: ShoesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShoesService,
        {
          provide: getModelToken(Shoes.name),
          useValue: null,
        },
      ],
    }).compile();

    service = module.get<ShoesService>(ShoesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
