import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Event, EventFilter } from '../types';
import { generateUniqueId } from '@shared/utils/id';

export const useXodisalarStore = defineStore('xodisalar', () => {
  // State
  const events = ref<Event[]>([]);
  const selectedEvent = ref<Event | null>(null);
  const filters = ref<EventFilter>({});
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const filteredEvents = computed(() => {
    let result = events.value;
    
    if (filters.value.search) {
      const search = filters.value.search.toLowerCase();
      result = result.filter(e => 
        e.title.toLowerCase().includes(search) ||
        e.description.toLowerCase().includes(search)
      );
    }
    
    if (filters.value.status) {
      result = result.filter(e => e.status === filters.value.status);
    }
    
    return result;
  });

  const totalEvents = computed(() => events.value.length);

  // Actions
  async function loadEvents() {
    isLoading.value = true;
    try {
      // API call would go here
      // events.value = await eventService.getAll();
    } catch (e) {
      error.value = 'Failed to load events';
    } finally {
      isLoading.value = false;
    }
  }

  async function createEvent(event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) {
    isLoading.value = true;
    try {
      const newEvent: Event = {
        ...event,
        id: generateUniqueId('event'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      events.value.push(newEvent);
      return newEvent;
    } catch (e) {
      error.value = 'Failed to create event';
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateEvent(id: string, updates: Partial<Event>) {
    const index = events.value.findIndex(e => e.id === id);
    if (index >= 0) {
      events.value[index] = {
        ...events.value[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
    }
  }

  async function deleteEvent(id: string) {
    events.value = events.value.filter(e => e.id !== id);
  }

  function selectEvent(event: Event | null) {
    selectedEvent.value = event;
  }

  function setFilters(newFilters: EventFilter) {
    filters.value = newFilters;
  }

  return {
    // State
    events,
    selectedEvent,
    filters,
    isLoading,
    error,
    // Getters
    filteredEvents,
    totalEvents,
    // Actions
    loadEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    selectEvent,
    setFilters,
  };
});
