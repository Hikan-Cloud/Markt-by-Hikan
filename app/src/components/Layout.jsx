import React, { useState, useEffect } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useNavigate, Outlet } from 'react-router-dom';

// Seach bar icons
import searchIcon from '../imagesVideos/headerIcons/searchbarIcons/searchIcon.svg';
import cartIcon from '../imagesVideos/headerIcons/searchbarIcons/cartIcon.svg';
import favoritesIcon from '../imagesVideos/headerIcons/searchbarIcons/favoritesIcon.svg';
import accountIcon from '../imagesVideos/headerIcons/searchbarIcons/accountIcon.svg';
import cencelIcon from '../imagesVideos/headerIcons/searchbarIcons/cencelIcon.svg';

// Logo
import logo from '../imagesVideos/logo/logo.svg';

import unfavoritedIcon from '../imagesVideos/cardIcons/unfavorited.png';
import favoritedIcon from '../imagesVideos/cardIcons/favorited.png';

import shopPayIcon from '../imagesVideos/bottomIcons/shopPayIcon.svg';
import instagramIcon from '../imagesVideos/bottomIcons/instagramIcon.svg';
import telegramIcon from '../imagesVideos/bottomIcons/telegramIcon.svg';

//------------------------------------------------------------------------------------------------------------------------------------------------------------------


// Main Fetching Url

const baseUrl = process.env.REACT_APP_BASE_URL;

//

const Layout = () => {
  const navigate = useNavigate();

// Selected Language That Stores In Local Storage And Gets It In Every Its Change  

  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    const savedSelectedLanguage = window.localStorage.getItem('selectedLanguage');
    return savedSelectedLanguage ? JSON.parse(savedSelectedLanguage) : 'en';
  });

  useEffect(() => {
    window.localStorage.setItem('selectedLanguage', JSON.stringify(selectedLanguage));
  }, [selectedLanguage]);

// Language Seletction Options

  const languages = [
    {name: 'English', short: 'en'},
    {name: 'O`zbek', short: 'uz'},
  ];

// Fetched Currency usd/rub/uzs

  const [currency, setCurrency] = useState([]);

  const [hamburgerIsOpen, setHamburgerIsOpen] = useState(false);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [searchBarInputIsOpen, setSearchBarInputIsOpen] = useState(false);
  const [openedSearchBarInput, setOpenedSearchBarInput] = useState('');
  const [electronicsCategoryIsOpen, setElectronicsCategoryIsOpen] = useState(false);

// Fetched Electronics Category Items 

  const [electronicsCategoryItems, setEletronicsCategoryItems] = useState([]);

// Fetched Random products On Category Menu

  const [randomProducts, setRandomProducts] = useState([]);

// Footer Fetched Items

  const [footerItems, setFooterItems] = useState({});

// Shadow------------------------------------------------------------------------------------------------------------------------------------------------------------

  const handleBlackShadow = () => {
    if (menuIsOpen) { setMenuIsOpen(handleMenuOpening())}
    else if (searchBarInputIsOpen) {setSearchBarInputIsOpen(!searchBarInputIsOpen)}
    else if (electronicsCategoryIsOpen) {setElectronicsCategoryIsOpen(!electronicsCategoryIsOpen)}
  };

  const shadowIsOpen = () => {
    if (menuIsOpen || searchBarInputIsOpen || electronicsCategoryIsOpen) {
      return <div className='fixed bg-slate-800/50 h-full w-full z-10' onClick={() => handleBlackShadow()}></div>
    };
  };

// Annimations------------------------------------------------------------------------------------------------------------------------------------------------------
  
  const handleMouseEnter = (index) => {
    const updatedRandomProducts = [...randomProducts];
    updatedRandomProducts[index].hovered = true;
    setRandomProducts(updatedRandomProducts);
  };

  const handleMouseLeave = (index) => {
    const updatedRandomProducts = [...randomProducts];
    updatedRandomProducts[index].hovered = false;
    setRandomProducts(updatedRandomProducts);
  };

  const handleFavoriteClick = (index) => {
    const updatedRandomProducts = [...randomProducts];
    updatedRandomProducts[index].favorited = !updatedRandomProducts[index].favorited;
    setRandomProducts(updatedRandomProducts);
  };

      
// Pop Up Menus-----------------------------------------------------------------------------------------------------------------------------------------------------

  const handleHamburgerClick = () => {
    setHamburgerIsOpen(!hamburgerIsOpen);
  };

  const handleMenuOpening = () => {
    setMenuIsOpen(!menuIsOpen);
    setElectronicsCategoryIsOpen(false)
    handleHamburgerClick();
  };

  const handleSearchClick = () => {
    setSearchBarInputIsOpen(!searchBarInputIsOpen);
    setMenuIsOpen(false);
    setElectronicsCategoryIsOpen(false);
  };

  const handleCencelIconClick = () => {
    setSearchBarInputIsOpen(false);
    setOpenedSearchBarInput('');
  };

  const handleElecronicsClick = () => {
    setElectronicsCategoryIsOpen(!electronicsCategoryIsOpen);
    setMenuIsOpen(false); 
  };

// All FEtchings-----------------------------------------------------------------------------------------------------------------------------------------------------

  useEffect(() => {
    const fetchCurrency = async () => {
      const url = `${baseUrl}/currency_list`;
      
      try {
        const response = await fetch(url);
        const data = await response.json();
        setCurrency(data);
      } catch (error) {
        console.error(error);
      };
    };
      
    const fetchHeader = async () => {
      const url = `${baseUrl}/header`;
        
      try {
        const response = await fetch(url, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application-json',
          'Accept-Language': `${selectedLanguage}`,
        },
        });
        const data = await response.json();
        setEletronicsCategoryItems(data);
      } catch (error) {
        console.error(error);
      };
    };
      
    const fetchRandomProducts = async () => {
      const url = `${baseUrl}/products/random`;
                
      try {
        const response = await fetch(url);
        const data = await response.json();
        setRandomProducts(data.data.map((elem) => (
          {
            main: elem,
            hovered: false,
            favorited: false,
          }
        )))
      } catch (err) {
        console.error(err);
      };
    };

    const fetchFooter = async () => {
      const url = `${baseUrl}/footer`;
    
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            'Accept-Language': `${''}`,
        },
        });
        const data = await response.json();
        setFooterItems(data);
      } catch (error) {
        console.error(error);
      };
    };
  
    fetchCurrency();
    fetchHeader();
    fetchRandomProducts();
    fetchFooter();
  }, [selectedLanguage]);

// Going to Catalog With Some Value On Its Param

  const goToCatalog = (elem) => {
    navigate(`/CatalogPage/${elem}`)
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
      goToCatalog(e.target.value);
    }
  };


  return (
    <>
      <header className='w-full fixed top-0 z-20 bg-white'>
        <div className='border-b-gray-300 border-b-2'>
          <div id="topLair" className='flex items-center justify-center text-sm relative bg-neutral-800 text-white px-9 py-1'>
            <span className='w-full text-start'>{currency.USD} USD is {currency.RUB} RUB or {currency.UZS} UZS now</span>
            <span className='text-center absolute'>Any case. Any band. Any style you want.</span>
          <div className='w-full flex justify-end'>
            <select className='outline-none bg-neutral-800' value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
              {languages.map((elem, i) => ((
                <option key={i} value={elem.short}>{elem.name}</option>
              )))}
            </select>
          </div>
        </div>
        {searchBarInputIsOpen ? <div className='w-full flex justify-center' style={{ height: '600px' }}>
          <div className='flex flex-col w-2/4 pt-6'>
            <div className='flex w-full border-b-2 border-b-slate-300 p-2'>
              <input 
                value={openedSearchBarInput}
                onChange={(e) => setOpenedSearchBarInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className='outline-none pl-3 w-full'
              />
              {/* onClick={(e) => goToCatalog(openedSearchBarInput)} */}
              <img src={cencelIcon}
                onClick={() => handleCencelIconClick()}
                className='h-4 w-4 cursor-pointer'
              />
              </div>
              <span>Popular Searchings</span>
              <span>Resent Searched</span>
              <span>Frequent Products</span>
            </div>
          </div> : <div id='navBar' className='px-9 py-3 flex items-center justify-center'>
            <div className='flex items-center justify-between w-full'>
              <div id='categories' className='flex items-center justify-start h-full pl-3 relative gap-3' style={{width: '500px'}}>
                <svg id="hamburger" className="Header__toggle-svg" viewBox="0 0 60 40" onClick={() => handleMenuOpening()}>
                  <g className="lines" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <path
                      id="top-line"
                      className={hamburgerIsOpen ? 'top-line-open' : 'top-line-close'}
                      d="M10,10 L50,10 Z"
                    ></path>
                    <path
                      id="middle-line"
                      className={hamburgerIsOpen ? 'middle-line-open' : 'middle-line-close'}
                      d="M10,20 L50,20 Z"
                    ></path>
                    <path
                      id="bottom-line"
                      className={hamburgerIsOpen ? 'bottom-line-open' : 'bottom-line-close'}
                      d="M10,30 L50,30 Z"
                    ></path>
                  </g>
                </svg>
                <span className='hover:text-blue-800 cursor-pointer h-full border-b-2 border-transparent hover:border-b-blue-800 text-center'>New</span>
                <span className='hover:text-blue-800 cursor-pointer h-full border-b-2 border-transparent hover:border-b-blue-800 text-center' onClick={handleElecronicsClick}>Electronics</span>
                <span className='hover:text-blue-800 cursor-pointer h-full border-b-2 border-transparent hover:border-b-blue-800 text-center'>Appliances</span>
                <span className='hover:text-blue-800 cursor-pointer h-full border-b-2 border-transparent hover:border-b-blue-800 text-center'>Sale*</span>
              </div>
              <div id='searchBar' className='w-96 h-full flex justify-end items-center'>
                <div className='flex items-center mr-10 cursor-pointer' onClick={() => handleSearchClick()}><img src={searchIcon} className='mr-2'/>Search</div>
                  <img className='mr-2 cursor-pointer' src={cartIcon}/>
                  <img className='mr-2 cursor-pointer' src={favoritesIcon}/>
                  <img className='mr-2 cursor-pointer' src={accountIcon}/>
                </div>
              </div>
              <img className='cursor-pointer absolute' src={logo} onClick={() => navigate('/')}/>
            </div>}
          </div>
          {menuIsOpen ? <div className='bg-white h-60 px-12 flex'>
            <div className='w-96 border-r-2 border-r-gray-300 h-full pt-6 pl-16'>
              <span className='text-blue-800 text-xl'>Menu</span>
            </div>
            <div className='w-full flex flex-col items-start justify-around py-6 pl-6 text-base'>
              <span className='hover:text-blue-800 hover:underline cursor-pointer'>About us</span>
              <span className='hover:text-blue-800 hover:underline cursor-pointer'>Account</span>
              <span className='hover:text-blue-800 hover:underline cursor-pointer'>Orders</span>
              <span className='hover:text-blue-800 hover:underline cursor-pointer'>Privacy Policy</span>
              <span className='hover:text-blue-800 hover:underline cursor-pointer'>Terms & Conditions</span>
            </div>
            </div> : ''}
            {electronicsCategoryIsOpen ? <div className='bg-white h-96 px-12 flex'>
            <ul className='w-96 border-r-2 border-r-gray-300 h-full pt-6 pl-16 flex flex-col gap-7'>
              <span className='text-blue-800 text-2xl underline'>All Electronics</span>
              {electronicsCategoryItems.map((elem, i) => ((
                <li key={i} className='hover:text-blue-800 hover:underline cursor-pointer'>{elem.slug.charAt(0).toUpperCase() + elem.slug.split('-').join(' ').slice(1)}</li>
              )))}
            </ul>
            <div className='w-full flex items-center justify-around py-6 pl-6 text-base'>
                {randomProducts.map((elem, i) => (
                  <li
                  key={i}
                  onMouseEnter={() => handleMouseEnter(i)}
                  onMouseLeave={() => handleMouseLeave(i)}
                  className='flex flex-col items-around overflow-hidden'
                  style={{ height: '100%', width: '270px', }}
                >
                <div className="flex flex-col items-center justify-end h-full relative">
                {elem.hovered ? <img
                    className='h-4 w-4 absolute top-5 right-5 duration-300 z-10'
                    src={elem.favorited ? favoritedIcon : unfavoritedIcon}
                    onClick={() => handleFavoriteClick(i)}
                  /> : ''}
                <LazyLoadImage 
                  id='cardImg'
                  className={`duration-200 absolute ${elem.hovered ? 'top-10' : 'top-16'}`}
                  style={{ height: elem.hovered ? '160px' : '150px', width: elem.hovered ? '160px' : '150px'}}
                  src={elem.main.thumbnail} 
                />
                <div className='w-full flex flex-col justify-between'>
                <span className='text-sm text-blue-800 w-full pl-4'>{elem.main.brand.slug.charAt(0).toUpperCase() + elem.main.brand.slug.slice(1)}</span>
                <div className='text-sm flex justify-between items-center w-full px-4 pb-2'>
                <span>{elem.main.slug.charAt(0).toUpperCase() + elem.main.slug.split('-').join(' ').slice(1)}</span>
                <span>{elem.main.price}</span>
                </div>
                </div>
                </div>
                <button className={`w-full h-20 text-center text-white bg-blue-800 tag ${elem.hovered ? 'show' : ''}`}>
                  + Add to cart
                </button>
              </li>
            ))}
          </div>
        </div> : ''}
      </header>
      {shadowIsOpen()}
      <Outlet />
      <footer className='flex justify-between px-9 w-full pt-20 border-t-gray-300 border-t-2' style={{ height: '500px' }}>
        <div id='leftSide' className='w-1/3 flex flex-col items-start justify-between h-full p-6'>
          <img src={logo} alt="Logo" />
          <span className='pl-4'>©2024 Markt store</span>
        </div>
        <div id='rightSide' className='w-full flex justify-between h-full pr-72'>
          <div className='flex flex-col items-start w-1/3 p-12 relative'>
            <div className='flex flex-col gap-4'>
              <span className='text-blue-800'>
                {footerItems?.line_1?.[0]?.slug.charAt(0).toUpperCase() + footerItems?.line_1?.[0]?.slug.slice(1).split('-').join(' ') || ''}*
              </span>
              <span>
                {footerItems?.line_1?.[1]?.slug.charAt(0).toUpperCase() + footerItems?.line_1?.[1]?.slug.slice(1).split('-').join(' ') || ''}
              </span>
              <span>
                {footerItems?.line_1?.[2]?.slug.charAt(0).toUpperCase() + footerItems?.line_1?.[2]?.slug.slice(1).split('-').join(' ') || ''}
              </span>
              <img className='absolute bottom-0 left-2' src={shopPayIcon} alt="Shop Pay" />
            </div>
          </div>
          <div className='flex flex-col items-start w-1/3 p-12'>
            <div className='flex flex-col'>
              <span>{footerItems?.line_2?.[0]?.slug || ''}</span>
              <span>{footerItems?.line_2?.[1]?.slug || ''}</span>
              <span>{footerItems?.line_2?.[2]?.slug || ''}</span>
            </div>
          </div>
          <div className='flex flex-col items-start w-1/3 p-12 relative'>
            <div className='flex flex-col'>
              <span>Terms & Condition</span>
              <span>Privacy Policy</span>
              <div className='flex justify-center items-center absolute bottom-10 left-13'>
                <img className='mr-2' src={telegramIcon} alt="Telegram" />
                <img src={instagramIcon} alt="Instagram" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Layout;