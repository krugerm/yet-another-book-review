import { supabase } from './supabaseClient';

async function importBookFromGoogleAPI(googleBookData: any) {
  const {
    id: google_books_id,
    etag,
    selfLink: self_link,
    volumeInfo,
    saleInfo,
    accessInfo
  } = googleBookData;

  const bookData = {
    google_books_id,
    etag,
    self_link,
    title: volumeInfo.title,
    authors: volumeInfo.authors,
    publisher: volumeInfo.publisher,
    published_date: volumeInfo.publishedDate,
    description: volumeInfo.description,
    isbn_10: volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_10')?.identifier,
    isbn_13: volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_13')?.identifier,
    page_count: volumeInfo.pageCount,
    printed_page_count: volumeInfo.printedPageCount,
    print_type: volumeInfo.printType,
    categories: volumeInfo.categories,
    maturity_rating: volumeInfo.maturityRating,
    allow_anon_logging: volumeInfo.allowAnonLogging,
    content_version: volumeInfo.contentVersion,
    language: volumeInfo.language,
    preview_link: volumeInfo.previewLink,
    info_link: volumeInfo.infoLink,
    canonical_volume_link: volumeInfo.canonicalVolumeLink,
    
    text_readable: volumeInfo.readingModes.text,
    image_readable: volumeInfo.readingModes.image,
    
    height: volumeInfo.dimensions?.height,
    width: volumeInfo.dimensions?.width,
    thickness: volumeInfo.dimensions?.thickness,
    
    contains_epub_bubbles: volumeInfo.panelizationSummary?.containsEpubBubbles,
    contains_image_bubbles: volumeInfo.panelizationSummary?.containsImageBubbles,
    
    small_thumbnail: volumeInfo.imageLinks?.smallThumbnail,
    thumbnail: volumeInfo.imageLinks?.thumbnail,
    small_image: volumeInfo.imageLinks?.small,
    medium_image: volumeInfo.imageLinks?.medium,
    large_image: volumeInfo.imageLinks?.large,
    extra_large_image: volumeInfo.imageLinks?.extraLarge,
    
    country: saleInfo.country,
    saleability: saleInfo.saleability,
    is_ebook: saleInfo.isEbook,
    
    viewability: accessInfo.viewability,
    embeddable: accessInfo.embeddable,
    public_domain: accessInfo.publicDomain,
    text_to_speech_permission: accessInfo.textToSpeechPermission,
    epub_available: accessInfo.epub?.isAvailable,
    pdf_available: accessInfo.pdf?.isAvailable,
    web_reader_link: accessInfo.webReaderLink,
    access_view_status: accessInfo.accessViewStatus,
    quote_sharing_allowed: accessInfo.quoteSharingAllowed
  };

  const { data, error } = await supabase
    .from('books')
    .upsert(bookData, { onConflict: 'google_books_id' })
    .single();

  if (error) {
    console.error('Error importing book:', error);
    return null;
  }

  return data;
}

export { importBookFromGoogleAPI };