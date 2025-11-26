<template>
  <div class="component-palette panel">
    <div class="panel-header">
      <span>Components</span>
    </div>
    <div class="panel-content">
      <div v-for="category in categories" :key="category" class="category">
        <div class="category-header" @click="toggleCategory(category)">
          <span class="category-icon">{{ expandedCategories[category] ? '▼' : '▶' }}</span>
          <span class="category-name">{{ formatCategory(category) }}</span>
        </div>
        <div v-show="expandedCategories[category]" class="category-items">
          <div
            v-for="component in getComponentsByCategory(category)"
            :key="component.id"
            class="component-item"
            draggable="true"
            @dragstart="onDragStart($event, component)"
            @click="onComponentClick(component)"
          >
            <span class="component-icon">{{ getIcon(component.icon) }}</span>
            <span class="component-name">{{ component.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { ComponentDefinition } from '../types';
import { useDesignerStore } from '../stores/designer.store';

const store = useDesignerStore();

const categories = computed(() => store.categories);
const expandedCategories = ref<Record<string, boolean>>({
  html: true,
  form: true,
  layout: true,
});

const iconMap: Record<string, string> = {
  box: '📦',
  'cursor-click': '🖱️',
  edit: '✏️',
  heading: '📰',
  'align-left': '📄',
  image: '🖼️',
  link: '🔗',
  document: '📋',
  'chevron-down': '⬇️',
  'document-text': '📝',
  'view-horizontal': '↔️',
  'view-grid': '🔲',
};

function toggleCategory(category: string) {
  expandedCategories.value[category] = !expandedCategories.value[category];
}

function formatCategory(category: string): string {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

function getComponentsByCategory(category: string): ComponentDefinition[] {
  return store.components.filter(c => c.category === category);
}

function getIcon(iconName: string): string {
  return iconMap[iconName] || '📦';
}

function onDragStart(event: DragEvent, component: ComponentDefinition) {
  event.dataTransfer?.setData('application/json', JSON.stringify(component));
  event.dataTransfer!.effectAllowed = 'copy';
}

function onComponentClick(component: ComponentDefinition) {
  store.addComponent(component);
}
</script>

<style scoped>
.component-palette {
  height: 100%;
  overflow-y: auto;
}

.category {
  margin-bottom: 8px;
}

.category-header {
  display: flex;
  align-items: center;
  padding: 8px;
  cursor: pointer;
  background: var(--hover-bg);
  border-radius: 4px;
  font-weight: 500;
}

.category-header:hover {
  background: var(--border-color);
}

.category-icon {
  font-size: 10px;
  margin-right: 8px;
  color: var(--text-muted);
}

.category-name {
  text-transform: capitalize;
}

.category-items {
  padding: 4px 0 4px 16px;
}

.component-item {
  display: flex;
  align-items: center;
  padding: 8px;
  cursor: grab;
  border-radius: 4px;
  margin: 2px 0;
  transition: background 0.2s;
}

.component-item:hover {
  background: var(--hover-bg);
}

.component-item:active {
  cursor: grabbing;
}

.component-icon {
  margin-right: 8px;
  font-size: 16px;
}

.component-name {
  font-size: 13px;
}
</style>
