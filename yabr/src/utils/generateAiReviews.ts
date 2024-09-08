import { type IBookWithRatings, type IBook } from '../types/IBook';
import { type IBookReview } from '../types/iBookReview';
import OpenAI from 'openai';
import { supabase } from '../supabaseClient';

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
});

// const reviewers = [
//     'Michiko Kakutani',
//     'Ron Charles',
//     'Parul Sehgal',
//     'James Wood',
//     'Margaret Atwood',
//     'Maureen Corrigan',
//     'Dwight Garner',
//     'John Freeman'
// ];

interface IGeneratedReview {
    reviewer: string;
    review: string;
    rating: number;
}

async function generateAiReviews(book: IBook, reviewerNames: string[]): Promise<IGeneratedReview[]> {
    const reviews: IGeneratedReview[] = [];

    // for (const reviewer of reviewers.sort(() => Math.random() - 0.5)) {
    const reviewPromises = reviewerNames.sort(() => Math.random() - 0.5).map(async (reviewer) => {
        try {
            const prompt = `Returning your results in JSON only, give a rating out of 5 and write a book review for "${book.title}" by ${book.authors?.join(',')} in the style of ${reviewer}. The review should be between 20 and 150 words long and reflect ${reviewer}'s typical tone and focus. Here's a brief synopsis of the book: ${book.description}
            Your response should be in the following JSON format:
            {
            "rating": <number>,
            "review": "<string>"
            }`;

            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 200,
                temperature: 0.7,
            });

            var result = response?.choices[0]?.message?.content?.trim() ?? '';
            if (result.startsWith('```json')) {
                result = result.substring(7);
            }
            if (result.endsWith('```')) {
                result = result.substring(0, result.length - 3);
            }
            console.log(`Generated review for ${reviewer}:`, result);
            const jsonResult = JSON.parse(result);
            const generatedReview: IGeneratedReview = { reviewer, review: jsonResult.review, rating: jsonResult.rating };
            reviews.push(generatedReview);

            // Add a small delay to avoid rate limiting
            // await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
            console.error(`Error generating review for ${reviewer}:`, error);
        }
    });

    await Promise.all(reviewPromises);

    return reviews;
}

async function generateAiReviewsAndSaveToSupabase(bookData: IBook) {
    // First, add the book to your Supabase table if it's not already there
    const { data: book, error: bookError } = await supabase
        .from('books')
        .upsert(bookData)
        .select<'*', IBook>()
        .single();

    if (bookError) {
        console.error("Error adding book:", bookError);
        return;
    }

    const { data: reviewerProfiles, error: reviewerProfilesError } = await supabase
        .from('profiles')
        .select('id, full_name');

    if (reviewerProfilesError) {
        console.error("Error retrieving review profiles:", reviewerProfilesError);
        return;
    }

    // console.log('reviewerProfiles: ' + JSON.stringify(reviewerProfiles));

    var reviewerNamesToIds = {};
    for (let i = 0; i < reviewerProfiles.length; i++) {
        reviewerNamesToIds[reviewerProfiles[i].full_name] = reviewerProfiles[i].id;
    }
    // console.log('reviewerNamesToIds: ' + JSON.stringify(reviewerNamesToIds));
    // get the list of reviewer names
    const reviewerNames = Object.keys(reviewerNamesToIds);

    // Generate reviews
    const generatedReviews = await generateAiReviews(book, reviewerNames);

    // Add generated reviews to your Supabase table
    const insertData = generatedReviews.map(review => ({
        google_books_id: book.google_books_id,
        user_id: reviewerNamesToIds[review.reviewer],
        review_text: review.review,
        rating: review.rating,
    }));

    const { data: reviews, error: reviewsError } = await supabase
        .from('reviews')
        .insert(insertData)
        .select<'*', IBookReview>();

    if (reviewsError) {
        console.error("Error adding reviews:", reviewsError);
    }

    return { book, reviews };
}

async function createAiReviewsForAllBooks() {
    const { data: booksWithRatings, error: booksError } = await supabase
        .from('books_with_ratings')
        .select<'*', IBookWithRatings>('*')
        .order('review_count', { ascending: true });

    if (booksError) {
        console.error("Error retrieving books:", booksError);
        return;
    }

    for (const bookWithRatings of booksWithRatings) {
        if (bookWithRatings.review_count < 5) {
            // convert bookWithRatings to IBook
            const book: IBook = {
                google_books_id: bookWithRatings.google_books_id,
                etag: bookWithRatings.etag,
                self_link: bookWithRatings.self_link,
                title: bookWithRatings.title,
                authors: bookWithRatings.authors,
                publisher: bookWithRatings.publisher,
                published_date: bookWithRatings.published_date,
                description: bookWithRatings.description,
                isbn_10: bookWithRatings.isbn_10,
                isbn_13: bookWithRatings.isbn_13,
                page_count: bookWithRatings.page_count,
                printed_page_count: bookWithRatings.printed_page_count,
                print_type: bookWithRatings.print_type,
                categories: bookWithRatings.categories,
                maturity_rating: bookWithRatings.maturity_rating,
                allow_anon_logging: bookWithRatings.allow_anon_logging,
                content_version: bookWithRatings.content_version,
                created_at: bookWithRatings.created_at,
                updated_at: bookWithRatings.updated_at,

                text_readable: bookWithRatings.text_readable,
                image_readable: bookWithRatings.image_readable,
                language: bookWithRatings.language,
                preview_link: bookWithRatings.preview_link,
                info_link: bookWithRatings.info_link,
                canonical_volume_link: bookWithRatings.canonical_volume_link,
                height: bookWithRatings.height,
                width: bookWithRatings.width,
                thickness: bookWithRatings.thickness,
                contains_epub_bubbles: bookWithRatings.contains_epub_bubbles,
                contains_image_bubbles: bookWithRatings.contains_image_bubbles,
                
                small_thumbnail: bookWithRatings.small_thumbnail,
                thumbnail: bookWithRatings.thumbnail,
                small_image: bookWithRatings.small_image,
                medium_image: bookWithRatings.medium_image,
                large_image: bookWithRatings.large_image,
                extra_large_image: bookWithRatings.extra_large_image,
                
                country: bookWithRatings.country,
                saleability: bookWithRatings.saleability,
                is_ebook: bookWithRatings.is_ebook,
                
                viewability: bookWithRatings.viewability,
                embeddable: bookWithRatings.embeddable,
                public_domain: bookWithRatings.public_domain,
                text_to_speech_permission: bookWithRatings.text_to_speech_permission,
                epub_available: bookWithRatings.epub_available,
                pdf_available: bookWithRatings.pdf_available,
                web_reader_link: bookWithRatings.web_reader_link,
                access_view_status: bookWithRatings.access_view_status,
                quote_sharing_allowed: bookWithRatings.quote_sharing_allowed,
            };
            await generateAiReviewsAndSaveToSupabase(book);
        }
    }
}

export { generateAiReviewsAndSaveToSupabase, generateAiReviews, createAiReviewsForAllBooks };