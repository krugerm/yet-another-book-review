import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Button, Carousel } from 'flowbite-react';
import type { IBook, IBookWithRatings } from "./types/IBook";
import { importBookFromGoogleAPI } from './utils/importBookFromGoogleAPI';
import { BookCard } from './components/BookCard';
import { YabrHeader } from './components/YabrHeader';
import { YabrFooter } from './components/YabrFooter';
import { useNavigate } from 'react-router-dom';


const HomePage = () => {
  const [topRatedBooks, setTopRatedBooks] = useState<IBookWithRatings[]>([]);
  const [recentBooks, setRecentBooks] = useState<IBookWithRatings[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);

      const { data: topRated } = await supabase
        .from<IBookWithRatings>('books_with_ratings')
        .select('*')
        //.order('average_rating', { ascending: false })
        .order('last_reviewed', { ascending: false })
        .limit(5);
      setTopRatedBooks(topRated);

      const { data: allBooks } = await supabase
        .from<IBookWithRatings>('books_with_ratings')
        .select('*')
        .neq('thumbnail', null)
        .order('last_reviewed', { ascending: false })
        //.order('created_at', { ascending: false })
        .order('title', { ascending: false })
        .limit(12);

      if (allBooks == null) {
        console.log("No books found in the database");
        return;
      }

      setRecentBooks(allBooks);
    }
    catch (error) {
      console.error('Error fetching books:', error);
    }
    finally {
      setLoading(false);
    }
  };


  return (
    <div className="bg-white dark:bg-gray-900 shadow-md py-0">

      <YabrHeader />

      {/* Hero Section */}
      <section className="relative bg-gray-700 text-white py-20 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/src/assets/library.png')" }}>
        <div className="container mx-auto text-center">
          <h2 className="text-3xl text-white font-bold mb-4">Discover Your Next Favorite Book</h2>
          <p className="mb-8">Join our community of book lovers and share your thoughts on the latest reads.</p>
          <div className="flex justify-center">
            <Button onClick={() => navigate('/register')} className="bg-pink-500 hover:bg-pink-600 text-white mx-6 py-2 px-12 rounded-full text-lg">JOIN THE YABR COMMUNITY</Button>
            <Button onClick={() => navigate('/create-book-review')} className="bg-pink-500 hover:bg-pink-600 text-white mx-6 py-2 px-12 rounded-full text-lg">POST A REVIEW</Button>
          </div>
        </div>
      </section>

      {/* Top Rated Books */}
      {/* <section className="py-12">
        <div className="max-w-screen-xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">TOP RATED BOOKS</h2>
          <div className="h-56 sm:h-64 xl:h-80 2xl:h-96">
            <Carousel>
              {topRatedBooks.map((book) => (
                <div key={book.id} className="flex h-full items-center justify-center bg-gray-400 dark:bg-gray-700 dark:text-white">
                  <div className="flex flex-col items-center text-center px-4">
                    <img src={book.thumbnail || '/src/assets/placeholder1.png'} alt={book.title} className="w-32 h-48 object-cover mb-4" />
                    <h3 className="text-xl font-bold">{book.title}</h3>
                    <p className="text-sm italic max-w-md">"{book.description?.substring(0, 100)}..."</p>
                    <p className="text-blue-500 mt-2">- {book.authors?.[0]}</p>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </section> */}

      {/* Recent Books */}
      <section className="py-12 px-6">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-700">RECENT REVIEWS</h2>
            <a href="/search" className="text-pink-500 hover:text-pink-600">VIEW ALL →</a>
          </div>

          {
            loading && (
              <div className="flex items-center justify-center w-56 h-56 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                <div role="status">
                    <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>
                    <span className="sr-only">Loading...</span>
                </div>
              </div>
            )
          }

          {
            !loading && recentBooks.length === 0 && (
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold">No books found</h3>
                <p>Check back later for more books</p>
              </div>
            )
          }

          {
            !loading && recentBooks.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {recentBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )
          }


        </div>
      </section>

      {/* Post Your Reviews */}
      {/* <section className="py-12 bg-gray-700 text-center">
        <div className="container mx-auto">
          <h2 className="text-2xl text-white font-bold mb-4">Post Your Reviews</h2>
          <p className="mb-6 text-white">Share your thoughts on the books you've read and help others discover great literature.</p>
          <Button onClick={() => navigate('/create-book-review')} className="items-center bg-pink-500 hover:bg-pink-600 text-white py-2 px-6 rounded-full text-lg mx-auto">SUBMIT A REVIEW</Button>
        </div>
      </section> */}

      <YabrFooter />
    </div>
  );
};

export default HomePage;