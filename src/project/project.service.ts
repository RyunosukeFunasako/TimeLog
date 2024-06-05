import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaHelper } from 'src/prisma/prisma.helper';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from '@prisma/client';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  getProjects(userId: number): Promise<Project[]> {
    return this.prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getProjectById(userId: number, projectId: number): Promise<Project> {
    await PrismaHelper.validateUserProject(this.prisma, userId, projectId);
    return this.prisma.project.findUnique({
      where: { id: projectId },
    });
  }

  async createProject(userId: number, dto: CreateProjectDto): Promise<Project> {
    const project = await this.prisma.project.create({
      data: {
        userId,
        ...dto,
      },
    });
    return project;
  }

  async updateProjectById(
    userId: number,
    projectId: number,
    dto: UpdateProjectDto,
  ): Promise<Project> {
    await PrismaHelper.validateUserProject(this.prisma, userId, projectId);
    return this.prisma.project.update({
      where: { id: projectId },
      data: { ...dto },
    });
  }

  async deleteProjectById(userId: number, projectId: number): Promise<void> {
    await PrismaHelper.validateUserProject(this.prisma, userId, projectId);
    await this.prisma.project.delete({
      where: { id: projectId },
    });
  }
}
