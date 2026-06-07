import { sortByField, paginateItems, filterBySearch } from '@/utils/sort';
import { formatDate, generateId } from '@/utils/format';

describe('Utility Functions', () => {
  describe('sortByField', () => {
    const items = [
      { name: 'Charlie', age: 30 },
      { name: 'Alice', age: 25 },
      { name: 'Bob', age: 35 },
    ];

    it('sorts ascending by name', () => {
      const sorted = sortByField(items, { field: 'name', direction: 'asc' });
      expect(sorted[0].name).toBe('Alice');
      expect(sorted[2].name).toBe('Charlie');
    });

    it('sorts descending by age', () => {
      const sorted = sortByField(items, { field: 'age', direction: 'desc' });
      expect(sorted[0].age).toBe(35);
    });

    it('returns original array when no sort config', () => {
      expect(sortByField(items)).toEqual(items);
    });
  });

  describe('paginateItems', () => {
    const items = Array.from({ length: 25 }, (_, i) => i + 1);

    it('returns correct page items', () => {
      expect(paginateItems(items, 1, 10)).toHaveLength(10);
      expect(paginateItems(items, 1, 10)[0]).toBe(1);
      expect(paginateItems(items, 3, 10)).toHaveLength(5);
    });
  });

  describe('filterBySearch', () => {
    const items = [
      { name: 'Website Redesign', status: 'Active' },
      { name: 'Mobile App', status: 'In Progress' },
    ];

    it('filters by search term', () => {
      const filtered = filterBySearch(items, 'website', ['name']);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe('Website Redesign');
    });

    it('returns all items for empty search', () => {
      expect(filterBySearch(items, '', ['name'])).toHaveLength(2);
    });
  });

  describe('formatDate', () => {
    it('formats date string', () => {
      const formatted = formatDate('2025-01-15');
      expect(formatted).toContain('2025');
    });
  });

  describe('generateId', () => {
    it('generates unique ids', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });
  });
});
