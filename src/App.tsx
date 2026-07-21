import { Routes, Route, Outlet } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

// Layout component to wrap pages with Header and Footer
function BaseLayout() {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

// Temporary Home placeholder
function Home() {
  return (
    <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
      <h1>Página Inicial em construção</h1>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<BaseLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* We will add more routes here in future phases */}
      </Route>
    </Routes>
  );
}
