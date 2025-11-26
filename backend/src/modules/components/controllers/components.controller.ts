import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ComponentsService } from '../services/components.service';
import { ComponentDefinition } from '../entities/component.entity';

@Controller('api/components')
export class ComponentsController {
  constructor(private readonly componentsService: ComponentsService) {}

  @Get()
  getAllComponents(@Query('category') category?: string) {
    if (category) {
      return this.componentsService.getComponentsByCategory(category);
    }
    return this.componentsService.getAllComponents();
  }

  @Get('categories')
  getCategories() {
    return this.componentsService.getCategories();
  }

  @Get(':id')
  getComponent(@Param('id') id: string) {
    return this.componentsService.getComponentById(id);
  }

  @Post()
  registerComponent(@Body() component: ComponentDefinition) {
    this.componentsService.registerComponent(component);
    return { success: true };
  }
}
