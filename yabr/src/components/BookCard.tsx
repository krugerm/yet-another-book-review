import React from 'react';
import type { IBookWithRatings } from '../types/IBook';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaRegStar, FaStar, FaStarHalf, FaFacebookF, FaTwitter, FaPinterest } from 'react-icons/fa';

export function BookCard({ book }: { book: IBookWithRatings }) {
  const navigate = useNavigate();

  const buildStars = (rating: number): JSX.Element[] => {
    const stars: JSX.Element[] = [];
    
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i - rating <= 0.5) {
        stars.push(<FaStarHalf key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaStar key={i} className="text-gray-300" />);
      }
    }
    return stars;
  };

  return (
    <div className="max-w-sm bg-gray-100 p-4" onClick={() => navigate('/book/' + book.google_books_id)}>
      <img 
        src={(book.thumbnail ? (book.thumbnail + "&fife=w800") : "/src/assets/placeholder1.png")}
        alt={book.title} 
        className="w-32 h-48 object-cover mx-auto" // Updated size and centering
      />
      <h5 className="text-base tracking-tight text-gray-900 dark:text-white mt-2 text-center">{book.title}</h5>
      <div className="flex items-center justify-center mt-1"> 
        {buildStars(book.average_rating)}
        <span className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">{book.average_rating?.toFixed(1)}</span>
      </div>

      {book.review_count > 0 && (
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">({book.review_count}) reviews</span>
      )}
    </div>
  );
};