import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useDesignerStore } from '@modules/designer/stores/designer.store';

describe('Designer Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should initialize with default state', () => {
    const store = useDesignerStore();
    
    expect(store.currentProject).toBeNull();
    expect(store.layout).toEqual([]);
    expect(store.selectedItem).toBeNull();
    expect(store.generatedCode).toBe('');
    expect(store.isLoading).toBe(false);
  });

  it('should add component to layout', () => {
    const store = useDesignerStore();
    
    // Mock a current project
    store.currentProject = {
      id: 'test-project',
      name: 'Test Project',
      layout: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const component = {
      id: 'button',
      name: 'Button',
      category: 'html',
      tag: 'button',
      icon: 'cursor-click',
      defaultProps: { type: 'button' },
      editableProps: [],
      defaultSize: { w: 2, h: 1 },
    };

    store.addComponent(component);

    expect(store.layout.length).toBe(1);
    expect(store.layout[0].componentType).toBe('button');
    expect(store.layout[0].w).toBe(2);
    expect(store.layout[0].h).toBe(1);
  });

  it('should select and deselect items', () => {
    const store = useDesignerStore();
    
    const item = {
      id: 'item-1',
      i: 'item-1',
      componentType: 'div',
      x: 0,
      y: 0,
      w: 4,
      h: 2,
    };

    store.selectItem(item);
    expect(store.selectedItem).toEqual(item);
    expect(store.selectedItemId).toBe('item-1');

    store.selectItem(null);
    expect(store.selectedItem).toBeNull();
    expect(store.selectedItemId).toBeNull();
  });

  it('should remove item from layout', () => {
    const store = useDesignerStore();
    
    store.currentProject = {
      id: 'test-project',
      name: 'Test Project',
      layout: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    store.layout = [
      { id: 'item-1', i: 'item-1', componentType: 'div', x: 0, y: 0, w: 4, h: 2 },
      { id: 'item-2', i: 'item-2', componentType: 'button', x: 0, y: 2, w: 2, h: 1 },
    ];

    store.removeItem('item-1');

    expect(store.layout.length).toBe(1);
    expect(store.layout[0].id).toBe('item-2');
  });

  it('should update item in layout', () => {
    const store = useDesignerStore();
    
    store.currentProject = {
      id: 'test-project',
      name: 'Test Project',
      layout: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    store.layout = [
      { id: 'item-1', i: 'item-1', componentType: 'div', x: 0, y: 0, w: 4, h: 2 },
    ];

    store.updateItem({ id: 'item-1', i: 'item-1', componentType: 'div', x: 2, y: 3, w: 6, h: 4 });

    expect(store.layout[0].x).toBe(2);
    expect(store.layout[0].y).toBe(3);
    expect(store.layout[0].w).toBe(6);
    expect(store.layout[0].h).toBe(4);
  });
});
