
import React, { Suspense } from 'react';
import AuthScreen from '../../components/AuthScreen'; // Move it here

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthScreen />
    </Suspense>
  );
}
