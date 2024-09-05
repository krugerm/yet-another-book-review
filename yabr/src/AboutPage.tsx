import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Carousel } from 'flowbite-react';
import type { IBook, IBookWithRatings } from "./types/IBook";
import { importBookFromGoogleAPI } from './importGoogleBook';
import { BookCard } from './components/BookCard';
import { YabrHeader } from './components/YabrHeader';
import { YabrFooter } from './components/YabrFooter';


const AboutPage = () => {

  return (
    <div className="bg-white dark:bg-gray-900">
      <YabrHeader />

      <section className="bg-white dark:bg-gray-900 shadow-md">
        <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md text-left">
            
          <h1 className="text-3xl font-bold mb-4">About Yet Another Book Review</h1>
          
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Our Mission</h2>
            <p className="text-gray-700">
              At Yet Another Book Review, we believe in the power of books to inspire, educate, and transform. Our mission is to create a vibrant community of book lovers where readers can discover new titles, share their thoughts, and engage in meaningful discussions about literature.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">What We Offer</h2>
            <ul className="list-disc list-inside text-gray-700">
              <li>Honest and thoughtful book reviews from our community</li>
              <li>A platform to share your own book reviews and ratings</li>
              <li>Personalized book recommendations based on your reading preferences</li>
              <li>Discussion forums to connect with other book enthusiasts</li>
              <li>Author spotlights and interviews</li>
            </ul>
          </section>
          
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Our Story</h2>
            <p className="text-gray-700">
              Founded in 2024 by a group of passionate readers, Yet Another Book Review started as a small blog and has since grown into a thriving community. We're driven by our love for books and our desire to create a space where every reader's voice can be heard.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-2">Join Our Community</h2>
            <p className="text-gray-700">
              Whether you're a casual reader or a dedicated bibliophile, we welcome you to join our community. Share your thoughts, discover your next favorite book, and connect with fellow readers who share your passion for the written word.
            </p>
          </section>

        </div>
      </section>

      <YabrFooter />
    </div>
  );
};

export default AboutPage;