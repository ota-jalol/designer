import type { Event, EventFilter } from '../types';

const API_BASE = '/api/xodisalar';

export const xodisalarService = {
  async getAll(filters?: EventFilter): Promise<Event[]> {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status) params.append('status', filters.status);
    
    const response = await fetch(`${API_BASE}/events?${params}`);
    return response.json();
  },

  async getById(id: string): Promise<Event> {
    const response = await fetch(`${API_BASE}/events/${id}`);
    return response.json();
  },

  async create(event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<Event> {
    const response = await fetch(`${API_BASE}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
    return response.json();
  },

  async update(id: string, updates: Partial<Event>): Promise<Event> {
    const response = await fetch(`${API_BASE}/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return response.json();
  },

  async delete(id: string): Promise<void> {
    await fetch(`${API_BASE}/events/${id}`, {
      method: 'DELETE',
    });
  },
};
