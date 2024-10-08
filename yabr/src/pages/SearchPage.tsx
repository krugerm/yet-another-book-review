import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import type { IBookWithRatings } from "../types/IBook";
import { BookCard } from '../components/BookCard';
import { YabrHeader } from '../components/YabrHeader';
import { YabrFooter } from '../components/YabrFooter';
import { useParams } from 'react-router-dom';
import { TextInput } from "flowbite-react";
import { HiSearch } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import { Pagination } from "flowbite-react";
import { useAlert } from '../contexts/AlertContext';


const SearchPage: React.FC = () => {
  const { initSearchTerm } = useParams<{ initSearchTerm?: string }>();

  const [nResults, setNResults] = useState(0);
  const [searchResults, setSearchResults] = useState<IBookWithRatings[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(initSearchTerm ?? '');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const { showAlert } = useAlert();

  useEffect(() => {
    fetchBooks();
  }, [searchTerm, currentPage, pageSize]);

  const onPageChange = (page: number) => setCurrentPage(page);

  const fetchBooks = async () => {

    try {
      setLoading(true);
      var s = searchTerm;
      
      var results;
      if (s && s.length > 0) {
        results = await supabase.from('books_with_ratings')
          .select<'*', IBookWithRatings>('*', { count: 'exact' })
          .textSearch('combined_text', s, {
            type: 'websearch',
            config: 'english'
          })
          .order('last_reviewed', { ascending: false })
          .range((currentPage - 1) * pageSize, currentPage * pageSize - 1);
      }
      else {
        results = await supabase
          .from('books_with_ratings')
          .select<'*', IBookWithRatings>('*', { count: 'exact' })
          .order('last_reviewed', { ascending: false })
          .range((currentPage - 1) * pageSize, currentPage * pageSize - 1);
      }

      const { data, error, count } = results;

      if (results == null) {
        setSearchResults([]);
        setNResults(0);
      }
      else if (error) {
        setSearchResults([]);
        setNResults(0);
        throw error;
      }
      else{
        setSearchResults(data);
        setNResults(count ?? 0);
      }
        
    }
    catch (err) {
      showAlert('Error fetching books', 'error');
    }
    finally {
      setLoading(false);
    }
  };


  return (
    <div className="bg-white dark:bg-gray-900 shadow-md">

      <YabrHeader showSearchBar={false} />

      <section className="p-4">
        <h2 className="mb-2 text-left text-l font-semibold text-gray-900 dark:text-white">Search our book reviews...</h2>
        
        <div className="relative">

          <form action="#" onSubmit={() => fetchBooks()}>
            <TextInput type="search" id="search" 
              // className="p-12"
              // className="p-4 text-m text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
              
              icon={HiSearch}
              placeholder={t("Search reviewed books...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              />

          </form>
        </div>
      </section>

      {/* Search Results */}
      <section className="px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="hidden md:flex text-2xl font-bold text-gray-700">RESULTS</h2>
            <p className="text-left hidden md:flex" id="text-showing">Showing {(currentPage - 1) * pageSize + 1} to {Math.min(nResults, (currentPage) * pageSize)} of {nResults}</p>
            {/* <a href="#" onClick={() => setSearchTerm('')} className="text-pink-500 hover:text-pink-600">VIEW ALL</a> */}

            {(Math.ceil(nResults / pageSize) > 1) && (
              <div className="flex overflow-x-auto sm:justify-center">
                <Pagination id="pagination" currentPage={currentPage} totalPages={Math.ceil(nResults / pageSize)} onPageChange={onPageChange} />
              </div>)}
          </div>

          {
            loading && (

              <div className="text-center mb-6">
                <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>
                <span className="sr-only">Loading...</span>
              </div>

            )
          }
            
          {
            !loading && searchResults.length === 0 && (
              <div className="text-center mb-6" id="no-results-message">
                <h3 className="text-lg font-bold">No reviewed books found</h3>
                <p>Check back later for more book reviews</p>
              </div>
            )
          }

          {
            !loading && searchResults.length > 0 && (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {searchResults.map((book) => (
                    <BookCard key={book.google_books_id} book={book} />
                  ))}
                </div>
                {(Math.ceil(nResults / pageSize) > 1) && (
                  <div className="flex overflow-x-auto justify-end">
                    <Pagination currentPage={currentPage} totalPages={Math.ceil(nResults / pageSize)} onPageChange={onPageChange} />
                  </div>)}
              </div>
            )
          }
        </div>
      </section>

      <YabrFooter />
    </div>
  );
};

export default SearchPage;