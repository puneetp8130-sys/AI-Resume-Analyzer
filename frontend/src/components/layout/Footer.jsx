import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-6 text-center text-xs text-gray-400 sm:px-6">
        © {new Date().getFullYear()} AI Resume Analyzer. ATS scores are an evaluation aid, not a guarantee of job selection.
      </div>
    </footer>
  );
}
