import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common';
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

  @Get('packages/supported')
  getSupportedPackages() {
    return this.componentsService.getSupportedPackages();
  }

  @Get('packages/installed')
  getInstalledPackages() {
    return this.componentsService.getInstalledPackages();
  }

  @Get('packages/:packageName/components')
  getPackageComponents(@Param('packageName') packageName: string) {
    return this.componentsService.getPackageComponents(packageName);
  }

  @Post('packages/install')
  installPackage(@Body('packageName') packageName: string) {
    const result = this.componentsService.installPackage(packageName);
    if (!result) {
      return {
        success: false,
        message: `Package '${packageName}' is not supported. Supported packages: ${this.componentsService.getSupportedPackages().join(', ')}`,
      };
    }
    return {
      success: true,
      message: `Package '${packageName}' installed successfully with ${result.components.length} components`,
      package: result,
    };
  }

  @Delete('packages/:packageName')
  uninstallPackage(@Param('packageName') packageName: string) {
    const success = this.componentsService.uninstallPackage(packageName);
    return {
      success,
      message: success 
        ? `Package '${packageName}' uninstalled successfully`
        : `Package '${packageName}' is not installed`,
    };
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
