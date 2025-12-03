<template>
  <div class="event-grid">
    <div
      v-for="event in events"
      :key="event.id"
      class="event-card"
      :class="{ selected: selectedId === event.id }"
      @click="$emit('select', event)"
    >
      <div class="event-header">
        <h3 class="event-title">{{ event.title }}</h3>
        <span :class="['status-badge', `status-${event.status}`]">
          {{ event.status }}
        </span>
      </div>
      <p class="event-description">{{ event.description }}</p>
      <div class="event-footer">
        <span class="event-date">📅 {{ formatDate(event.date) }}</span>
        <span class="event-location">📍 {{ event.location }}</span>
      </div>
    </div>
    <div v-if="events.length === 0" class="empty-state">
      No events found
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Event } from '../types';

defineProps<{
  events: Event[];
  selectedId?: string;
}>();

defineEmits<{
  (e: 'select', event: Event): void;
}>();

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString();
  } catch {
    return dateStr;
  }
}
</script>

<style scoped>
.event-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  padding: 16px;
}

.event-card {
  background: var(--panel-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: border-color 0.2s;
}

.event-card:hover {
  border-color: var(--primary-color);
}

.event-card.selected {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(66, 184, 131, 0.2);
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.event-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.status-badge {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 12px;
  text-transform: uppercase;
}

.status-draft {
  background: #f0ad4e;
  color: #000;
}

.status-published {
  background: var(--primary-color);
  color: #fff;
}

.status-archived {
  background: var(--text-muted);
  color: #fff;
}

.event-description {
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.event-footer {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: var(--text-muted);
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px;
  color: var(--text-muted);
}
</style>
