import { PrismaClient, User, Role } from '@prisma/client';

export class UserRepository {
  constructor(private prisma: PrismaClient) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        addresses: true,
      },
    });
  }

  async create(data: {
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    role?: Role;
  }): Promise<User> {
    return this.prisma.user.create({
      data: {
        email: data.email.toLowerCase().trim(),
        passwordHash: data.passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role || 'USER',
      },
    });
  }
}
