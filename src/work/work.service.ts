import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaHelper } from 'src/prisma/prisma.helper';
import { CreateWorkDto } from './dto/create-work.dto';
import { UpdateWorkDto } from './dto/update-work.dto';
import { WorkSession } from '@prisma/client';

@Injectable()
export class WorkService {
  constructor(private readonly prisma: PrismaService) {}

  async getWorkSessions(
    userId: number,
    projectId: number,
  ): Promise<WorkSession[]> {
    await PrismaHelper.validateUserProject(this.prisma, userId, projectId);
    return this.prisma.workSession.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getWorkSessionById(
    userId: number,
    projectId: number,
    workSessionId: number,
  ): Promise<WorkSession> {
    await PrismaHelper.validateUserProject(this.prisma, userId, projectId);
    await PrismaHelper.validateWorkSession(
      this.prisma,
      projectId,
      workSessionId,
    );
    return this.prisma.workSession.findUnique({
      where: { id: workSessionId },
    });
  }

  async createWorkSession(
    userId: number,
    projectId: number,
    dto: CreateWorkDto,
  ): Promise<WorkSession> {
    await PrismaHelper.validateUserProject(this.prisma, userId, projectId);
    const workSession = await this.prisma.workSession.create({
      data: {
        projectId,
        ...dto,
      },
    });
    return workSession;
  }

  async updateWorkSessionById(
    userId: number,
    projectId: number,
    workSessionId: number,
    dto: UpdateWorkDto,
  ): Promise<WorkSession> {
    await PrismaHelper.validateUserProject(this.prisma, userId, projectId);
    await PrismaHelper.validateWorkSession(
      this.prisma,
      projectId,
      workSessionId,
    );
    return this.prisma.workSession.update({
      where: { id: workSessionId },
      data: { ...dto },
    });
  }

  async deleteWorkSessionById(
    userId: number,
    projectId: number,
    workSessionId: number,
  ): Promise<void> {
    await PrismaHelper.validateUserProject(this.prisma, userId, projectId);
    await PrismaHelper.validateWorkSession(
      this.prisma,
      projectId,
      workSessionId,
    );
    await this.prisma.workSession.delete({
      where: { id: workSessionId },
    });
  }
}
