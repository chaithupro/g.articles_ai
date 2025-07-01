'use client';

import { X } from 'lucide-react';
import GenerateArticleForm from './GenerateArticleForm';

interface GenerateArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GenerateArticleModal({ isOpen, onClose }: GenerateArticleModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        <div className="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span className="sr-only">Close</span>
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Generate Article with AI
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Enter a topic and our AI will generate a complete article for you.
                </p>
              </div>
              <div className="mt-4">
                <GenerateArticleForm onClose={onClose} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 