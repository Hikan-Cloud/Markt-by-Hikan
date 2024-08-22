import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import HomePage from './components/HomePage';
import CatalogPage from './components/CatalogPage';
import ProductPage from './components/ProductPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<HomePage />}></Route>
          <Route path='/CatalogPage/:value' element={<CatalogPage />}></Route>
          <Route path='/ProductPage/:productSlug' element={<ProductPage />}></Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;