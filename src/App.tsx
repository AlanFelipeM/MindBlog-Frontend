import { Routes, Route, Outlet } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Home } from './pages/Home';
import { ArticleDetail } from './pages/ArticleDetail';
import { Articles } from './pages/Articles';
import { Settings } from './pages/Settings';

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

export default function App() {
  return (
    <Routes>
      <Route element={<BaseLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/artigos" element={<Articles />} />
        <Route path="/artigos/:id" element={<ArticleDetail />} />
        <Route path="/configuracoes" element={<Settings />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* We will add more routes here in future phases */}
      </Route>
    </Routes>
  );
}
