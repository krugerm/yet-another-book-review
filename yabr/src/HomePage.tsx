import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Carousel } from 'flowbite-react';
import type { IBook, IBookWithRatings } from "./types/IBook";
import { importBookFromGoogleAPI } from './importGoogleBook';
import { BookCard } from './components/BookCard';
import { YabrHeader } from './components/YabrHeader';
import { YabrFooter } from './components/YabrFooter';


const HomePage = () => {
  const [topRatedBooks, setTopRatedBooks] = useState<IBookWithRatings[]>([]);
  const [recentBooks, setRecentBooks] = useState<IBookWithRatings[]>([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    // Fetch top rated books
    const { data: topRated } = await supabase
      .from<IBookWithRatings>('books_with_ratings')
      .select('*')
      .order('average_rating', { ascending: false })
      .limit(5);
    setTopRatedBooks(topRated);

    const { data: allBooks } = await supabase
      .from<IBookWithRatings>('books_with_ratings')
      .select('*')
      .neq('thumbnail', null)
      .order('created_at', { ascending: false })
      .order('title', { ascending: false })
      .limit(12);

    if (allBooks == null) {
      console.log("No books found in the database");
      return;
    }

    // iterate thru allBooks, and for those missing medium_image, fetch from Google Books API
    // const books: IBook[] = allBooks;
    // for (const book of books) {
    //   if (!book.medium_image) {
    //     const response = await fetch(book.self_link!);
    //     const data = await response.json();
    //     console.log("Fetched book data", data);

    //     if (data.error) {
    //       console.error("Error fetching book data:", data.error.message);
    //       break;
    //     }

    //     await importBookFromGoogleAPI(data);
    //   }
    // }

    setRecentBooks(allBooks);
  };


  return (
    <div className="bg-white dark:bg-gray-900">

      <YabrHeader />

      {/* Hero Section */}
      <section className="relative bg-gray-700 text-white py-20 shadow-md">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl text-white font-bold mb-4">Discover Your Next Favorite Book</h2>
          <p className="mb-8">Join our community of book lovers and share your thoughts on the latest reads.</p>
          <button className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-6 rounded-full text-lg">JOIN THE YABR COMMUNITY</button>
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
                    <img src={book.thumbnail || '/placeholder-book.jpg'} alt={book.title} className="w-32 h-48 object-cover mb-4" />
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
      <section className="py-12 shadow-md px-6">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-700">RECENT BOOKS</h2>
            <a href="#" className="text-pink-500 hover:text-pink-600">VIEW ALL →</a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {recentBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </section>

      {/* Post Your Reviews */}
      <section className="py-12 bg-gray-700 text-center shadow-md">
        <div className="container mx-auto">
          <h2 className="text-2xl text-white font-bold mb-4">Post Your Reviews</h2>
          <p className="mb-6 text-white">Share your thoughts on the books you've read and help others discover great literature.</p>
          <button className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-6 rounded-full text-lg">SUBMIT A REVIEW</button>
        </div>
      </section>


      <YabrFooter />
    </div>
  );
};

export default HomePage;