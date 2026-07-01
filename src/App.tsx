import { Routes, Route } from 'react-router-dom';
import { LandingPage } from './features/landing';
import { AboutPlatform } from './pages/AboutPlatform';
import { ModulePage } from './pages/ModulePage';
import { AssessmentPage } from './pages/AssessmentPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPlatform />} />
      <Route path="/module/:id" element={<ModulePage />} />
      <Route path="/assessment/:type" element={<AssessmentPage />} />
    </Routes>
  );
}

export default App;
