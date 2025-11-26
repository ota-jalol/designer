<template>
  <div class="event-list-page">
    <header class="page-header">
      <h1>Events</h1>
      <router-link to="/xodisalar/create" class="create-btn">+ Create Event</router-link>
    </header>
    
    <div class="filters">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search events..."
        class="search-input"
      />
      <select v-model="statusFilter" class="status-filter">
        <option value="">All statuses</option>
        <option value="draft">Draft</option>
        <option value="published">Published</option>
        <option value="archived">Archived</option>
      </select>
    </div>

    <EventGrid
      :events="filteredEvents"
      :selected-id="selectedEvent?.id"
      @select="selectEvent"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useXodisalarStore } from '../stores/xodisalar.store';
import EventGrid from '../components/event-grid.vue';

const store = useXodisalarStore();

const searchQuery = ref('');
const statusFilter = ref('');

const filteredEvents = computed(() => store.filteredEvents);
const selectedEvent = computed(() => store.selectedEvent);

watch([searchQuery, statusFilter], () => {
  store.setFilters({
    search: searchQuery.value,
    status: statusFilter.value as 'draft' | 'published' | 'archived' | undefined,
  });
});

function selectEvent(event: unknown) {
  store.selectEvent(event as typeof selectedEvent.value);
}

onMounted(() => {
  store.loadEvents();
});
</script>

<style scoped>
.event-list-page {
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

h1 {
  font-size: 24px;
  font-weight: 600;
}

.create-btn {
  background: var(--primary-color);
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  text-decoration: none;
}

.filters {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.search-input {
  flex: 1;
  max-width: 400px;
}

.status-filter {
  min-width: 150px;
}
</style>
