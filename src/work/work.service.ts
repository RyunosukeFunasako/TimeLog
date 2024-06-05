import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWorkDto } from './dto/create-work.dto';
import { UpdateWorkDto } from './dto/update-work.dto';
import { WorkSession } from '@prisma/client';

@Injectable()
export class WorkService {
  constructor(private readonly prisma: PrismaService) {}

  getWorkSessions(userId: number, projectId: number): Promise<WorkSession[]> {
    return this.prisma.workSession.findMany({
      where: {
        projectId,
        project: {
          userId: userId,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  getWorkSessionById(
    userId: number,
    projectId: number,
    workSessionId: number,
  ): Promise<WorkSession> {
    return this.prisma.workSession.findFirst({
      where: {
        projectId,
        id: workSessionId,
        project: {
          userId: userId,
        },
      },
    });
  }

  async createWorkSession(
    userId: number,
    projectId: number,
    dto: CreateWorkDto,
  ): Promise<WorkSession> {
    const project = await this.prisma.project.findUnique({
      where: {
        id: projectId,
        userId: userId,
      },
    });
    if (!project || project.userId !== userId) {
      throw new ForbiddenException(
        'projectが存在しない、もしくはあなたに作成の権限がありません',
      );
    }
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
    const project = await this.prisma.project.findUnique({
      where: {
        id: projectId,
        userId: userId,
      },
    });

    if (!project || project.userId !== userId)
      throw new ForbiddenException(
        'projectが存在しない、もしくはあなたに更新の権限がありません',
      );

    const workSession = await this.prisma.workSession.findUnique({
      where: {
        id: workSessionId,
        projectId: projectId,
      },
    });

    if (!workSession || workSession.projectId !== projectId)
      throw new ForbiddenException('projectIdかworkSessionIdが間違えています');

    return this.prisma.workSession.update({
      where: {
        id: workSessionId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteWorkSessionById(
    userId: number,
    projectId: number,
    workSessionId: number,
  ): Promise<void> {
    const project = await this.prisma.project.findUnique({
      where: {
        id: projectId,
        userId: userId,
      },
    });

    if (!project || project.userId !== userId)
      throw new ForbiddenException(
        'projectが存在しない、もしくはあなたに削除の権限がありません',
      );

    const workSession = await this.prisma.workSession.findUnique({
      where: {
        id: workSessionId,
        projectId: projectId,
      },
    });

    if (!workSession || workSession.projectId !== projectId)
      throw new ForbiddenException('projectIdかworkSessionIdが間違えています');

    await this.prisma.workSession.delete({
      where: {
        id: workSessionId,
      },
    });
  }
}
