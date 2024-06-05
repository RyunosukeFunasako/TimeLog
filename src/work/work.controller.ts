import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { WorkService } from './work.service';
import { CreateWorkDto } from './dto/create-work.dto';
import { WorkSession } from '@prisma/client';
import { UpdateWorkDto } from './dto/update-work.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('work')
export class WorkController {
  constructor(private readonly workService: WorkService) {}

  @Get(':projectId')
  getWorkSessions(
    @Req() req: Request,
    @Param('projectId', ParseIntPipe) projectId: number,
  ): Promise<WorkSession[]> {
    return this.workService.getWorkSessions(req.user.id, projectId);
  }

  @Get(':projectId/:workSessionId')
  getWorkSessionById(
    @Req() req: Request,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('workSessionId', ParseIntPipe) workSessionId: number,
  ): Promise<WorkSession> {
    return this.workService.getWorkSessionById(
      req.user.id,
      projectId,
      workSessionId,
    );
  }

  @Post(':projectId')
  createWorkSession(
    @Req() req: Request,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() dto: CreateWorkDto,
  ): Promise<WorkSession> {
    return this.workService.createWorkSession(req.user.id, projectId, dto);
  }

  @Patch(':projectId/:workSessionId')
  updateWorkSessionById(
    @Req() req: Request,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('workSessionId', ParseIntPipe) workSessionId: number,
    @Body() dto: UpdateWorkDto,
  ): Promise<WorkSession> {
    return this.workService.updateWorkSessionById(
      req.user.id,
      projectId,
      workSessionId,
      dto,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':projectId/:workSessionId')
  deleteWorkSessionById(
    @Req() req: Request,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('workSessionId', ParseIntPipe) workSessionId: number,
  ): Promise<void> {
    return this.workService.deleteWorkSessionById(
      req.user.id,
      projectId,
      workSessionId,
    );
  }
}
