// Example module types
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface EventFilter {
  search?: string;
  status?: Event['status'];
  dateFrom?: string;
  dateTo?: string;
}
