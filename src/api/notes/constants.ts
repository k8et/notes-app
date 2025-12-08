export const NOTES_TABLE = 'notes';

export const NOTE_QUERY_KEYS = {
    all: ['notes'] as const,
    lists: () => [...NOTE_QUERY_KEYS.all, 'list'] as const,
    list: (filters: string) => [...NOTE_QUERY_KEYS.lists(), { filters }] as const,
    details: () => [...NOTE_QUERY_KEYS.all, 'detail'] as const,
    detail: (id: string) => [...NOTE_QUERY_KEYS.details(), id] as const,
};

