import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { type IBook, type IBookWithRatings } from "./types/IBook";
import { type IBookReview } from "./types/iBookReview";
import { YabrHeader } from './components/YabrHeader';
import { YabrFooter } from './components/YabrFooter';

import { BookSearch } from './components/BookSearch';
import { HiDocumentText, HiHome, HiSave, HiSearch, HiUpload } from 'react-icons/hi';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { useUserContext } from './UserContext';
import { useTranslation } from 'react-i18next';

import { v4 as uuidv4 } from 'uuid';
import { useAlert } from './AlertContext';

import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";
import { Pagination } from "flowbite-react";


const CreateBookReviewPage = () => {
  const { google_books_id } = useParams<{ google_books_id?: string }>();

  const [showCreateReviewModal, setShowCreateReviewModal] = useState(false);
  const [rating, setReviewRating] = useState(0);
  const [content, setReviewContent] = useState('');
  
  const [nResults, setNResults] = useState(0);
  const [searchResults, setSearchResults] = useState<IBookWithRatings[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(12);
  const [loading, setLoading] = useState(false);

  const [selectedBook, setSelectedBook] = useState<IBookWithRatings | null>(null);
  
  const userContext = useUserContext();
  const { userProfile } = userContext!;
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showAlert } = useAlert();

  useEffect(() => {
    if (!userContext?.loading && !userProfile) {
      showAlert(t('You must be logged in to create a review'), 'error');
      navigate('/login?next=/create-book-review');
    } else {
      fetchBooks();
    }

    if (google_books_id) {
      fetchBook(google_books_id);
      setShowCreateReviewModal(true);
    }
  }, [userContext, userProfile, google_books_id]);

  const fetchBook = async (google_books_id: string) => {
    try {
      setLoading(true);

      const { data: book } = await supabase
        .from<IBookWithRatings>('books_with_ratings')
        .select('*')
        .eq('google_books_id', google_books_id)
        .single();

      // console.log("fetchBook", book);

      setSearchResults([book]);
      setNResults(1);
      setSelectedBook(book);
    }
    catch (error) {
      showAlert('Error fetching book details', 'error');
      console.error('Error fetching books:', error);
    }
    finally {
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    try {
      setLoading(true);
      
      var query = supabase
        .from<IBookWithRatings>('books_with_ratings')
        .select('*', { count: 'exact' });

      if (google_books_id != null) {
        query = query.eq('google_books_id', google_books_id);
      }
      else if (searchTerm != null && searchTerm.length > 0) {
        query = query
        .textSearch('title, description, authors, isbn', searchTerm);
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

  const handleBookSelect = (book) => {
    setSelectedBook(book);
    setShowCreateReviewModal(true);
  };

  function onCloseCreateReviewModal() {
    setShowCreateReviewModal(false);
    setReviewRating(0);
    setReviewContent('');
  }

  const handleCreateReview = async () => {
    if (!userContext?.loading && !userProfile) {
      showAlert(t('You must be logged in to submit a review'), 'error');
      return;
    }
    if (!selectedBook) {
      showAlert(t('You must select a book to review'), 'error');
      return;
    }

    try {
      // Check if book exists in Supabase
      // console.log("checking if book exists in Supabase: ", selectedBook.id);
      const { data: existingBook } = await supabase
        .from('books')
        .select('*')
        .eq('google_books_id', selectedBook.google_books_id)
        .single();

      // console.log("existingBook", existingBook);

      let googleBooksId;
      if (!existingBook) {
        // console.log("inserting book: ", selectedBook);
        
        const { data, error } = await supabase
          .from('books')
          .insert(selectedBook)
          .select<'*', IBook>()
          .single();
                
        // console.log("inserted book", data);

        if (error) {
          showAlert(t('Error inserting book') + error, 'error');
          // console.log("Error inserting book: ", error);
          throw error;
        }
        if (!data) {
          throw new Error('Error inserting book');
        }
        googleBooksId = data.google_books_id;
      } else {
        googleBooksId = existingBook.google_books_id;
      }

      // console.log("UserProfile: ", userProfile);

      const reviewData: IBookReview = {
        id: uuidv4(),
        rating: rating,
        review_text: content,
        user_id: userProfile!.id,
        google_books_id: googleBooksId,
        created_at: new Date().toISOString(),
      };

      // showAlert("About to insert reviewData: " + JSON.stringify(reviewData), 'info');

      const { data, error } = await supabase
        .from('reviews')
        .insert(reviewData)
        .select()
        .single();

      if (error) {
        showAlert(t('Error creating review') + JSON.stringify(error), 'error');
        // console.error('Error creating review:', error);
        return null;
      }

      showAlert(t('Review submitted successfully!'), 'success');

      // navigate to the book detail page to see your review
      navigate('/book/' + googleBooksId);
    } catch (error) {
      console.error('Error submitting review:', error);
      showAlert(t('An error occurred while submitting your review. Please try again.'), 'error');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 shadow-md">

      <YabrHeader />

      <div className="container mx-auto p-6 min-h-96">
        <h1 className="text-3xl font-bold mb-4">{t('Create a Book Review')}</h1>

        <BookSearch onSelectBook={handleBookSelect} />

      </div>

      <YabrFooter />
      
      <Modal show={showCreateReviewModal} size="lg" onClose={onCloseCreateReviewModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 id="title-create-review" className="text-xl font-medium text-gray-900 dark:text-white">Create your book review:</h3>

            <div>
              <label className="block mb-2">{t('Rating')}</label>

              <div className="flex items-center space-x-4 p-0">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  id={`create-btn-star-${star}`}
                  key={star}
                  type="button"
                  onClick={() => setReviewRating(star)}
                  className={`btn bg-transparent hover:bg-transparent hover:text-yellow-300 text-2xl ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  ★
                </button>
              ))}
              </div>
            </div>

            <div>
              <label className="block mb-2">{t('Your Review')}</label>
              <ReactQuill value={content} onChange={setReviewContent} />
            </div>
            
            <div className="w-full grid justify-items-end">
              <Button id="btn-save-review" className='bg-blue-700' onClick={handleCreateReview}>Submit</Button>
            </div>

          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CreateBookReviewPage;