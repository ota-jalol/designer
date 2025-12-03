import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';
import { LayoutItem } from '../entities/designer.entity';
import sanitizeHtml from 'sanitize-html';

@Injectable()
export class DesignerService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async createProject(name: string, ownerId?: string): Promise<Project> {
    const project = this.projectRepository.create({
      name: this.sanitizeInput(name),
      layout: [],
      ownerId,
    });
    return this.projectRepository.save(project);
  }

  async getProject(id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({ where: { id } });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  async getAllProjects(ownerId?: string): Promise<Project[]> {
    if (ownerId) {
      return this.projectRepository.find({ where: { ownerId } });
    }
    return this.projectRepository.find();
  }

  async saveLayout(projectId: string, layout: LayoutItem[]): Promise<Project> {
    const project = await this.getProject(projectId);
    project.layout = this.sanitizeLayout(layout);
    return this.projectRepository.save(project);
  }

  async updateLayoutItem(projectId: string, item: LayoutItem): Promise<Project> {
    const project = await this.getProject(projectId);
    const index = project.layout.findIndex(i => i.id === item.id);
    
    const sanitizedItem = this.sanitizeLayoutItem(item);
    
    if (index >= 0) {
      project.layout[index] = sanitizedItem;
    } else {
      project.layout.push(sanitizedItem);
    }
    
    return this.projectRepository.save(project);
  }

  async removeLayoutItem(projectId: string, itemId: string): Promise<Project> {
    const project = await this.getProject(projectId);
    project.layout = project.layout.filter(i => i.id !== itemId);
    return this.projectRepository.save(project);
  }

  async deleteProject(id: string): Promise<void> {
    const project = await this.getProject(id);
    await this.projectRepository.remove(project);
  }

  async exportProject(id: string): Promise<any> {
    const project = await this.getProject(id);
    return {
      name: project.name,
      layout: project.layout,
      exportedAt: new Date().toISOString(),
    };
  }

  async importProject(data: any, ownerId?: string): Promise<Project> {
    const project = this.projectRepository.create({
      name: this.sanitizeInput(data.name || 'Imported Project'),
      layout: this.sanitizeLayout(data.layout || []),
      ownerId,
    });
    return this.projectRepository.save(project);
  }

  async generateCode(projectId: string, format: 'vue' | 'html' = 'vue'): Promise<string> {
    const project = await this.getProject(projectId);
    if (!project) {
      return '';
    }

    if (format === 'vue') {
      return this.generateVueCode(project.layout);
    }
    return this.generateHtmlCode(project.layout);
  }

  private sanitizeInput(input: string): string {
    return sanitizeHtml(input, {
      allowedTags: [],
      allowedAttributes: {},
    });
  }

  private sanitizeLayoutItem(item: LayoutItem): LayoutItem {
    return {
      ...item,
      componentType: this.sanitizeInput(item.componentType),
      props: item.props ? this.sanitizeProps(item.props) : undefined,
      children: item.children ? this.sanitizeLayout(item.children) : undefined,
    };
  }

  private sanitizeLayout(layout: LayoutItem[]): LayoutItem[] {
    return layout.map(item => this.sanitizeLayoutItem(item));
  }

  private sanitizeProps(props: Record<string, unknown>): Record<string, unknown> {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(props)) {
      if (typeof value === 'string') {
        sanitized[key] = this.sanitizeInput(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }

  private generateVueCode(layout: LayoutItem[]): string {
    const template = this.generateTemplate(layout);
    return `<template>
  <div class="designer-layout">
${template}
  </div>
</template>

<script setup lang="ts">
// Generated Vue component
</script>

<style scoped>
.designer-layout {
  display: grid;
  gap: 8px;
  padding: 16px;
}
</style>
`;
  }

  private generateHtmlCode(layout: LayoutItem[]): string {
    const content = this.generateTemplate(layout);
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Layout</title>
  <style>
    .designer-layout {
      display: grid;
      gap: 8px;
      padding: 16px;
    }
  </style>
</head>
<body>
  <div class="designer-layout">
${content}
  </div>
</body>
</html>
`;
  }

  private generateTemplate(layout: LayoutItem[], indent = '    '): string {
    return layout.map(item => {
      const props = item.props 
        ? Object.entries(item.props)
            .map(([key, value]) => `:${key}="${JSON.stringify(value)}"`)
            .join(' ')
        : '';
      
      const style = `style="grid-column: ${item.x + 1} / span ${item.w}; grid-row: ${item.y + 1} / span ${item.h};"`;
      
      if (item.children && item.children.length > 0) {
        const childContent = this.generateTemplate(item.children, indent + '  ');
        return `${indent}<${item.componentType} ${style} ${props}>\n${childContent}\n${indent}</${item.componentType}>`;
      }
      
      return `${indent}<${item.componentType} ${style} ${props}></${item.componentType}>`;
    }).join('\n');
  }
}
