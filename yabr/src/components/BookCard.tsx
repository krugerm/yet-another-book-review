import React from 'react';
import type { IBookWithRatings } from '../types/IBook';

export const BookCard: React.FC<{ book: IBookWithRatings }> = ({ book }) => (
    <div className="max-w-sm bg-gray-100 p-4">
      <img 
        src={book.thumbnail || '/src/assets/placeholder1.png'} 
        alt={book.title} 
        className="w-32 h-48 object-cover mx-auto" // Updated size and centering
      />
      <h5 className="text-base tracking-tight text-gray-900 dark:text-white mt-2 text-center">{book.title}</h5>
      <div className="flex items-center justify-center mt-1"> {/* Centered rating stars */}
        {[...Array(5)].map((_, i) => (
          <svg key={i} className={`w-4 h-4 ${i < Math.round(book.average_rating) ? 'text-yellow-300' : 'text-gray-300'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
          </svg>
        ))}
        <span className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">{book.average_rating?.toFixed(1)}</span>
      </div>
    </div>
  );