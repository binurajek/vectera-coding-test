export interface Summary {
    id: number;
    content: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface Meeting {
    id: number;
    title: string;
    started_at: string;
    created_at: string;
    note_count: number;
    latest_summary: Summary | null;
}

export interface Note {
    id: number;
    author: string;
    text: string;
    created_at: string;
}

export interface PaginatedResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: any[];
}
