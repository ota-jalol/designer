import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DesignerService } from '../modules/designer/services/designer.service';
import { Project } from '../modules/designer/entities/project.entity';

describe('DesignerService', () => {
  let service: DesignerService;
  let repository: Repository<Project>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DesignerService,
        {
          provide: getRepositoryToken(Project),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<DesignerService>(DesignerService);
    repository = module.get<Repository<Project>>(getRepositoryToken(Project));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProject', () => {
    it('should create a new project', async () => {
      const mockProject = {
        id: 'test-id',
        name: 'Test Project',
        layout: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.create.mockReturnValue(mockProject);
      mockRepository.save.mockResolvedValue(mockProject);

      const project = await service.createProject('Test Project');
      
      expect(project).toBeDefined();
      expect(project.name).toBe('Test Project');
      expect(project.layout).toEqual([]);
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('getProject', () => {
    it('should return a project by id', async () => {
      const mockProject = {
        id: 'test-id',
        name: 'Test Project',
        layout: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(mockProject);

      const project = await service.getProject('test-id');
      
      expect(project).toBeDefined();
      expect(project.id).toBe('test-id');
      expect(project.name).toBe('Test Project');
    });

    it('should throw NotFoundException for non-existent project', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.getProject('non-existent')).rejects.toThrow();
    });
  });

  describe('getAllProjects', () => {
    it('should return all projects', async () => {
      const mockProjects = [
        { id: '1', name: 'Project 1', layout: [], createdAt: new Date(), updatedAt: new Date() },
        { id: '2', name: 'Project 2', layout: [], createdAt: new Date(), updatedAt: new Date() },
      ];

      mockRepository.find.mockResolvedValue(mockProjects);

      const projects = await service.getAllProjects();
      expect(projects.length).toBe(2);
    });
  });

  describe('saveLayout', () => {
    it('should save layout to project', async () => {
      const mockProject = {
        id: 'test-id',
        name: 'Test Project',
        layout: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const layout = [
        { id: 'item-1', componentType: 'div', x: 0, y: 0, w: 4, h: 2 },
      ];

      mockRepository.findOne.mockResolvedValue(mockProject);
      mockRepository.save.mockResolvedValue({ ...mockProject, layout });

      const updated = await service.saveLayout('test-id', layout);
      
      expect(updated.layout).toEqual(layout);
    });
  });

  describe('updateLayoutItem', () => {
    it('should add new item to layout', async () => {
      const mockProject = {
        id: 'test-id',
        name: 'Test Project',
        layout: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const item = { id: 'item-1', componentType: 'div', x: 0, y: 0, w: 4, h: 2 };

      mockRepository.findOne.mockResolvedValue(mockProject);
      mockRepository.save.mockResolvedValue({ ...mockProject, layout: [item] });

      const updated = await service.updateLayoutItem('test-id', item);
      
      expect(updated.layout.length).toBe(1);
      expect(updated.layout[0].id).toBe('item-1');
    });

    it('should update existing item in layout', async () => {
      const item = { id: 'item-1', componentType: 'div', x: 0, y: 0, w: 4, h: 2 };
      const mockProject = {
        id: 'test-id',
        name: 'Test Project',
        layout: [item],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(mockProject);
      mockRepository.save.mockResolvedValue({ ...mockProject, layout: [{ ...item, w: 6, h: 4 }] });

      const updated = await service.updateLayoutItem('test-id', { ...item, w: 6, h: 4 });
      
      expect(updated.layout.length).toBe(1);
      expect(updated.layout[0].w).toBe(6);
      expect(updated.layout[0].h).toBe(4);
    });
  });

  describe('removeLayoutItem', () => {
    it('should remove item from layout', async () => {
      const mockProject = {
        id: 'test-id',
        name: 'Test Project',
        layout: [
          { id: 'item-1', componentType: 'div', x: 0, y: 0, w: 4, h: 2 },
          { id: 'item-2', componentType: 'button', x: 0, y: 2, w: 2, h: 1 },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(mockProject);
      mockRepository.save.mockResolvedValue({ 
        ...mockProject, 
        layout: mockProject.layout.filter(i => i.id !== 'item-1') 
      });

      const updated = await service.removeLayoutItem('test-id', 'item-1');
      
      expect(updated.layout.length).toBe(1);
      expect(updated.layout[0].id).toBe('item-2');
    });
  });

  describe('generateCode', () => {
    it('should generate Vue code from layout', async () => {
      const mockProject = {
        id: 'test-id',
        name: 'Test Project',
        layout: [{ id: 'item-1', componentType: 'div', x: 0, y: 0, w: 4, h: 2 }],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(mockProject);

      const code = await service.generateCode('test-id', 'vue');
      
      expect(code).toContain('<template>');
      expect(code).toContain('<div');
    });

    it('should generate HTML code from layout', async () => {
      const mockProject = {
        id: 'test-id',
        name: 'Test Project',
        layout: [{ id: 'item-1', componentType: 'div', x: 0, y: 0, w: 4, h: 2 }],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(mockProject);

      const code = await service.generateCode('test-id', 'html');
      
      expect(code).toContain('<!DOCTYPE html>');
      expect(code).toContain('<div');
    });
  });
});
