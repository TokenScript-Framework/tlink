import Link from 'next/link'
import React from 'react'

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/"
        className="text-blue-600 hover:underline mb-4 inline-block"
      >
        &larr; Back to Home
      </Link>

      <h1 className="text-3xl font-bold mb-6">Privacy Policy for Tlink</h1>
      <p className="mb-4">Last updated: September 10, 2024</p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">1. Introduction</h2>
      <p className="mb-4">
        Tlink is a chrome extension that allows you to use TokenScript in your
        browser. It detects links in tweets and changes the TokenScript Viewer
        link to the Tlink card.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">2. Data Collection</h2>
      <p className="mb-4">
        Tlink does not collect any user data or non-personal data.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">3. Data Sharing</h2>
      <p className="mb-4">We do not share any data with third parties.</p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">
        4. Children&apos;s Privacy
      </h2>
      <p className="mb-4">Tlink does not collect any data from children.</p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">
        5. Contact Information
      </h2>
      <p className="mb-4">
        For any questions or concerns regarding this privacy policy, please
        contact us at: tantan@smarttokenlabs.com
      </p>
    </div>
  )
}

export default PrivacyPolicy
