drop policy "Enable read access for all users" on "public"."books";

alter table "public"."books" drop constraint "books_doi_key";

alter table "public"."books" drop constraint "books_isbn_10_key";

alter table "public"."books" drop constraint "books_isbn_13_key";

alter table "public"."books" drop constraint "books_oclc_number_key";

alter table "public"."books" drop constraint "books_title_author_publication_year_key";

drop view if exists "public"."books_with_ratings";

drop index if exists "public"."books_doi_key";

drop index if exists "public"."books_isbn_10_key";

drop index if exists "public"."books_isbn_13_key";

drop index if exists "public"."books_oclc_number_key";

drop index if exists "public"."books_title_author_publication_year_key";

drop index if exists "public"."idx_books_search";

alter table "public"."books" drop column "author";

alter table "public"."books" drop column "doi";

alter table "public"."books" drop column "image_url";

alter table "public"."books" drop column "oclc_number";

alter table "public"."books" drop column "publication_year";

alter table "public"."books" drop column "publisher_id";

alter table "public"."books" add column "access_view_status" text;

alter table "public"."books" add column "allow_anon_logging" boolean;

alter table "public"."books" add column "authors" text[];

alter table "public"."books" add column "canonical_volume_link" text;

alter table "public"."books" add column "categories" text[];

alter table "public"."books" add column "contains_epub_bubbles" boolean;

alter table "public"."books" add column "contains_image_bubbles" boolean;

alter table "public"."books" add column "content_version" text;

alter table "public"."books" add column "country" text;

alter table "public"."books" add column "description" text;

alter table "public"."books" add column "embeddable" boolean;

alter table "public"."books" add column "epub_available" boolean;

alter table "public"."books" add column "etag" text;

alter table "public"."books" add column "extra_large_image" text;

alter table "public"."books" add column "google_books_id" text;

alter table "public"."books" add column "height" text;

alter table "public"."books" add column "image_readable" boolean;

alter table "public"."books" add column "info_link" text;

alter table "public"."books" add column "is_ebook" boolean;

alter table "public"."books" add column "language" text;

alter table "public"."books" add column "large_image" text;

alter table "public"."books" add column "maturity_rating" text;

alter table "public"."books" add column "medium_image" text;

alter table "public"."books" add column "page_count" integer;

alter table "public"."books" add column "pdf_available" boolean;

alter table "public"."books" add column "preview_link" text;

alter table "public"."books" add column "print_type" text;

alter table "public"."books" add column "printed_page_count" integer;

alter table "public"."books" add column "public_domain" boolean;

alter table "public"."books" add column "published_date" text;

alter table "public"."books" add column "publisher" text;

alter table "public"."books" add column "quote_sharing_allowed" boolean;

alter table "public"."books" add column "saleability" text;

alter table "public"."books" add column "self_link" text;

alter table "public"."books" add column "small_image" text;

alter table "public"."books" add column "small_thumbnail" text;

alter table "public"."books" add column "text_readable" boolean;

alter table "public"."books" add column "text_to_speech_permission" text;

alter table "public"."books" add column "thickness" text;

alter table "public"."books" add column "thumbnail" text;

alter table "public"."books" add column "updated_at" timestamp with time zone default CURRENT_TIMESTAMP;

alter table "public"."books" add column "viewability" text;

alter table "public"."books" add column "web_reader_link" text;

alter table "public"."books" add column "width" text;

alter table "public"."books" disable row level security;

alter table "public"."reviews" disable row level security;

CREATE UNIQUE INDEX books_google_books_id_key ON public.books USING btree (google_books_id);

CREATE INDEX idx_books_categories ON public.books USING gin (categories);

CREATE INDEX idx_books_google_id ON public.books USING btree (google_books_id);

CREATE INDEX idx_books_isbn ON public.books USING btree (isbn_10, isbn_13);

CREATE INDEX idx_books_publisher ON public.books USING btree (publisher);

CREATE INDEX idx_books_title_author ON public.books USING btree (title, authors);

alter table "public"."books" add constraint "books_google_books_id_key" UNIQUE using index "books_google_books_id_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_modified_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$function$
;

create or replace view "public"."books_with_ratings" as  SELECT b.id,
    b.google_books_id,
    b.etag,
    b.self_link,
    b.title,
    b.authors,
    b.publisher,
    b.published_date,
    b.description,
    b.isbn_10,
    b.isbn_13,
    b.page_count,
    b.printed_page_count,
    b.print_type,
    b.categories,
    b.maturity_rating,
    b.allow_anon_logging,
    b.content_version,
    b.language,
    b.preview_link,
    b.info_link,
    b.canonical_volume_link,
    b.text_readable,
    b.image_readable,
    b.height,
    b.width,
    b.thickness,
    b.contains_epub_bubbles,
    b.contains_image_bubbles,
    b.small_thumbnail,
    b.thumbnail,
    b.small_image,
    b.medium_image,
    b.large_image,
    b.extra_large_image,
    b.country,
    b.saleability,
    b.is_ebook,
    b.viewability,
    b.embeddable,
    b.public_domain,
    b.text_to_speech_permission,
    b.epub_available,
    b.pdf_available,
    b.web_reader_link,
    b.access_view_status,
    b.quote_sharing_allowed,
    b.created_at,
    b.updated_at,
    COALESCE(avg(r.rating), (0)::numeric) AS average_rating,
    count(r.id) AS review_count
   FROM (books b
     LEFT JOIN reviews r ON ((b.id = r.book_id)))
  GROUP BY b.id;


CREATE TRIGGER update_books_modtime BEFORE UPDATE ON public.books FOR EACH ROW EXECUTE FUNCTION update_modified_column();


