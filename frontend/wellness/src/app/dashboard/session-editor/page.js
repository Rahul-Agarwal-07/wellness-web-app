import SessionEditor from '@/components/session-editor/SessionEditor';
import React, { Suspense } from 'react';


export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SessionEditor />
    </Suspense>
  );
}
