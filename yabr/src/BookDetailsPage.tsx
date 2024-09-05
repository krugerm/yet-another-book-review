import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Carousel } from 'flowbite-react';
import type { IBook, IBookWithRatings } from "./types/IBook";
import { importBookFromGoogleAPI } from './importGoogleBook';
import { BookCard } from './components/BookCard';
import { YabrHeader } from './components/YabrHeader';
import { YabrFooter } from './components/YabrFooter';


const BookDetailsPage = () => {

  return (
    <div className="bg-white dark:bg-gray-900">

      <YabrHeader />


      <YabrFooter />
    </div>
  );
};

export default BookDetailsPage;