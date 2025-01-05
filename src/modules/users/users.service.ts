import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ResCDUserDto } from 'src/data/user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(email: string): Promise<ResCDUserDto> {
    try {
      return await this.prisma.user.create({
        data: { email },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(`Email ${email} is already in use`);
      }
      throw error;
    }
  }

  async deleteUser(id: string) {
    try {
      return await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with ID ${id} does not exist`);
      }
      throw error;
    }
  }
}
