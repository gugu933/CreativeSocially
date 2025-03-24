import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Cart from './components/Cart';
import Layout from './components/layout/Layout.jsx';
import Home from './pages/Home.jsx';
import Products from './pages/Products.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Models from './pages/Models.jsx';
import BecomeModel from './pages/BecomeModel.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Signin from './pages/Signin.jsx';

function App() {
  return (
    <Router>
      <CartProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id*" element={<ProductDetail />} />
            <Route path="/models" element={<Models />} />
            <Route path="/become-model" element={<BecomeModel />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/signin" element={<Signin />} />
          </Routes>
        </Layout>
        <Cart />
      </CartProvider>
    </Router>
  );
}

export default App; 