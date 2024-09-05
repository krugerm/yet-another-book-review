export interface IBook {
    id: string;
    google_books_id: string | null;
    etag: string | null;
    self_link: string | null;
    title: string;
    authors: string[] | null;
    publisher: string | null;
    published_date: string | null;
    description: string | null;
    isbn_10: string | null;
    isbn_13: string | null;
    page_count: number | null;
    printed_page_count: number | null;
    print_type: string | null;
    categories: string[] | null;
    maturity_rating: string | null;
    allow_anon_logging: boolean | null;
    content_version: string | null;
    language: string | null;
    preview_link: string | null;
    info_link: string | null;
    canonical_volume_link: string | null;
    
    text_readable: boolean | null;
    image_readable: boolean | null;
    
    height: string | null;
    width: string | null;
    thickness: string | null;
    
    contains_epub_bubbles: boolean | null;
    contains_image_bubbles: boolean | null;
    
    small_thumbnail: string | null;
    thumbnail: string | null;
    small_image: string | null;
    medium_image: string | null;
    large_image: string | null;
    extra_large_image: string | null;
    
    country: string | null;
    saleability: string | null;
    is_ebook: boolean | null;
    
    viewability: string | null;
    embeddable: boolean | null;
    public_domain: boolean | null;
    text_to_speech_permission: string | null;
    epub_available: boolean | null;
    pdf_available: boolean | null;
    web_reader_link: string | null;
    access_view_status: string | null;
    quote_sharing_allowed: boolean | null;
    
    created_at: string;
    updated_at: string;
  }
  
  // Additional interface for books with ratings
  export interface IBookWithRatings extends IBook {
    average_rating: number;
    review_count: number;
  }