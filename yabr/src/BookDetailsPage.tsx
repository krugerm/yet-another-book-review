import React, { useState, useEffect } from 'react';
import { YabrHeader } from './components/YabrHeader';
import { YabrFooter } from './components/YabrFooter';


const BookDetailsPage = () => {

  return (
    <div className="bg-white dark:bg-gray-900">

      <YabrHeader />


      <YabrFooter />
    </div>
  );
};

export default BookDetailsPage;