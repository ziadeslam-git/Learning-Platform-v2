import { Routes, Route } from 'react-router-dom';
import { LandingPage } from './features/landing';
import { AboutPlatform } from './pages/AboutPlatform';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPlatform />} />
    </Routes>
  );
}

export default App;
