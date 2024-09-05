// Function to search books using the Google Books API
async function searchBooks(query) {
  const apiKey = "YOUR_GOOGLE_BOOKS_API_KEY"; // Replace with your API key
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
    query
  )}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.items; // Return the array of book items
  } catch (error) {
    console.error("Error fetching data from Google Books API:", error);
  }
}

// Example usage
searchBooks("car sales").then((books) => {
  if (books) {
    console.log(JSON.stringify(books));
    //   books.forEach((book, index) => {
    //     console.log(`${index + 1}. ${book.volumeInfo.title} by ${book.volumeInfo.authors?.join(', ')}`);
    //   });
  } else {
    console.log("No books found.");
  }
});
