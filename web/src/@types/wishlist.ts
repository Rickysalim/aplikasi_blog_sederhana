export type WishList = {
    id: number;
    person_id: number;
    post_id: number;
    created_at: string;
    Person: {
        fullname: string;
    };
    Post: {
        title: string | null;
        content: string | null;
        created_at: string | number | Date;
        image: string | undefined;
        description: string | null;
        Person: {
            fullname: string;
        };
    }
    afterSubmit?: string
}

export type WishListState = {
    isLoading: boolean;
    query: {
        limit: number;
        offset: number;
        search: string;
    }
    page: number;
    wishlist: {
        data: WishList[];
        count: number;
    };
}