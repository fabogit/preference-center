import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { PaginationDto } from 'src/dto/pagination.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(email: string) {
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

  async getAllUsers(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    // Get the total count of users
    const totalUsers = await this.prisma.user.count();

    // Calculate total pages
    const totalPages = Math.ceil(totalUsers / limit);

    // Fetch the users based on pagination
    const users = await this.prisma.user.findMany({
      skip: (page - 1) * limit, // Skip the users based on the current page
      take: limit, // Limit the number of users per page
      include: { events: true }, // Include events (if needed)
    });

    return {
      totalUsers, // Total number of users in the database
      totalPages, // Total number of pages
      page, // Current page
      limit, // Number of users per page
      users, // Paginated list of users
    };
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
