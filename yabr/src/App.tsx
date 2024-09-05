import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import SearchPage from "./SearchPage";
import AboutPage from "./AboutPage";
import ContactPage from "./ContactPage";
import PrivacyPage from "./PrivacyPage";
import AccountPage from "./AccountPage";
import BookDetailsPage from "./BookDetailsPage";
import LoginPage from "./LoginPage";
import AuthPage from "./AuthPage";
import RegisterPage from "./RegisterPage";
import ResetPasswordPage from "./ResetPasswordPage";
import ForgotPasswordPage from "./ForgotPasswordPage";
import TermsAndConditionsPage from "./TermsAndConditionsPage";
import { UserProvider } from "./UserContext";

const App: React.FC = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/book/:id" element={<BookDetailsPage />} />
          {/* <Route path="/create-book-review" element={<CreateBookReviewPage />} /> */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/resetPassword" element={<ResetPasswordPage />} />
          <Route path="/forgotPassword" element={<ForgotPasswordPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/terms" element={<TermsAndConditionsPage />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;