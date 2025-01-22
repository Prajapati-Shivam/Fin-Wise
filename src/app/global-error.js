'use client';

import { useEffect } from 'react';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <h2 className='text-4xl font-bold'>Something went wrong!</h2>
        <button
          onClick={() => reset()}
          className='mt-4 px-4 py-2 bg-blue-500 text-white rounded-md'
        >
          Try again
        </button>
      </body>
    </html>
  );
}
