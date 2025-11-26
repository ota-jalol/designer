import { Test, TestingModule } from '@nestjs/testing';
import { DesignerService } from '../modules/designer/services/designer.service';

describe('DesignerService', () => {
  let service: DesignerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DesignerService],
    }).compile();

    service = module.get<DesignerService>(DesignerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProject', () => {
    it('should create a new project', () => {
      const project = service.createProject('Test Project');
      
      expect(project).toBeDefined();
      expect(project.name).toBe('Test Project');
      expect(project.layout).toEqual([]);
      expect(project.id).toContain('project-');
    });
  });

  describe('getProject', () => {
    it('should return a project by id', () => {
      const created = service.createProject('Test Project');
      const retrieved = service.getProject(created.id);
      
      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(created.id);
      expect(retrieved?.name).toBe('Test Project');
    });

    it('should return undefined for non-existent project', () => {
      const retrieved = service.getProject('non-existent');
      expect(retrieved).toBeUndefined();
    });
  });

  describe('getAllProjects', () => {
    it('should return all projects', () => {
      service.createProject('Project 1');
      service.createProject('Project 2');
      
      const projects = service.getAllProjects();
      expect(projects.length).toBe(2);
    });
  });

  describe('saveLayout', () => {
    it('should save layout to project', () => {
      const project = service.createProject('Test Project');
      const layout = [
        { id: 'item-1', componentType: 'div', x: 0, y: 0, w: 4, h: 2 },
      ];
      
      const updated = service.saveLayout(project.id, layout);
      
      expect(updated?.layout).toEqual(layout);
    });
  });

  describe('updateLayoutItem', () => {
    it('should add new item to layout', () => {
      const project = service.createProject('Test Project');
      const item = { id: 'item-1', componentType: 'div', x: 0, y: 0, w: 4, h: 2 };
      
      service.updateLayoutItem(project.id, item);
      const retrieved = service.getProject(project.id);
      
      expect(retrieved?.layout.length).toBe(1);
      expect(retrieved?.layout[0].id).toBe('item-1');
    });

    it('should update existing item in layout', () => {
      const project = service.createProject('Test Project');
      const item = { id: 'item-1', componentType: 'div', x: 0, y: 0, w: 4, h: 2 };
      
      service.updateLayoutItem(project.id, item);
      service.updateLayoutItem(project.id, { ...item, w: 6, h: 4 });
      
      const retrieved = service.getProject(project.id);
      expect(retrieved?.layout.length).toBe(1);
      expect(retrieved?.layout[0].w).toBe(6);
      expect(retrieved?.layout[0].h).toBe(4);
    });
  });

  describe('removeLayoutItem', () => {
    it('should remove item from layout', () => {
      const project = service.createProject('Test Project');
      service.updateLayoutItem(project.id, { id: 'item-1', componentType: 'div', x: 0, y: 0, w: 4, h: 2 });
      service.updateLayoutItem(project.id, { id: 'item-2', componentType: 'button', x: 0, y: 2, w: 2, h: 1 });
      
      service.removeLayoutItem(project.id, 'item-1');
      
      const retrieved = service.getProject(project.id);
      expect(retrieved?.layout.length).toBe(1);
      expect(retrieved?.layout[0].id).toBe('item-2');
    });
  });

  describe('generateCode', () => {
    it('should generate Vue code', () => {
      const project = service.createProject('Test Project');
      service.saveLayout(project.id, [
        { id: 'item-1', componentType: 'div', x: 0, y: 0, w: 4, h: 2 },
      ]);
      
      const code = service.generateCode(project.id, 'vue');
      
      expect(code).toContain('<template>');
      expect(code).toContain('<script setup lang="ts">');
      expect(code).toContain('<style scoped>');
      expect(code).toContain('<div');
    });

    it('should generate HTML code', () => {
      const project = service.createProject('Test Project');
      service.saveLayout(project.id, [
        { id: 'item-1', componentType: 'div', x: 0, y: 0, w: 4, h: 2 },
      ]);
      
      const code = service.generateCode(project.id, 'html');
      
      expect(code).toContain('<!DOCTYPE html>');
      expect(code).toContain('<html');
      expect(code).toContain('<body>');
      expect(code).toContain('<div');
    });

    it('should return empty string for non-existent project', () => {
      const code = service.generateCode('non-existent');
      expect(code).toBe('');
    });
  });
});
