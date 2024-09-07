import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import type { IBookWithRatings } from '../types/IBook';
import { Button } from 'flowbite-react';
import { Breadcrumb } from "flowbite-react";
import { HiHome } from "react-icons/hi";
import { BookCard } from './BookCard';

interface ReviewFormProps {
  book: IBookWithRatings;
  onSubmit: (rating: number, content: string) => void;
}

export function ReviewForm({ book, onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const { t } = useTranslation();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(rating, content);
  };

  console.log(book);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <div className="flex justify-center items-center">
        <BookCard book={book} />
      </div>

      {/* <div>
        <h2 className="text-2xl font-bold">{book.title}</h2>
        <p>{book.authors?.join(', ')}</p>
        <img 
          src={book.thumbnail || '/assets/placeholder1.png'} 
          alt={book.title} 
          className="w-32 h-48 object-cover mx-auto"
        />
      </div> */}
      
      <div>
        <label className="block mb-2">{t('Rating')}</label>

        <div className="flex items-center space-x-4 p-0">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className={`btn bg-transparent hover:bg-transparent hover:text-yellow-300 text-2xl ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            ★
          </button>
        ))}
        </div>
      </div>

      <div>
        <label className="block mb-2">{t('Your Review')}</label>
        <ReactQuill value={content} onChange={setContent} />
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded"
        disabled={!rating || !content}
      >
        {t('Submit Review')}
      </button>
    </form>
  );
}
