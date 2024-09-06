export interface IBookReview {
    id: string;
    user_id: string;
    google_books_id: string;
    rating: number;
    review_text: string;
    created_at: string;
}

export interface IBookReviewWithProfile extends IBookReview {
    username: string;
    full_name: string;
    avatar_url: string;
}