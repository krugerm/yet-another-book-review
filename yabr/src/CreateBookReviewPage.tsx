import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import type { IBookWithRatings } from "./types/IBook";
import { BookCard } from './components/BookCard';
import { YabrHeader } from './components/YabrHeader';
import { YabrFooter } from './components/YabrFooter';


const CreateBookReviewPage = () => {
  const [nResults, setNResults] = useState(0);
  const [searchResults, setSearchResults] = useState<IBookWithRatings[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(12);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {

    try {
      setLoading(true);
      
      var query = supabase
        .from<IBookWithRatings>('books_with_ratings')
        .select('*', { count: 'exact' });

      if (searchTerm != null && searchTerm.length > 0) {
        query = query
        .textSearch('title, description, authors, isbn', searchTerm);
        // .ilike('title', searchTerm)
        // .ilike('description', searchTerm)
        // .ilike('authors', searchTerm)
        // .ilike('isbn', searchTerm);
      }

      var { data: results, error, count } = await query
        .neq('thumbnail', null)
        .order('created_at', { ascending: false })
        .order('title', { ascending: false })
        .range(currentPage * pageSize, (currentPage + 1) * pageSize - 1);

      if (results == null) {
        console.log("No books found in the database");
        setSearchResults([]);
        setNResults(0);
      }
      else if (error) {
        console.log("No books found in the database: " + error);
        setSearchResults([]);
        setNResults(0);
      }
      else{
        setSearchResults(results);
        setNResults(count ?? 0);
      }
        
    }
    catch (err) {
      console.error("Error fetching books", err);
    }
    finally {
      setLoading(false);
    }
  };


  return (
    <div className="bg-white dark:bg-gray-900">

      <YabrHeader />

      {/* Search Results */}
      <section className="py-12">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-700">BOOKS FOUND</h2>
            <a href="/search" className="text-pink-500 hover:text-pink-600">VIEW ALL</a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {searchResults.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </section>

      <YabrFooter />
    </div>
  );
};

export default CreateBookReviewPage;