import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { DesignerService } from '../services/designer.service';
import { SaveLayoutDto, UpdateLayoutDto, GenerateCodeDto } from '../dto/designer.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { User } from '../../auth/entities/user.entity';

@ApiTags('designer')
@Controller('api/designer')
export class DesignerController {
  constructor(private readonly designerService: DesignerService) {}

  @Post('projects')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project created successfully' })
  async createProject(@Body('name') name: string, @GetUser() user: User) {
    return this.designerService.createProject(name, user.id);
  }

  @Get('projects')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all projects for current user' })
  async getAllProjects(@GetUser() user: User) {
    return this.designerService.getAllProjects(user.id);
  }

  @Get('projects/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get project by ID' })
  async getProject(@Param('id') id: string) {
    return this.designerService.getProject(id);
  }

  @Put('projects/:id/layout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Save entire layout' })
  async saveLayout(@Param('id') id: string, @Body() dto: SaveLayoutDto) {
    return this.designerService.saveLayout(id, dto.layout);
  }

  @Put('projects/:id/layout/item')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update or add a layout item' })
  async updateLayoutItem(@Param('id') id: string, @Body() dto: UpdateLayoutDto) {
    return this.designerService.updateLayoutItem(id, dto.item);
  }

  @Delete('projects/:id/layout/:itemId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove a layout item' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeLayoutItem(@Param('id') id: string, @Param('itemId') itemId: string) {
    return this.designerService.removeLayoutItem(id, itemId);
  }

  @Delete('projects/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a project' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProject(@Param('id') id: string) {
    return this.designerService.deleteProject(id);
  }

  @Get('projects/:id/export')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Export project as JSON' })
  async exportProject(@Param('id') id: string) {
    return this.designerService.exportProject(id);
  }

  @Post('projects/import')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Import project from JSON' })
  async importProject(@Body() data: any, @GetUser() user: User) {
    return this.designerService.importProject(data, user.id);
  }

  @Post('generate-code')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate Vue or HTML code from project' })
  async generateCode(@Body() dto: GenerateCodeDto) {
    const code = await this.designerService.generateCode(dto.projectId, dto.format);
    return { code };
  }
}

