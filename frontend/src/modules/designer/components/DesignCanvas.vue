<template>
  <div 
    class="design-canvas panel"
    @dragover.prevent
    @drop="onDrop"
  >
    <div class="panel-header">
      <span>Canvas</span>
      <div class="canvas-actions">
        <button class="action-btn" @click="saveLayout" title="Save">💾</button>
        <button class="action-btn" @click="generateCode('vue')" title="Generate Vue">
          🔧
        </button>
      </div>
    </div>
    <div class="canvas-container">
      <grid-layout
        v-if="layout.length > 0"
        v-model:layout="layout"
        :col-num="12"
        :row-height="30"
        :is-draggable="true"
        :is-resizable="true"
        :vertical-compact="true"
        :use-css-transforms="true"
        @layout-updated="onLayoutUpdated"
      >
        <grid-item
          v-for="item in layout"
          :key="item.i"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
          :class="{ selected: item.id === selectedItemId, 'is-container': isContainerType(item.componentType) }"
          @click="selectItem(item)"
        >
          <div 
            class="grid-item-content"
            :class="{ 'drop-target': isContainerType(item.componentType) }"
            @dragover.prevent="onDragOverItem($event, item)"
            @drop.stop="onDropIntoItem($event, item)"
          >
            <div class="item-header">
              <div class="item-label">{{ item.componentType }}</div>
              <div class="item-actions">
                <button 
                  v-if="isContainerType(item.componentType)" 
                  class="add-child-btn" 
                  @click.stop="showAddChildMenu(item)"
                  title="Add child component"
                >+</button>
                <button class="delete-btn" @click.stop="removeItem(item.id)" title="Delete">×</button>
              </div>
            </div>
            <component
              :is="item.componentType"
              v-bind="item.props"
              class="item-preview"
              :class="{ 'has-children': item.children && item.children.length > 0 }"
            >
              {{ getPreviewText(item) }}
              
              <!-- Render nested children -->
              <div v-if="item.children && item.children.length > 0" class="nested-children">
                <div 
                  v-for="child in item.children" 
                  :key="child.id"
                  class="nested-item"
                  :class="{ 'selected-child': child.id === selectedItemId }"
                  @click.stop="selectItem(child)"
                >
                  <div class="nested-item-header">
                    <span class="nested-label">{{ child.componentType }}</span>
                    <button class="nested-delete-btn" @click.stop="removeChildItem(item.id, child.id)" title="Delete">×</button>
                  </div>
                  <component
                    :is="child.componentType"
                    v-bind="child.props"
                    class="nested-preview"
                  >
                    {{ getPreviewText(child) }}
                  </component>
                </div>
              </div>
            </component>
          </div>
        </grid-item>
      </grid-layout>
      <div v-else class="empty-canvas">
        <p>Drag components here or click to add</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { GridLayout, GridItem } from 'vue3-grid-layout-next';
import type { LayoutItem, ComponentDefinition } from '../types';
import { useDesignerStore } from '../stores/designer.store';

const store = useDesignerStore();

const layout = computed({
  get: () => store.layout,
  set: (value) => store.updateLayoutFromGrid(value),
});

const selectedItemId = computed(() => store.selectedItemId);

function selectItem(item: LayoutItem) {
  store.selectItem(item);
}

function removeItem(itemId: string) {
  store.removeItem(itemId);
}

function saveLayout() {
  store.saveLayout();
}

function generateCode(format: 'vue' | 'html') {
  store.generateCode(format);
}

function onLayoutUpdated(newLayout: LayoutItem[]) {
  store.updateLayoutFromGrid(newLayout);
}

let dragOverContainer: string | null = null;

function onDrop(event: DragEvent) {
  const data = event.dataTransfer?.getData('application/json');
  if (data) {
    try {
      const component: ComponentDefinition = JSON.parse(data);
      store.addComponent(component);
    } catch (e) {
      console.error('Failed to parse dropped component', e);
    }
  }
  dragOverContainer = null;
}

function onDragOverItem(event: DragEvent, item: LayoutItem) {
  if (isContainerType(item.componentType)) {
    event.stopPropagation();
    dragOverContainer = item.id;
  }
}

function onDropIntoItem(event: DragEvent, parentItem: LayoutItem) {
  if (!isContainerType(parentItem.componentType)) return;
  
  const data = event.dataTransfer?.getData('application/json');
  if (data) {
    try {
      const component: ComponentDefinition = JSON.parse(data);
      store.addChildComponent(parentItem.id, component);
    } catch (e) {
      console.error('Failed to add child component', e);
    }
  }
  dragOverContainer = null;
}

function isContainerType(componentType: string): boolean {
  const containers = ['div', 'section', 'article', 'main', 'aside', 'nav', 'header', 'footer', 'form'];
  return containers.includes(componentType);
}

function showAddChildMenu(item: LayoutItem) {
  // For now, add a simple div child
  const divComponent: ComponentDefinition = {
    id: 'div-container',
    name: 'Container',
    category: 'Layout',
    tag: 'div',
    icon: '📦',
    defaultProps: {},
    editableProps: [],
    defaultSize: { w: 2, h: 2 }
  };
  store.addChildComponent(item.id, divComponent);
}

function removeChildItem(parentId: string, childId: string) {
  store.removeChildComponent(parentId, childId);
}

function getPreviewText(item: LayoutItem): string {
  if (item.componentType === 'button') return 'Button';
  if (item.componentType === 'a') return 'Link';
  if (item.componentType === 'h1') return 'Heading';
  if (item.componentType === 'p') return 'Paragraph text...';
  return '';
}
</script>

<style scoped>
.design-canvas {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.canvas-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 4px 8px;
  font-size: 16px;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 4px;
}

.action-btn:hover {
  background: var(--hover-bg);
}

.canvas-container {
  flex: 1;
  padding: 16px;
  overflow: auto;
  background: var(--bg-color);
  background-image: 
    linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
  background-size: 20px 20px;
}

.grid-item-content {
  width: 100%;
  height: 100%;
  padding: 4px;
  background: var(--panel-bg);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  position: relative;
  overflow: auto;
}

.grid-item-content.drop-target {
  transition: background 0.2s;
}

.grid-item-content.drop-target:hover {
  background: rgba(66, 184, 131, 0.05);
}

.vue-grid-item.selected .grid-item-content {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(66, 184, 131, 0.3);
}

.vue-grid-item.is-container .grid-item-content {
  border-style: dashed;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  top: 2px;
  left: 4px;
  right: 4px;
  z-index: 10;
}

.item-label {
  font-size: 10px;
  color: var(--text-muted);
}

.item-actions {
  display: flex;
  gap: 2px;
  opacity: 0;
  transition: opacity 0.2s;
}

.grid-item-content:hover .item-actions {
  opacity: 1;
}

.item-preview {
  margin-top: 16px;
  max-width: 100%;
  max-height: calc(100% - 20px);
  overflow: hidden;
}

.add-child-btn {
  width: 18px;
  height: 18px;
  padding: 0;
  font-size: 12px;
  line-height: 1;
  background: rgba(66, 184, 131, 0.8);
  color: white;
  border-radius: 2px;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}

.add-child-btn:hover {
  background: var(--primary-color);
}

.delete-btn {
  width: 18px;
  height: 18px;
  padding: 0;
  font-size: 12px;
  line-height: 1;
  background: rgba(255, 0, 0, 0.7);
  color: white;
  border-radius: 2px;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}

.delete-btn:hover {
  background: rgba(255, 0, 0, 0.9);
}

.nested-children {
  margin-top: 8px;
  padding: 8px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  border: 1px dashed var(--border-color);
  min-height: 40px;
}

.nested-item {
  background: var(--panel-bg);
  border: 1px solid var(--border-color);
  border-radius: 3px;
  padding: 6px;
  margin-bottom: 6px;
  cursor: pointer;
  transition: border-color 0.2s;
}

.nested-item:last-child {
  margin-bottom: 0;
}

.nested-item:hover {
  border-color: var(--primary-color);
}

.nested-item.selected-child {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 1px rgba(66, 184, 131, 0.3);
}

.nested-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.nested-label {
  font-size: 9px;
  color: var(--text-muted);
  text-transform: uppercase;
  font-weight: 600;
}

.nested-delete-btn {
  width: 14px;
  height: 14px;
  padding: 0;
  font-size: 10px;
  line-height: 1;
  background: rgba(255, 0, 0, 0.6);
  color: white;
  border-radius: 2px;
  border: none;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s, background 0.2s;
}

.nested-item:hover .nested-delete-btn {
  opacity: 1;
}

.nested-delete-btn:hover {
  background: rgba(255, 0, 0, 0.9);
}

.nested-preview {
  font-size: 12px;
  padding: 4px;
}

.empty-canvas {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-muted);
  font-size: 16px;
}

:deep(.vue-grid-layout) {
  min-height: 100%;
}

:deep(.vue-grid-item) {
  touch-action: none;
}

:deep(.vue-grid-item.vue-grid-placeholder) {
  background: var(--primary-color);
  opacity: 0.3;
  border-radius: 4px;
}

:deep(.vue-resizable-handle) {
  position: absolute;
  width: 20px;
  height: 20px;
  bottom: 0;
  right: 0;
  background: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2IDYiIHN0eWxlPSJiYWNrZ3JvdW5kLWNvbG9yOiNmZmZmZmYwMCIgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSI2cHgiIGhlaWdodD0iNnB4Ij48ZyBvcGFjaXR5PSIwLjMwMiI+PHBhdGggZD0iTSA2IDYgTCAwIDYgTCAwIDQuMiBMIDQgNC4yIEwgNC4yIDQuMiBMIDQuMiAwIEwgNiAwIEwgNiA2IEwgNiA2IFoiIGZpbGw9IiMwMDAwMDAiLz48L2c+PC9zdmc+");
  background-position: bottom right;
  padding: 0 3px 3px 0;
  background-repeat: no-repeat;
  background-origin: content-box;
  box-sizing: border-box;
  cursor: se-resize;
}
</style>
