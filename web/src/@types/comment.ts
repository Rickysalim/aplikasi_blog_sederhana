export type Comment = {
    id: number;
    post_id: number;
    person_id: string;
    image: string;
    comment: string;
    created_at: string;
    parent_id: number | null;
}

export type Replies = {
    id: number;
    post_id: number;
    person_id: number;
    image: string;
    fullname: string;
    comment: string;
    created_at: string;
    parent_id: number | null;
}

export type CommentList = {
    id: number;
    post_id: number;
    person_id: number;
    image: string;
    fullname: string;
    comment: string;
    created_at: string;
    parent_id: number | null;
    replies: Replies[];
}

export type CommentObject = {
    data: CommentList[],
    count: number | null
}


export type CommentState = {
    isLoading: boolean;
    commentState: Comment;
    comment: CommentObject;
}
