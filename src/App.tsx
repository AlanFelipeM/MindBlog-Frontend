import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>MindBlog - Em breve</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
