import React from 'react';

function ErrorPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-2xl">
        {/* Illustration or Logo */}
        <svg
          className="w-32 h-32 mx-auto mb-8 text-[#EFB63C]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>

        {/* Title */}
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>

        {/* Subtitle */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Oops! Page Not Found
        </h2>

        {/* Description */}
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved. Please
          check the URL or go back to the homepage.
        </p>

        {/* Back to Home Button */}
        <a
          href="/"
          className="inline-block bg-[#EFB63C] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#DAA53A] transition duration-300"
        >
          Go Back Home
        </a>
      </div>
    </div>
  );
}

export default ErrorPage;