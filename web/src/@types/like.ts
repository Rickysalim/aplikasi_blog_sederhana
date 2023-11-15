export type Like = {
    person_id: number;
    post_id: number;
}

export type LikeState = {
    isLoading: boolean;
    is_like: boolean;
    like: number;
}
