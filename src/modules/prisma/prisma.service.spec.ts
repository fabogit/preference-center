import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should connect to the database on module init', async () => {
    const spy = jest.spyOn(service, '$connect');
    await service.onModuleInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should disconnect from the database on module destroy', async () => {
    const spy = jest.spyOn(service, '$disconnect');
    await service.onModuleDestroy();
    expect(spy).toHaveBeenCalled();
  });
});
