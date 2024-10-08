alter table "public"."reviews" drop constraint "reviews_book_id_fkey";

alter table "public"."reviews" drop constraint "reviews_book_id_user_id_key";

alter table "public"."reviews" drop constraint "reviews_rating_check";

drop view if exists "public"."books_with_ratings";

alter table "public"."books" drop constraint "books_pkey";

drop index if exists "public"."reviews_book_id_user_id_key";

drop index if exists "public"."books_pkey";

create table "public"."contact_us" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "email" text not null,
    "subject" text not null,
    "message" text not null,
    "ip_address" text
);


alter table "public"."books" drop column "id";

alter table "public"."books" alter column "google_books_id" set not null;

alter table "public"."reviews" drop column "book_id";

alter table "public"."reviews" add column "google_books_id" text;

alter table "public"."reviews" alter column "rating" set data type real using "rating"::real;

CREATE UNIQUE INDEX contact_us_pkey ON public.contact_us USING btree (id);

CREATE UNIQUE INDEX books_pkey ON public.books USING btree (google_books_id);

alter table "public"."contact_us" add constraint "contact_us_pkey" PRIMARY KEY using index "contact_us_pkey";

alter table "public"."books" add constraint "books_pkey" PRIMARY KEY using index "books_pkey";

alter table "public"."reviews" add constraint "reviews_google_books_id_fkey" FOREIGN KEY (google_books_id) REFERENCES books(google_books_id) ON DELETE CASCADE not valid;

alter table "public"."reviews" validate constraint "reviews_google_books_id_fkey";

alter table "public"."reviews" add constraint "reviews_rating_check" CHECK (((rating >= (1)::double precision) AND (rating <= (5)::double precision))) not valid;

alter table "public"."reviews" validate constraint "reviews_rating_check";

set check_function_bodies = off;

create or replace view "public"."reviews_with_profiles" as  SELECT reviews.id,
    reviews.google_books_id,
    reviews.user_id,
    reviews.rating,
    reviews.review_text,
    reviews.created_at,
    profiles.username,
    profiles.full_name,
    profiles.avatar_url
   FROM (reviews
     JOIN profiles ON ((reviews.user_id = profiles.id)));


create or replace view "public"."books_with_ratings" as  SELECT b.google_books_id,
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
    COALESCE(avg(r.rating), ((0)::numeric)::double precision) AS average_rating,
    count(r.id) AS review_count,
    max(COALESCE(r.created_at, '2000-01-01 00:00:00+00'::timestamp with time zone)) AS last_reviewed,
    ((((((COALESCE(b.title, ''::text) || ' '::text) || COALESCE(array_to_string(b.authors, ' '::text), ''::text)) || ' '::text) || (COALESCE(b.isbn_10, ''::bpchar))::text) || ' '::text) || (COALESCE(b.isbn_13, ''::bpchar))::text) AS combined_text
   FROM (books b
     LEFT JOIN reviews r ON ((b.google_books_id = r.google_books_id)))
  GROUP BY b.google_books_id;


CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$function$
;

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

grant delete on table "public"."contact_us" to "anon";

grant insert on table "public"."contact_us" to "anon";

grant references on table "public"."contact_us" to "anon";

grant select on table "public"."contact_us" to "anon";

grant trigger on table "public"."contact_us" to "anon";

grant truncate on table "public"."contact_us" to "anon";

grant update on table "public"."contact_us" to "anon";

grant delete on table "public"."contact_us" to "authenticated";

grant insert on table "public"."contact_us" to "authenticated";

grant references on table "public"."contact_us" to "authenticated";

grant select on table "public"."contact_us" to "authenticated";

grant trigger on table "public"."contact_us" to "authenticated";

grant truncate on table "public"."contact_us" to "authenticated";

grant update on table "public"."contact_us" to "authenticated";

grant delete on table "public"."contact_us" to "service_role";

grant insert on table "public"."contact_us" to "service_role";

grant references on table "public"."contact_us" to "service_role";

grant select on table "public"."contact_us" to "service_role";

grant trigger on table "public"."contact_us" to "service_role";

grant truncate on table "public"."contact_us" to "service_role";

grant update on table "public"."contact_us" to "service_role";

create policy "Enable insert for users based on user_id"
on "public"."contact_us"
as permissive
for insert
to public
with check ((1 = 1));



