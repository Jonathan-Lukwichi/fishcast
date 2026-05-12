import { useState } from 'react';
import Landing from './pages/Landing.jsx';
import SignIn from './pages/SignIn.jsx';
import Upload from './pages/Upload.jsx';
import Analysis from './pages/Analysis.jsx';
import Forecast from './pages/Forecast.jsx';
import Recommend from './pages/Recommend.jsx';

export default function App() {
  const [page, setPage] = useState('signin');

  if (page === 'signin') return <SignIn setPage={setPage} />;

  if (page === 'landing') return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
      <Landing setPage={setPage} />
    </div>
  );

  if (page === 'upload')   return <Upload   page={page} setPage={setPage} />;
  if (page === 'analysis') return <Analysis page={page} setPage={setPage} />;
  if (page === 'forecast') return <Forecast page={page} setPage={setPage} />;
  if (page === 'recommend') return <Recommend page={page} setPage={setPage} />;

  return null;
}
