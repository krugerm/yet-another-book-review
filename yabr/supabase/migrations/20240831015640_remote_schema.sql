alter table "public"."books" add column "image_url" text;

create policy "Enable read access for all users"
on "public"."books"
as permissive
for select
to public
using (true);



