import { Test, TestingModule } from '@nestjs/testing';
import { ConsentsService } from './consents.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConsentDto } from 'src/data/consent.dto';
import { ConsentType } from '@prisma/client';

describe('ConsentsService', () => {
  let service: ConsentsService;
  let prismaService: PrismaService;

  // Mocked user consents data for testing
  const mockUserConsents = {
    events: [
      {
        consents: [
          { type: 'email_notifications', enabled: true },
          { type: 'sms_notifications', enabled: false },
        ],
      },
      {
        consents: [
          { type: 'email_notifications', enabled: false },
          { type: 'sms_notifications', enabled: true },
        ],
      },
    ],
  };

  // Mock the Prisma service methods
  const mockPrismaService = {
    user: {
      findUnique: jest.fn().mockResolvedValue(mockUserConsents),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsentsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ConsentsService>(ConsentsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('getLatestConsentsForUser', () => {
    it('should return the latest consents for a given user', async () => {
      const userId = 'test-user-id';
      const result: Record<ConsentType, ConsentDto> = {
        email_notifications: { type: 'email_notifications', enabled: false },
        sms_notifications: { type: 'sms_notifications', enabled: true },
      };

      const latestConsents = await service.getLatestConsentsForUser(userId);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        select: {
          events: {
            select: {
              consents: {
                select: {
                  type: true,
                  enabled: true,
                },
              },
            },
          },
        },
      });

      expect(latestConsents).toEqual(result);
    });

    it('should return empty consents if the user has no events', async () => {
      // Test for case where no events are found for the user
      mockPrismaService.user.findUnique.mockResolvedValueOnce({ events: [] });

      const userId = 'test-user-id';
      const result: Record<ConsentType, ConsentDto | undefined> = {
        email_notifications: undefined,
        sms_notifications: undefined,
      };

      const latestConsents = await service.getLatestConsentsForUser(userId);

      expect(latestConsents).toEqual(result);
    });

    it('should throw an error if there is an issue fetching consents', async () => {
      // Simulate error in Prisma call
      mockPrismaService.user.findUnique.mockRejectedValueOnce(
        new Error('Database error'),
      );

      const userId = 'test-user-id';

      try {
        await service.getLatestConsentsForUser(userId);
      } catch (error) {
        expect(error).toEqual(new Error('Database error'));
      }
    });
  });

  describe('initializeLatestConsents', () => {
    it('should return a record with undefined values for each consent type', () => {
      const result = service['initializeLatestConsents']();
      const expected: Record<ConsentType, ConsentDto | undefined> = {
        email_notifications: undefined,
        sms_notifications: undefined,
      };

      expect(result).toEqual(expected);
    });
  });
});
