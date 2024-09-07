import React, { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';
import { useTranslation } from 'react-i18next';
import type { IBook } from '../types/IBook';
import { convertGoogleBookToIBook } from '../utils/importBookFromGoogleAPI';
import { Button } from 'flowbite-react';
import { Pagination } from "flowbite-react";

export function BookSearch({ onSelectBook }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(false);

  const [nResults, setNResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const googleBooksApiKey: string = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY as string;

  const { t } = useTranslation();

  const onPageChange = (page: number) => setCurrentPage(page);

  useEffect(() => {
    searchBooks(searchTerm);
  }, [searchTerm, currentPage, pageSize]);

  const searchBooks = useCallback(
    debounce(async (term) => {
      // console.log('searchBooks.debounce: ' + JSON.stringify([term, searchTerm, currentPage, pageSize]));

      if (!term) return;
      setLoading(true);
      try {
        const url = `https://www.googleapis.com/books/v1/volumes?maxResults=${pageSize}&startIndex=${(currentPage - 1) * pageSize}&key=${googleBooksApiKey}&q=${encodeURIComponent(term)}`;
        // console.log('searchBooks url:', url);
        const response = await fetch(url);
        const data = await response.json();
        // console.log('searchBooks results:', data.items);
        const books = data.items.map(convertGoogleBookToIBook);
        const totalItems = data.totalItems;
        setNResults(totalItems);
        setSearchResults(books || []);
      } catch (error) {
        console.error('Error searching books:', error);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  const handleSearchChange = (term) => {
    // console.log('handleSearchChange', term);
    setSearchTerm(term);
    searchBooks(term);
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => handleSearchChange(e.target.value)}
        placeholder={t('Search for a book...')}
        className="w-full p-2 border rounded"
      />

      {/* <p>{loading} {searchTerm} {nResults} {pageSize}</p> */}
      {(Math.ceil(nResults / pageSize) > 1) && (
        <div className="flex overflow-x-auto justify-between">
          <p className="hidden text-left my-auto">Showing {(currentPage - 1) * pageSize + 1} to {Math.min(nResults, (currentPage) * pageSize)} of {nResults} results</p>
          <Pagination currentPage={currentPage} totalPages={Math.ceil(nResults / pageSize)} onPageChange={onPageChange} />
        </div>)}

      {loading && <p className='my-4'>{t('Searching...')}</p>}
      <ul className="mt-4 space-y-4">
        {searchResults.map((book) => (
          <li key={book.google_books_id} className="flex items-start space-x-4 p-2 border rounded" onClick={() => onSelectBook(book)}>

              <img
                src={book.thumbnail || '/src/assets/placeholder1.png'}
                alt={book.title}
                className="w-16 h-24 object-cover"
              />

              <div className="text-left flex-1">
                <h3 className="font-bold">{book.title}</h3>
                <p>{book.authors?.join(', ')}</p>
                <p>{book.published_date}</p>
                <p className="line-clamp-2">{book.description}</p>
              </div>

              <Button
                className="btn bg-primary-700 mt-2 px-0 py-0 bg-blue-500 text-white rounded ml-auto"
              >
                {t('Select')}
              </Button>

          </li>
        ))}
      </ul>

      {(!loading && Math.ceil(nResults / pageSize) > 1) && (
        <div className="flex overflow-x-auto sm:justify-center">
          <Pagination currentPage={currentPage} totalPages={Math.ceil(nResults / pageSize)} onPageChange={onPageChange} />
        </div>)}
    </div>
  );
}
