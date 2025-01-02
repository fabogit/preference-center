import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(email: string) {
    return this.prisma.user.create({
      data: { email },
    });
  }

  async getAllUsers() {
    return this.prisma.user.findMany({
      include: { events: true },
    });
  }

  async deleteUser(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
