import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPage from "./pages/PrivacyPage";
import AccountPage from "./pages/AccountPage";
import BookDetailsPage from "./pages/BookDetailsPage";
import LoginPage from "./pages/LoginPage";
import AuthPage from "./pages/AuthPage";
import RegisterPage from "./pages/RegisterPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import TermsAndConditionsPage from "./pages/TermsAndConditionsPage";
import { UserProvider } from "./contexts/UserContext";
import CreateBookReviewPage from "./pages/CreateBookReviewPage";
import { AlertProvider } from './contexts/AlertContext';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from "@vercel/analytics/react"

const App: React.FC = () => {
  return (
    <AlertProvider>
      <UserProvider>
        <SpeedInsights />
        <Analytics />
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search/:initSearchTerm?" element={<SearchPage />} />
            <Route path="/book/:google_books_id" element={<BookDetailsPage />} />
            <Route path="/create-book-review/:google_books_id?" element={<CreateBookReviewPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/login/:next?" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/resetPassword" element={<ResetPasswordPage />} />
            <Route path="/forgotPassword" element={<ForgotPasswordPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/terms" element={<TermsAndConditionsPage />} />
          </Routes>
        </Router>
      </UserProvider>
    </AlertProvider>
  );
};

export default App;