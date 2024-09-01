import { useState, useEffect } from "react";
import "./App.css";
import { supabase } from "./supabaseClient";
import Auth from "./Auth";
import Account from "./Account";
import { iBook } from "./types";

function App() {
  const [count, setCount] = useState(0);
  const [session, setSession] = useState(null);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    getBooks();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    async function getBooks() {
      const { data, error } = await supabase.from<iBook>("books").select();

      if (error) {
        console.error("Error fetching books:", error.message);
        return [];
      }

      setBooks(data);
    }
  }, []);

  return (
    <>
      <h1>Yet Another Book Review demo</h1>

      <div className="container" style={{ padding: "50px 0 100px 0" }}>
        {!session ? (
          <Auth />
        ) : (
          <Account key={session.user.id} session={session} />
        )}
      </div>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>

      <ul>
        {books.map((book) => (
          <li key={book.title}>{book.title}</li>
        ))}
      </ul>
    </>
  );
}

export default App;
