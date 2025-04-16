import React from 'react';

export default function ProfileAbout({ about }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-[#002B5B] mb-4">About</h2>
      <p className="text-[#002B5B]/80 whitespace-pre-wrap">{about}</p>
      
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-medium text-[#002B5B] mb-4">Contact Information</h3>
        <div className="space-y-3">
          <div className="flex items-center text-[#002B5B]/80">
            <span className="material-icons text-lg mr-2">email</span>
            <span>Available upon request</span>
          </div>
          <div className="flex items-center text-[#002B5B]/80">
            <span className="material-icons text-lg mr-2">phone</span>
            <span>Available upon request</span>
          </div>
        </div>
      </div>
    </div>
  );
} 