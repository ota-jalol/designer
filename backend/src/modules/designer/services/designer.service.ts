import { Injectable } from '@nestjs/common';
import { LayoutItem, Project } from '../entities/designer.entity';

@Injectable()
export class DesignerService {
  private projects: Map<string, Project> = new Map();
  private projectCounter = 0;

  createProject(name: string): Project {
    this.projectCounter++;
    const id = `project-${Date.now()}-${this.projectCounter}`;
    const project: Project = {
      id,
      name,
      layout: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.projects.set(id, project);
    return project;
  }

  getProject(id: string): Project | undefined {
    return this.projects.get(id);
  }

  getAllProjects(): Project[] {
    return Array.from(this.projects.values());
  }

  saveLayout(projectId: string, layout: LayoutItem[]): Project | undefined {
    const project = this.projects.get(projectId);
    if (project) {
      project.layout = layout;
      project.updatedAt = new Date();
      this.projects.set(projectId, project);
    }
    return project;
  }

  updateLayoutItem(projectId: string, item: LayoutItem): Project | undefined {
    const project = this.projects.get(projectId);
    if (project) {
      const index = project.layout.findIndex(i => i.id === item.id);
      if (index >= 0) {
        project.layout[index] = item;
      } else {
        project.layout.push(item);
      }
      project.updatedAt = new Date();
      this.projects.set(projectId, project);
    }
    return project;
  }

  removeLayoutItem(projectId: string, itemId: string): Project | undefined {
    const project = this.projects.get(projectId);
    if (project) {
      project.layout = project.layout.filter(i => i.id !== itemId);
      project.updatedAt = new Date();
      this.projects.set(projectId, project);
    }
    return project;
  }

  generateCode(projectId: string, format: 'vue' | 'html' = 'vue'): string {
    const project = this.projects.get(projectId);
    if (!project) {
      return '';
    }

    if (format === 'vue') {
      return this.generateVueCode(project.layout);
    }
    return this.generateHtmlCode(project.layout);
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
