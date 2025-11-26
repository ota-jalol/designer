import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { DesignerService } from '../services/designer.service';
import { SaveLayoutDto, UpdateLayoutDto, GenerateCodeDto } from '../dto/designer.dto';

@Controller('api/designer')
export class DesignerController {
  constructor(private readonly designerService: DesignerService) {}

  @Post('projects')
  createProject(@Body('name') name: string) {
    return this.designerService.createProject(name);
  }

  @Get('projects')
  getAllProjects() {
    return this.designerService.getAllProjects();
  }

  @Get('projects/:id')
  getProject(@Param('id') id: string) {
    return this.designerService.getProject(id);
  }

  @Put('projects/:id/layout')
  saveLayout(@Param('id') id: string, @Body() dto: SaveLayoutDto) {
    return this.designerService.saveLayout(id, dto.layout);
  }

  @Put('projects/:id/layout/item')
  updateLayoutItem(@Param('id') id: string, @Body() dto: UpdateLayoutDto) {
    return this.designerService.updateLayoutItem(id, dto.item);
  }

  @Delete('projects/:id/layout/:itemId')
  removeLayoutItem(@Param('id') id: string, @Param('itemId') itemId: string) {
    return this.designerService.removeLayoutItem(id, itemId);
  }

  @Post('generate-code')
  generateCode(@Body() dto: GenerateCodeDto) {
    return { code: this.designerService.generateCode(dto.projectId, dto.format) };
  }
}
