import React, { Suspense } from 'react';
import WellnessDashboard from '../../components/dashboard/Dashboard';

export default function Page() {
  return (
    <Suspense>
      <WellnessDashboard />
    </Suspense>
  );
}
