import { useState, useMemo } from 'react';

export function useSearch<T>(items: T[], searchFields: (keyof T)[]) {
  const [query, setQuery] = useState('');

  const filteredItems = useMemo(() => {
    if (!query.trim()) return items;
    const lowerQuery = query.toLowerCase().trim();

    return items.filter((item) =>
      searchFields.some((field) => {
        const val = item[field];
        if (typeof val === 'string') {
          return val.toLowerCase().includes(lowerQuery);
        }
        if (typeof val === 'number') {
          return val.toString().includes(lowerQuery);
        }
        return false;
      })
    );
  }, [items, query, searchFields]);

  return {
    query,
    setQuery,
    filteredItems,
  };
}

export default useSearch;
