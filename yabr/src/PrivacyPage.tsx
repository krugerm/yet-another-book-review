import React, { useState, useEffect } from "react";
import { YabrHeader } from "./components/YabrHeader";
import { YabrFooter } from "./components/YabrFooter";

const PrivacyPage = () => {
  return (
    <div className="bg-white dark:bg-gray-900">
      <YabrHeader />

      <section className="bg-white dark:bg-gray-900 shadow-md">
              
        <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md text-left">
          <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mb-6">Last updated: [Date]</p>

          <ul className="space-y-6">
            <li>
              <h2 className="text-xl font-semibold mb-2">
                1. Information We Collect
              </h2>
              <p>
                We collect information you provide directly to us, such as when
                you create an account, submit a book review, or contact us for
                support.
              </p>
            </li>

            <li>
              <h2 className="text-xl font-semibold mb-2">
                2. How We Use Your Information
              </h2>
              <p>
                We use the information we collect to operate and improve our
                website, personalize your experience, and communicate with you.
              </p>
            </li>

            <li>
              <h2 className="text-xl font-semibold mb-2">
                3. Information Sharing and Disclosure
              </h2>
              <p>
                We do not sell or share your personal information with third
                parties.
              </p>
            </li>

            <li>
              <h2 className="text-xl font-semibold mb-2">4. Data Security</h2>
              <p>
                We take reasonable measures to help protect your personal
                information from loss, theft, misuse, and unauthorized access.
              </p>
            </li>

            <li>
              <h2 className="text-xl font-semibold mb-2">
                5. Changes to This Policy
              </h2>
              <p>
                We may update this privacy policy from time to time. We will
                notify you of any changes by posting the new policy on this
                page.
              </p>
            </li>

            <li>
              <h2 className="text-xl font-semibold mb-2">6. Contact Us</h2>
              <p>
                If you have any questions about this privacy policy, please
                contact us here: <a href="/contact">Contact Us</a>.
              </p>
            </li>
          </ul>
        </div>
      </section>

      <YabrFooter />
    </div>
  );
};

export default PrivacyPage;
