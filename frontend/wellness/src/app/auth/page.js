
import React, { Suspense } from 'react';
import AuthScreen from '../../components/auth/AuthScreen'; // Move it here

export default function Page() {
  return (
    <Suspense>
      <AuthScreen />
    </Suspense>
  );
}
