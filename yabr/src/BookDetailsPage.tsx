import React, { useState, useEffect } from 'react';
import { YabrHeader } from './components/YabrHeader';
import { YabrFooter } from './components/YabrFooter';
import { FaEdit, FaArrowLeft, FaRegStar, FaStar, FaStarHalf, FaFacebookF, FaTwitter, FaPinterest } from 'react-icons/fa';
import { FiHeart, FiSearch } from 'react-icons/fi';
import { RiDeleteBin2Fill } from "react-icons/ri";
import { useNavigate, useParams } from 'react-router-dom';
import {type IBook, IBookWithRatings} from './types/IBook';
import {type IBookReviewWithProfile, type IBookReview} from './types/iBookReview';
import { supabase } from './supabaseClient';
import DOMPurify from 'dompurify';
import { useAlert } from './AlertContext';
import { useUserContext } from './UserContext';
import { addAiGeneratedReviews } from './utils/generateAiReviews';
import { IoSparklesSharp } from "react-icons/io5";
import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';

const BookDetailsPage: React.FC = () => {
  const { google_books_id } = useParams<{ google_books_id: string }>();
  const { showAlert } = useAlert();
  const [showEditReviewModal, setShowEditReviewModal] = useState(false);
  const [showCreateReviewModal, setShowCreateReviewModal] = useState(false);
  
  const [rating, setReviewRating] = useState(0);
  const [content, setReviewContent] = useState('');

  const [book, setBook] = useState<IBook>();
  const [selectedReview, setSelectedReview] = useState<IBookReview>();
  const [reviews, setReviews] = useState<IBookReviewWithProfile[]>([]);
  const [topRated, setTopRated] = useState<IBookWithRatings[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [sortType, setSortType] = useState<'rating asc' | 'rating desc' | 'created_at asc' | 'created_at desc'>('rating desc');
  const navigate = useNavigate();
  const userContext = useUserContext();
  const { userProfile } = userContext!;
  const { t } = useTranslation();

  useEffect(() => {
    fetchBook();
  }, []);

  const fetchBook = async () => {
    try {
      setLoading(true);

      console.log('Fetching book details for google_books_id:', google_books_id);

      const { data: book } = await supabase
        .from<IBook>('books')
        .select('*')
        .eq('google_books_id', google_books_id)
        .single();
      // showAlert('Loaded book: ' + book?.title, 'success');
      setBook(book);

      const { data: reviews } = await supabase
        .from<IBookReviewWithProfile>('reviews_with_profiles')
        .select('*')
        .eq('google_books_id', book.google_books_id)
        .order('created_at', { ascending: false });
      // showAlert('Loaded reviews: ' + reviews?.length, 'success');
      setReviews(reviews ?? []);

      const { data: topRated } = await supabase
        .from<IBookWithRatings>('books_with_ratings')
        .select('*')
        .order('average_rating', { ascending: false })
        .limit(5);
      setTopRated(topRated ?? []);
    }
    catch (error) {
      showAlert('Error fetching book details', 'error');
      console.error('Error fetching books:', error);
    }
    finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    if (!book) return;

    const { data: reviews } = await supabase
      .from<IBookReviewWithProfile>('reviews_with_profiles')
      .select('*')
      .eq('google_books_id', book.google_books_id)
      .order('created_at', { ascending: false });

    setReviews(reviews ?? []);
  }

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

  const handleAddAiGeneratedReviews = async (book: IBook) => {
    try {
      setAiLoading(true);
      await addAiGeneratedReviews(book);
      await fetchReviews();
    }
    catch (error) {
        console.error('Error adding book:', error);
    }
    finally {
      setAiLoading(false);
    }
  }

  const handleEditButtonClick = (review: IBookReviewWithProfile) => {
    setSelectedReview(review);
    setReviewRating(review.rating);
    setReviewContent(review.review_text);
    setShowEditReviewModal(true);
  }

  function onCloseCreateReviewModal() {
    setShowCreateReviewModal(false);
    setReviewRating(0);
    setReviewContent('');
  }

  function onCloseEditReviewModal() {
    setShowEditReviewModal(false);
    setReviewRating(0);
    setReviewContent('');
  }

  const handleCreateReview = async () => {
    if (!userContext?.loading && !userProfile) {
      showAlert(t('You must be logged in to create a review'), 'error');
      return;
    }

    try {

      const reviewData: IBookReview = {
        id: uuidv4(),
        rating: rating,
        review_text: content,
        user_id: userProfile!.id,
        google_books_id: book?.google_books_id!,
        created_at: new Date().toISOString(),
      };

      // showAlert("About to insert reviewData: " + JSON.stringify(reviewData), 'info');

      const { data, error } = await supabase
        .from('reviews')
        .insert(reviewData)
        .select()
        .single();

      if (error) {
        showAlert(t('Error creating review'), 'error');
        return null;
      }

      showAlert(t('Review created!'), 'success');
      setShowCreateReviewModal(false);
      fetchReviews();

    } catch (error) {
      // console.error('Error updating review:', error);
      showAlert(t('An error occurred while creating your review. Please try again.'), 'error');
    }
  };

  const handleUpdateReview = async () => {
    if (!userContext?.loading && !userProfile) {
      showAlert(t('You must be logged in to update a review'), 'error');
      return;
    }
    if (!selectedReview) {
      showAlert(t('You must select a review to update'), 'error');
      return;
    }

    try {
      selectedReview.rating = rating;
      selectedReview.review_text = content;

      // console.log('Updating review:', selectedReview);

      const { data, error } = await supabase
        .from('reviews')
        .update({rating: rating, review_text: content})
        .eq('id', selectedReview.id);

      if (error) {
        showAlert(t('Error updating review'), 'error');
        return null;
      }

      showAlert(t('Review updated!'), 'success');
      setShowEditReviewModal(false);
      fetchReviews();

    } catch (error) {
      // console.error('Error updating review:', error);
      showAlert(t('An error occurred while updating your review. Please try again.'), 'error');
    }
  };

  const handleDeleteReview = async () => {
    if (!userContext?.loading && !userProfile) {
      showAlert(t('You must be logged in to delete a review'), 'error');
      return;
    }
    if (!selectedReview) {
      showAlert(t('You must select a review to delete'), 'error');
      return;
    }

    //TODO: show confirmation dialog

    try {
      const { data, error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', selectedReview.id);

      if (error) {
        showAlert(t('Error deleting review'), 'error');
        return null;
      }

      showAlert(t('Review deleted.'), 'success');
      setShowEditReviewModal(false);
      fetchReviews();

    } catch (error) {
      console.error('Error deleting review:', error);
      showAlert(t('An error occurred while deleting your review. Please try again.'), 'error');
    }
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  const hasUserReviewed = userProfile && reviews.some(review => review.user_id === userProfile.id);


  // cycle through the sort types
  function handleSortClick(): void {
    switch (sortType) {
      case 'rating desc':
        setSortType('rating asc');
        setReviews(reviews.slice().sort((a, b) => a.rating - b.rating));
        break;
      case 'rating asc':
        setSortType('created_at desc');
        setReviews(reviews.slice().sort((a, b) => a.created_at.localeCompare(b.created_at)));
        break;
      case 'created_at desc':
        setSortType('created_at asc');
        setReviews(reviews.slice().sort((a, b) => b.created_at.localeCompare(a.created_at)));
        break;
      case 'created_at asc':
        setSortType('rating desc');
        setReviews(reviews.slice().sort((a, b) => b.rating - a.rating));
        break;
    }
  }

  return (
    <div className="bg-white dark:bg-gray-900 margin-md">

      <YabrHeader />

      {(book == null || loading) && (
        <div className="flex items-center justify-center h-64">
          <FiSearch className="text-4xl text-gray-400 animate-spin" />
        </div>
      )}

      <div className="flex text-left px-4 py-0">
        <a href="#" className="flex items-center" onClick={() => navigate('/search')}>
          <FaArrowLeft className="mr-2" /> All Reviewed Books
        </a>
      </div>

      {(book && !loading) && (
        <div>

          {/* Main Content */}
          <main className="container mx-auto px-4 py-8 flex">
            {/* Left Column */}
            <div className="w-1/3 pr-8">
              <img src={(book.thumbnail ? (book.thumbnail + "&fife=w800") : "/assets/placeholder1.png")} alt={book.title} className="w-full shadow-lg" />
              
              {book.info_link && (
                <button onClick={() => window.open(book.info_link!)} className="mt-4 w-full bg-blue-500 text-white py-2 rounded">Buy this book</button>
              )}

              {book.preview_link && (
                <button onClick={() => window.open(book.preview_link!)} className="mt-4 w-full bg-green-500 text-white py-2 rounded">Preview this book</button>
              )}
              
              {/* {hasUserReviewed && (
                <button onClick={() => navigate('/edit-book-review/' + book.google_books_id)} className="mt-4 w-full bg-yellow-500 text-white py-2 rounded">Edit your review</button>
              )} */}

              {!hasUserReviewed && (
                <button id="btn-create-review" onClick={() => setShowCreateReviewModal(true)} className="mt-4 w-full bg-red-500 text-white py-2 rounded">Create your own review</button>
              )}

              {reviews.length < 3 && (
                <button onClick={() => handleAddAiGeneratedReviews(book)} className="mt-4 w-full bg-yellow-500 text-white py-2 rounded">
                  {aiLoading ? (
                    <span className="flex justify-center">
                      <IoSparklesSharp className="animate-spin mx-2" /> Adding AI Reviews
                    </span>
                  ) : (
                    <span className="flex justify-center">
                      <IoSparklesSharp className="mx-2" /> Add AI Generated Reviews
                    </span>
                  )}
                </button>
              )}
            </div>

            {/* Right Column */}
            <div className="w-2/3">

              <div className="py-0">
                <h1 className="text-left text-4xl font-bold">{book.title}</h1>
                <p className="text-left text-2xl text-gray-600">{book.authors?.join(', ')}</p>
              </div>
              
              <p className="py-4 text-left text-wrap text-gray-700 mb-4">{book.description}</p>
              
              {/* Book Details */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                
                <div>
                  <h3 className="font-bold">Published</h3>
                  <p>{book.published_date}</p>
                </div>

                {book.isbn_13 && (
                <div>
                  <h3 className="font-bold">ISBN 13</h3>
                  <p>{book.isbn_13}</p>
                </div>
                )}

                {book.isbn_10 && (
                <div>
                  <h3 className="font-bold">ISBN 10</h3>
                  <p>{book.isbn_10}</p>
                </div>
                )}

                <div>
                  <h3 className="font-bold">Edition Language</h3>
                  <p>{book.language}</p>
                </div>

                {book.categories && (
                  <div>
                    <h3 className="font-bold">Genres</h3>
                    <p>{book.categories?.join(', ')}</p>
                  </div>
                )}
              </div>

              {/* Share buttons */}
              <div className="flex space-x-2 mb-8">
                <button className="bg-blue-600 text-white p-2 rounded"><FaFacebookF /></button>
                <button className="bg-blue-400 text-white p-2 rounded"><FaTwitter /></button>
                <button className="bg-red-600 text-white p-2 rounded"><FaPinterest /></button>
                <button className="bg-blue-500 text-white px-4 py-2 rounded">Share</button>
              </div>

              {/* Reviews Section */}
              {reviews.length === 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">No Reviews Yet</h2>
                  <div className="flex items-center mb-4">
                    <p>Be the first to share a review!</p>
                  </div>
                </div>
              )}

              {reviews.length > 0 && (

                <div>
                  <h2 className="text-2xl font-bold mb-4">Reviews</h2>
                  <div className="flex items-center mb-4">
                    {buildStars(averageRating)}
                    <span className="ml-2 text-gray-600">Avg Rating {averageRating.toFixed(1)} from {reviews.length} reviews</span>
                    <button onClick={() => handleSortClick()} className="ml-auto bg-gray-200 px-4 py-2 rounded">Sort</button>
                  </div>

                  {/* Individual Reviews */}
                  {reviews.map((review, index) => (
                    <div key={index} className="mb-4 p-4 bg-white rounded shadow">
                      <div className="flex items-left mb-2">
                        <img src={review.avatar_url ?? '/assets/placeholder1.png'} alt={review?.full_name} className="w-12 h-12 rounded-full object-cover" />
                        <div className="mx-4 font-bold">{review.full_name} rated it </div>
                        {buildStars(review.rating)}

                        {userProfile && userProfile.id === review.user_id && (
                          <div className="ml-auto text-gray-600 text-right">
                            <button id="btn-edit-review" onClick={() => handleEditButtonClick(review)} className="flex text-blue-700 p-2 rounded outline">
                              <FaEdit size={24} className="mr-2" />
                              Edit
                            </button>
                          </div>
                        )}
                      </div>

                      <p className="text-left text-wrap mt-2" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(review.review_text) }}></p>
                    </div>
                  ))}
                </div>
              )}
              
            </div>
          </main>
        </div>
      )}


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

      <Modal show={showEditReviewModal} size="lg" onClose={onCloseEditReviewModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 id="title-edit-review" className="text-xl font-medium text-gray-900 dark:text-white">Edit your book review:</h3>

            <div>
              <label className="block mb-2">{t('Rating')}</label>

              <div className="flex items-center space-x-4 p-0">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  id={`edit-btn-star-${star}`}
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
            
            <div className="w-full flex justify-between">
              <Button id="btn-delete-review" className='bg-red-700 text-white' onClick={handleDeleteReview}>Delete</Button>
              <Button id="btn-update-review" className='bg-blue-700' onClick={handleUpdateReview}>Submit</Button>
            </div>

          </div>
        </Modal.Body>
      </Modal>

      <YabrFooter />
    </div>
  );
};

export default BookDetailsPage;