import React, { useState, useEffect } from "react";
import { YabrHeader } from "./components/YabrHeader";
import { YabrFooter } from "./components/YabrFooter";

const TermsAndConditionsPage = () => {
  return (
    <div className="bg-white dark:bg-gray-900">
      <YabrHeader />

      <section className="bg-white dark:bg-gray-900 shadow-md">
        <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md text-left">
          <h1 className="text-3xl font-bold mb-4">Terms and Conditions</h1>
          <p className="text-sm text-gray-500 mb-6">Last updated: [Date]</p>

          <ul className="space-y-6">
            <li>
              <h2 className="text-xl font-semibold mb-2">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing and using this website, you accept and agree to be
                bound by these Terms and Conditions.
              </p>
            </li>

            <li>
              <h2 className="text-xl font-semibold mb-2">2. User Accounts</h2>
              <p>
                You are responsible for maintaining the confidentiality of your
                account and password. You agree to accept responsibility for all
                activities that occur under your account.
              </p>
            </li>

            <li>
              <h2 className="text-xl font-semibold mb-2">3. Content</h2>
              <p>
                Users are responsible for the content they post. We reserve the
                right to remove any content that violates these terms or is
                otherwise objectionable.
              </p>
            </li>

            <li>
              <h2 className="text-xl font-semibold mb-2">
                4. Intellectual Property
              </h2>
              <p>
                The content on this website, except for user-generated content,
                is owned by us and is protected by copyright and other
                intellectual property laws.
              </p>
            </li>

            <li>
              <h2 className="text-xl font-semibold mb-2">
                5. Limitation of Liability
              </h2>
              <p>
                We are not liable for any damages arising from your use of, or
                inability to use, this website.
              </p>
            </li>

            <li>
              <h2 className="text-xl font-semibold mb-2">
                6. Changes to Terms
              </h2>
              <p>
                We reserve the right to modify these terms at any time. Your
                continued use of the website after changes are posted
                constitutes your acceptance of the modified terms.
              </p>
            </li>

            <li>
              <h2 className="text-xl font-semibold mb-2">7. Governing Law</h2>
              <p>
                These terms are governed by and construed in accordance with the
                laws of [Your Jurisdiction].
              </p>
            </li>
          </ul>
        </div>
      </section>

      <YabrFooter />
    </div>
  );
};

export default TermsAndConditionsPage;
