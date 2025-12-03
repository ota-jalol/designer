import { Test, TestingModule } from '@nestjs/testing';
import { ComponentsService } from '../modules/components/services/components.service';

describe('ComponentsService', () => {
  let service: ComponentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComponentsService],
    }).compile();

    service = module.get<ComponentsService>(ComponentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllComponents', () => {
    it('should return all components', () => {
      const components = service.getAllComponents();
      
      expect(components).toBeDefined();
      expect(Array.isArray(components)).toBe(true);
      expect(components.length).toBeGreaterThan(0);
    });
  });

  describe('getComponentsByCategory', () => {
    it('should return components filtered by category', () => {
      const htmlComponents = service.getComponentsByCategory('html');
      
      expect(htmlComponents.length).toBeGreaterThan(0);
      expect(htmlComponents.every(c => c.category === 'html')).toBe(true);
    });

    it('should return empty array for non-existent category', () => {
      const components = service.getComponentsByCategory('non-existent');
      expect(components).toEqual([]);
    });
  });

  describe('getComponentById', () => {
    it('should return component by id', () => {
      const component = service.getComponentById('button');
      
      expect(component).toBeDefined();
      expect(component?.id).toBe('button');
      expect(component?.tag).toBe('button');
    });

    it('should return undefined for non-existent id', () => {
      const component = service.getComponentById('non-existent');
      expect(component).toBeUndefined();
    });
  });

  describe('getCategories', () => {
    it('should return unique categories', () => {
      const categories = service.getCategories();
      
      expect(categories.length).toBeGreaterThan(0);
      expect(categories).toContain('html');
      expect(categories).toContain('form');
      expect(categories).toContain('layout');
      
      // Check uniqueness
      const uniqueCategories = [...new Set(categories)];
      expect(categories.length).toBe(uniqueCategories.length);
    });
  });

  describe('registerComponent', () => {
    it('should register a new component', () => {
      const newComponent = {
        id: 'custom-widget',
        name: 'Custom Widget',
        category: 'custom',
        tag: 'custom-widget',
        icon: 'custom',
        defaultProps: {},
        editableProps: [],
        defaultSize: { w: 3, h: 2 },
      };
      
      service.registerComponent(newComponent);
      
      const registered = service.getComponentById('custom-widget');
      expect(registered).toBeDefined();
      expect(registered?.name).toBe('Custom Widget');
    });

    it('should update existing component', () => {
      const existingComponent = service.getComponentById('button');
      const updatedComponent = {
        ...existingComponent!,
        name: 'Updated Button',
      };
      
      service.registerComponent(updatedComponent);
      
      const result = service.getComponentById('button');
      expect(result?.name).toBe('Updated Button');
    });
  });
});
