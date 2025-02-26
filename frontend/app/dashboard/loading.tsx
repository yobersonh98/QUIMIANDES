import Loader from '@/components/shared/lodaer';
import React from 'react';

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <Loader />
    </div>
  );
}