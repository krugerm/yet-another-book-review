import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

describe('Book and Review Operations', () => {
  let createdBookId;

  // Test for creating a book
  test('should create a book successfully', async () => {
    const bookData = {
      google_books_id: 'test_id_' + Date.now(), // Ensure unique ID for each test run
      title: 'Test Book',
      author: 'Test Author',
      published_date: '2023-01-01',
      description: 'This is a test book description',
    };

    const { data, error } = await supabase
      .from('books')
      .insert(bookData)
      .single();

    expect(error).toBeNull();
    expect(data).toHaveProperty('google_books_id', bookData.google_books_id);
    expect(data).toHaveProperty('title', bookData.title);

    createdBookId = data.google_books_id; // Save for use in review test
  });

  // Test for creating a review
  test('should create a review for the book', async () => {
    const reviewData = {
      book_id: createdBookId,
      user_id: 'test_user_id', // You might want to create a test user or use a mock ID
      content: 'This is a test review for the test book.',
      rating: 4,
    };

    const { data, error } = await supabase
      .from('reviews')
      .insert(reviewData)
      .single();

    expect(error).toBeNull();
    expect(data).toHaveProperty('book_id', createdBookId);
    expect(data).toHaveProperty('content', reviewData.content);
    expect(data).toHaveProperty('rating', reviewData.rating);
  });

  // Clean up after tests
  afterAll(async () => {
    // Delete the test review
    await supabase
      .from('reviews')
      .delete()
      .eq('book_id', createdBookId);

    // Delete the test book
    await supabase
      .from('books')
      .delete()
      .eq('google_books_id', createdBookId);
  });
});
