import { useState } from 'react';
import Landing    from './pages/Landing.jsx';
import SignIn     from './pages/SignIn.jsx';
import Dashboard  from './pages/Dashboard.jsx';
import Upload     from './pages/Upload.jsx';
import Analysis   from './pages/Analysis.jsx';
import Forecast   from './pages/Forecast.jsx';
import Recommend  from './pages/Recommend.jsx';

export default function App() {
  const [page, setPage] = useState('landing');

  const props = { page, setPage };

  switch (page) {
    case 'landing':   return <Landing   setPage={setPage} />;
    case 'signin':    return <SignIn     setPage={setPage} />;
    case 'dashboard': return <Dashboard  {...props} />;
    case 'upload':    return <Upload     {...props} />;
    case 'analysis':  return <Analysis   {...props} />;
    case 'forecast':  return <Forecast   {...props} />;
    case 'recommend': return <Recommend  {...props} />;
    default:          return <Landing   setPage={setPage} />;
  }
}
