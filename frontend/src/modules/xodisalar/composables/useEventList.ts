import { ref, computed, watch } from 'vue';
import { useXodisalarStore } from '../stores/xodisalar.store';
import type { Event, EventFilter } from '../types';

export function useEventList() {
  const store = useXodisalarStore();
  
  const searchQuery = ref('');
  const statusFilter = ref<Event['status'] | ''>('');
  const isLoading = computed(() => store.isLoading);
  const events = computed(() => store.filteredEvents);
  const totalEvents = computed(() => store.totalEvents);

  watch([searchQuery, statusFilter], () => {
    const filters: EventFilter = {};
    if (searchQuery.value) filters.search = searchQuery.value;
    if (statusFilter.value) filters.status = statusFilter.value;
    store.setFilters(filters);
  });

  async function loadEvents() {
    await store.loadEvents();
  }

  function selectEvent(event: Event | null) {
    store.selectEvent(event);
  }

  return {
    searchQuery,
    statusFilter,
    isLoading,
    events,
    totalEvents,
    loadEvents,
    selectEvent,
  };
}
