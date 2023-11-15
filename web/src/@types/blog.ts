

export type Blog = {
    [x: string]: any;
    id: number | null;
    person_id: number | null;
    title: string;
    content: string | null;
    created_at: string  | number | Date;
    image: string | undefined;
    description: string | null;
    Person: {
        fullname: string;
    },
};

export type postState = {
    person_id: number | null;
    title: string;
    content: string | null;
    image: string | File;
    description: string | null;
    afterSubmit?: string;
}

export type BlogState = {
    isLoading: boolean;
    query: {
        limit: number;
        offset: number;
        search: string;
    }
    page: number;
    post: {
        data: Blog[];
        count: number;
    }
    postByTitle: {
        data: Blog | null;
    }
    postState: {
        id: number | null;
        person_id: number | null;
        title: string;
        content: string | null;
        created_at: string | number | Date;
        image: string | File;
        description: string | null;
    },
    postSearch: {
        data: Blog[];
        count: number;
    }
};
