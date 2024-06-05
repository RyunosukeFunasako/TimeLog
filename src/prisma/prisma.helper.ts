import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Project, WorkSession } from '@prisma/client';

@Injectable()
export class PrismaHelper {
  static async validateUserProject(
    prisma: PrismaService,
    userId: number,
    projectId: number,
  ): Promise<Project> {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project || project.userId !== userId) {
      throw new ForbiddenException(
        'projectが存在しない、もしくはあなたに権限がありません',
      );
    }
    return project;
  }

  static async validateWorkSession(
    prisma: PrismaService,
    projectId: number,
    workSessionId: number,
  ): Promise<WorkSession> {
    const workSession = await prisma.workSession.findUnique({
      where: { id: workSessionId },
    });
    if (!workSession || workSession.projectId !== projectId) {
      throw new ForbiddenException(
        'workSessionが存在しない、もしくはあなたに権限がありません',
      );
    }
    return workSession;
  }
}
