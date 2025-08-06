import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function Home() {
  const [lawns, setLawns] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/lawns')
      .then((res) => res.json())
      .then((data) => setLawns(data));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Yardly</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to{' '}
          <a className="text-blue-600" href="https://nextjs.org">
            Yardly!
          </a>
        </h1>

        <div className="mt-10">
          <h2 className="text-2xl font-bold">Lawns</h2>
          <ul>
            {lawns.map((lawn) => (
              <li key={lawn.id}>{lawn.name}</li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  )
}
