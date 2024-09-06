import React from 'react';
import { useTranslation } from 'react-i18next';

export function GuidedTour({ onClose }) {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-md">
        <h2 className="text-2xl font-bold mb-4">{t('Welcome to Book Review Creation!')}</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>{t('Search for a book using the search bar')}</li>
          <li>{t('Select a book from the search results')}</li>
          <li>{t('Rate the book and write your review')}</li>
          <li>{t('Submit your review')}</li>
        </ol>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          {t('Got it!')}
        </button>
      </div>
    </div>
  );
}
