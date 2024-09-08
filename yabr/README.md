# Yet Another Book Review (YABR)

## 1. Introduction

Yet Another Book Review (YABR) is a web application that allows users to search for books, read and write reviews, and manage their personal book collections. Built to demonstrate how to build a simple site using Node + React + Supabase + Tailwind/Flowbite in 16 hrs, YABR provides a seamless experience for book enthusiasts to share their thoughts and discover new reads.  YABR still has lots of room for improvement, so contributors are welcome!

## 2. Features

- User authentication and profile management
- Book search powered by Google Books API
- Detailed book information display
- User-generated book reviews
- Rating system for books
- AI-generated reviews for supplementary content
- Responsive design for various screen sizes

## 3. Assumptions and Limitations

YABR has the following assumptions and limitations:

1. Google Books API Dependency:
   - The application relies on the Google Books API for book data. Any changes or downtime in this API may affect the functionality of YABR.
   - We assume the Google Books API data is accurate and up-to-date.
   - If the book isn't in Google Books API, it doesn't exist!  ie: The user can't create a review for it.

2. User Authentication:
   - The current implementation assumes email/password authentication through Supabase.
   - Social login options are not currently supported, but could be easily enabled.

3. Book Coverage:
   - The availability and completeness of book information depend on what's available in the Google Books database.
   - Some niche or very recent publications might have limited information.

4. Review System:
   - The review system assumes one review per user per book.
   - There's no built-in moderation system for reviews, which could potentially allow for spam or inappropriate content.

5. AI-Generated Reviews:
   - To generate content, YABR has a feature to use AI to generate "reviews" for books.
   - The AI-generated reviews are for supplementary content only and should not be considered as genuine user reviews.
   - The quality and appropriateness of AI-generated content may vary.

6. Performance:
   - The current implementation may experience performance issues with a very large number of reviews or simultaneous users.

7. Mobile Responsiveness:
   - While efforts have been made to ensure mobile responsiveness, the user experience may vary across different devices and screen sizes.

8. Internationalization:
   - The application currently supports English language only. Multi-language support is not implemented.

9. Data Persistence:
   - We assume Supabase will handle data persistence reliably. Local caching mechanisms are not implemented.

10. Browser Compatibility:
    - The application is primarily tested on modern browsers (Chrome, Firefox, Safari). Compatibility with older browser versions is not guaranteed.

11. Scalability:
    - The current architecture may need adjustments to handle a very large user base or high traffic volumes.

12. Legal Compliance:
    - Users are responsible for the content they post. The application does not currently have built-in mechanisms to ensure compliance with various international copyright laws or content regulations.

These assumptions and limitations represent areas where the project could potentially be improved or expanded in the future. Contributions addressing any of these points are welcome!

## 4. Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository & install deps:

   ```bash
   git clone https://github.com/krugerm/yet-another-book-review.git
   cd yabr
   npm install
   ```

2. Set up environment variables:
   Create a `.env` file in the root directory and add the following:

   ```txt
    REACT_APP_SUPABASE_URL=your_supabase_url
    REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   
    VITE_GOOGLE_BOOKS_API_KEY=AIzaSyDh3bHEZOFZu3kDnZwlasdf7
    VITE_OPENAI_API_KEY=sk-proj-s0gasdfhjHB86FC2T20tF_7JNEUoks-pska0Erlsadf

    TEST_USERNAME=supabase-registeed-user@yourdomain.com
    TEST_PASSWORD=SomePassword!
   ```

3. Setup Supabase CLI

   The Supabase CLI helps you develop, version-control, and deploy your Supabase project.

   Install the Supabase CLI, login, init, and link your local project to your Supabase project:
   (You can find your project ref in the Supabase dashboard under Project Settings > General.)

      ```bash
      npm install -g supabase
      supabase login
      supabase init
      supabase link --project-ref your-project-ref
      ```

   To pull the current database schema:

      ```bash
      supabase db pull
      ```

   To make changes to your database, create a new migration:

      ```bash
      supabase migration new your_migration_name
      ```

   Apply migrations to your local database:

      ```bash
      supabase db push
      ```

   When ready, deploy your changes to production:

      ```bash
      supabase db push --db-url your_production_db_url
      ```

   For more detailed information on using the Supabase CLI, refer to the [official Supabase CLI documentation](https://supabase.com/docs/guides/cli).

4. Start the development server:

   ```bash
   npm run dev
   ```

## 5. Usage

- Navigate to `http://localhost:3000` in your browser
- Sign up or log in to your account
- Search for existing book reviews
- Click on a book to view details and reviews
- Write your own reviews for books you've read

## 6. Project Structure

- `/public`: Static assets
- `/src`: Source code
  - `/components`: React components
  - `/pages`: Pages
  - `/contexts`: React contexts
  - `/utils`: Utility functions
  - `/types`: TypeScript type definitions
- `/supabase`: Supabase project linked environment - migrations / seed
- `/tests`: Automated tests

## 7. Testing

We use Jest + Puppeteer for end-to-end testing. To run the tests:

```bash
npm run test
```

## 8. Contributing

We welcome contributions to YABR! Please follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b feature-branch-name`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-branch-name`
5. Submit a pull request

## 9. License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
