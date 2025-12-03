import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useXodisalarStore } from '@modules/xodisalar/stores/xodisalar.store';

describe('Xodisalar Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should initialize with default state', () => {
    const store = useXodisalarStore();
    
    expect(store.events).toEqual([]);
    expect(store.selectedEvent).toBeNull();
    expect(store.filters).toEqual({});
    expect(store.isLoading).toBe(false);
  });

  it('should create an event', async () => {
    const store = useXodisalarStore();
    
    const event = await store.createEvent({
      title: 'Test Event',
      description: 'Test Description',
      date: '2024-01-15',
      location: 'Test Location',
      status: 'draft',
    });

    expect(event).not.toBeNull();
    expect(event?.title).toBe('Test Event');
    expect(store.events.length).toBe(1);
  });

  it('should filter events by search', async () => {
    const store = useXodisalarStore();
    
    await store.createEvent({
      title: 'Conference 2024',
      description: 'Annual conference',
      date: '2024-06-15',
      location: 'New York',
      status: 'published',
    });

    await store.createEvent({
      title: 'Workshop',
      description: 'Training workshop',
      date: '2024-07-20',
      location: 'Boston',
      status: 'draft',
    });

    store.setFilters({ search: 'Conference' });
    expect(store.filteredEvents.length).toBe(1);
    expect(store.filteredEvents[0].title).toBe('Conference 2024');
  });

  it('should filter events by status', async () => {
    const store = useXodisalarStore();
    
    await store.createEvent({
      title: 'Event 1',
      description: 'Description 1',
      date: '2024-01-01',
      location: 'Location 1',
      status: 'published',
    });

    await store.createEvent({
      title: 'Event 2',
      description: 'Description 2',
      date: '2024-02-01',
      location: 'Location 2',
      status: 'draft',
    });

    store.setFilters({ status: 'draft' });
    expect(store.filteredEvents.length).toBe(1);
    expect(store.filteredEvents[0].title).toBe('Event 2');
  });

  it('should update an event', async () => {
    const store = useXodisalarStore();
    
    const event = await store.createEvent({
      title: 'Original Title',
      description: 'Original Description',
      date: '2024-01-01',
      location: 'Original Location',
      status: 'draft',
    });

    if (event) {
      await store.updateEvent(event.id, { title: 'Updated Title' });
      expect(store.events[0].title).toBe('Updated Title');
    }
  });

  it('should delete an event', async () => {
    const store = useXodisalarStore();
    
    const event = await store.createEvent({
      title: 'To Be Deleted',
      description: 'This will be deleted',
      date: '2024-01-01',
      location: 'Somewhere',
      status: 'draft',
    });

    expect(store.events.length).toBe(1);

    if (event) {
      await store.deleteEvent(event.id);
      expect(store.events.length).toBe(0);
    }
  });

  it('should select and deselect events', async () => {
    const store = useXodisalarStore();
    
    const event = await store.createEvent({
      title: 'Test Event',
      description: 'Test Description',
      date: '2024-01-01',
      location: 'Test Location',
      status: 'draft',
    });

    if (event) {
      store.selectEvent(event);
      expect(store.selectedEvent).toEqual(event);

      store.selectEvent(null);
      expect(store.selectedEvent).toBeNull();
    }
  });
});
