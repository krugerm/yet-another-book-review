-- Create a table for public profiles
create table profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,

  constraint username_length check (char_length(username) >= 3)
);

alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check ((select auth.uid()) = id);

create policy "Users can update own profile." on profiles
  for update using ((select auth.uid()) = id);

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
-- See https://supabase.com/docs/guides/auth/managing-user-data#using-triggers for more details.
create function public.handle_new_user()
returns trigger
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Set up Storage!
insert into storage.buckets (id, name)
  values ('avatars', 'avatars');

-- Set up access controls for storage.
-- See https://supabase.com/docs/guides/storage/security/access-control#policy-examples for more details.
create policy "Avatar images are publicly accessible." on storage.objects
  for select using (bucket_id = 'avatars');

create policy "Anyone can upload an avatar." on storage.objects
  for insert with check (bucket_id = 'avatars');

create policy "Anyone can update their own avatar." on storage.objects
  for update using ((select auth.uid()) = owner) with check (bucket_id = 'avatars');




-- Create books table
CREATE TABLE books (
id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
title TEXT NOT NULL,
author TEXT NOT NULL,
isbn_13 CHAR(13) UNIQUE,
isbn_10 CHAR(10) UNIQUE,
oclc_number TEXT UNIQUE,
doi TEXT UNIQUE,
publisher_id TEXT,
publication_year INTEGER,
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
UNIQUE(title, author, publication_year)
);

alter table books enable row level security;

-- Create reviews table
CREATE TABLE reviews (
id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
book_id UUID REFERENCES books(id) ON DELETE CASCADE,
user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
rating INTEGER CHECK (rating >= 1 AND rating <= 5),
review_text TEXT NOT NULL,
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
UNIQUE(book_id, user_id)
);

alter table reviews enable row level security;

-- Create a view to get books with their average rating
CREATE VIEW books_with_ratings AS
SELECT 
b.id,
b.title,
b.author,
b.isbn_13,
b.isbn_10,
b.oclc_number,
b.doi,
b.publisher_id,
b.publication_year,
COALESCE(AVG(r.rating), 0) as average_rating,
COUNT(r.id) as review_count
FROM books b
LEFT JOIN reviews r ON b.id = r.book_id
GROUP BY b.id, b.title, b.author, b.isbn_13, b.isbn_10, b.oclc_number, b.doi, b.publisher_id, b.publication_year;

-- Create an index to improve search performance
CREATE INDEX idx_books_search ON books (title, author, isbn_13, isbn_10, oclc_number, doi);