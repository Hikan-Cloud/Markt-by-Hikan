import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

//Page components
import HomePage from './components/mainComponents/HomePage';
import CatalogPage from './components/mainComponents/CatalogPage';

//Tool components
import Header from './components/toolComponents/HeaderComponet';
import Footer from './components/toolComponents/FooterComponent';


function App() {
  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<HomePage />}></Route>
        <Route path='/CatalogPage/:value' element={<CatalogPage />}></Route>
      </Routes>
    </Router>
  );
};

export default App;