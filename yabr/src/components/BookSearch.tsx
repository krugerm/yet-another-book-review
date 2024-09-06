import React, { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import { useTranslation } from 'react-i18next';
import type { IBook } from '../types/IBook';
import { convertGoogleBookToIBook } from '../utils/importBookFromGoogleAPI';
import { Button } from 'flowbite-react';

export function BookSearch({ onSelectBook }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<IBook[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const searchBooks = useCallback(
    debounce(async (term) => {
      if (!term) return;
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(term)}`
        );
        const data = await response.json();
        console.log('Search results:', data.items);
        const books = data.items.map(convertGoogleBookToIBook);
        setSearchResults(books || []);
      } catch (error) {
        console.error('Error searching books:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    searchBooks(term);
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder={t('Search for a book...')}
        className="w-full p-2 border rounded"
      />
      {isLoading && <p>{t('Searching...')}</p>}
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
    </div>
  );
}
