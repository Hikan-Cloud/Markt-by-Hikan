  import '../../App.css';
  import React, { useState, useEffect } from 'react';
  import { LazyLoadComponent, LazyLoadImage } from 'react-lazy-load-image-component';
  import { useNavigate } from 'react-router-dom';

  //Search bar icons
  import searchIcon from '../../imagesVideos/headerIcons/searchbarIcons/searchIcon.svg';
  import cartIcon from '../../imagesVideos/headerIcons/searchbarIcons/cartIcon.svg';
  import favoritesIcon from '../../imagesVideos/headerIcons/searchbarIcons/favoritesIcon.svg';
  import accountIcon from '../../imagesVideos/headerIcons/searchbarIcons/accountIcon.svg';

  import cencelIcon from '../../imagesVideos/headerIcons/searchbarIcons/cencelIcon.svg';

  //Logo
  import logo from '../../imagesVideos/logo/logo.svg';

  import unfavoritedIcon from '../../imagesVideos/cardIcons/unfavorited.png';
  import favoritedIcon from '../../imagesVideos/cardIcons/favorited.png';

  const baseUrl = process.env.REACT_APP_BASE_URL;

  const Header = () => {
    const navigate = useNavigate();

    const [selectedLanguage, setSelectedLanguage] = useState(() => {
      const savedSelectedLanguage = window.localStorage.getItem('selectedLanguage');
      return savedSelectedLanguage ? JSON.parse(savedSelectedLanguage) : 'en';
    });

    const languages = [
      {name: 'English', short: 'en'},
      {name: 'O`zbek', short: 'uz'},
    ];

    const [currency, setCurrency] = useState([]);

    const [headerItems, setHeaderItems] = useState([]);

    const [hamburgerIsOpen, setHamburgerIsOpen] = useState(false);
    const [menuIsOpen, setMenuIsOpen] = useState(false);
    const [searchBarInputIsOpen, setSearchBarInputIsOpen] = useState(false);
    const [openedSearchBarInput, setOpenedSearchBarInput] = useState('');

    const [electronicsCategoryIsOpen, setElectronicsCategoryIsOpen] = useState(false);

    const [randomProducts, setRandomProducts] = useState([]);

  // Language List----------------------------------------------------------------------------------------------------------------------------------------------------

    const listOfLanguages = languages.map((elem, i) => {
      return (
        <option key={i} value={elem.short}>{elem.name}</option>
      ); 
    });

    const listOfRandomProducts = randomProducts.map((elem, i) => (
      <li
        key={i}
        onMouseEnter={() => handleMouseEnter(i)}
        onMouseLeave={() => handleMouseLeave(i)}
        className='flex flex-col items-around overflow-hidden'
        style={{ height: '300px', width: '250px', }}
      >
        <div className="flex flex-col items-center justify-end h-full relative">
  {/*Hard Functionality---------------------------------------------------------------------------------------------------------------------------------------------*/}
          {elem.hovered ? <img
            className='h-4 w-4 absolute top-3 right-5 duration-300 z-10'
            src={elem.favorited ? favoritedIcon : unfavoritedIcon}
            onClick={() => handleFavoriteClick(i)}
          /> : ''}
          <LazyLoadImage 
            id='cardImg'
            className={`duration-200 absolute ${elem.hovered ? 'top-1' : 'top-2'}`}
            style={{ height: elem.hovered ? '110px' : '100px', width: elem.hovered ? '110px' : '100px'}}
            src={elem.main.thumbnail} 
          />
          <div className='w-full flex flex-col justify-between'>
            <span className='text-sm text-blue-800 w-full pl-4'>{elem.main.brand.slug}</span>
            <div className='text-sm flex justify-between items-center w-full px-4'>
              <span>{elem.main.slug}</span>
              <span>{elem.main.price}</span>
            </div>
          </div>
        </div>
        <button className={`w-full h-20 text-center text-white bg-blue-800 tag ${elem.hovered ? 'show' : ''}`}>
          + Add to cart
        </button>
      </li>
    ));

  // Shadow------------------------------------------------------------------------------------------------------------------------------------------------------------

    const blackShadow = () => {
      if (menuIsOpen) { 
        return (<div className='fixed bg-slate-800/50 h-full w-full z-10' onClick={() => setMenuIsOpen(handleMenuOpening())}></div>);
      } else if (searchBarInputIsOpen) {
        return (<div className='fixed bg-slate-800/50 h-full w-full z-10' onClick={() => setSearchBarInputIsOpen(!searchBarInputIsOpen)}></div>);
      } if (electronicsCategoryIsOpen) {
        return (<div className='fixed bg-slate-800/50 h-full w-full z-10' onClick={() => setElectronicsCategoryIsOpen(!electronicsCategoryIsOpen)}></div>);
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
    }


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
            setHeaderItems(data); 
            } catch (error) {
              console.error(error);
            };
          };
      
          const fetchRandomProducts = async () => {
            const url = `${baseUrl}/products/random`;
                
                try {
                    const response = await fetch(url);
                    const data = await response.json();
                    setRandomProducts([
                    {
                      main: data.data[0],
                      hovered: false,
                      favorited: false,
                    },
                    {
                      main: data.data[1],
                      hovered: false,
                      favorited: false,
                    },
                    {
                      main: data.data[2],
                      hovered: false,
                      favorited: false,
                    },
                    {
                      main: data.data[3],
                      hovered: false,
                      favorited: false,
                    },
                  ]);
                } catch (err) {
                  console.error(err);
                };
            };
      
          fetchRandomProducts();
          fetchCurrency();
          fetchHeader();
        }, [selectedLanguage]);

      //Localization-----------------------------------------------------------------------------------------------------------------------------------------------------

      useEffect(() => {
          window.localStorage.setItem('selectedLanguage', JSON.stringify(selectedLanguage));
      }, [selectedLanguage]);

      const goToCatalog = (elem) => {
        navigate(`/CatalogPage/${elem}`)
      }

      const listOfHeaderItems = headerItems.map((elem, i) => {
        return (
          <li key={i} onClick={() => goToCatalog(elem.slug)} className='hover:text-blue-800 hover:underline cursor-pointer'>{elem.slug}</li>
        );
      });

      return (
        <>
          <header className='w-full fixed top-0 z-20 bg-white'>
          <div className='border-b-gray-300 border-b-2'>
            <div id="topLair" className='flex items-center justify-center text-sm relative bg-neutral-800 text-white px-9 py-1'>
              <span className='w-full text-start'>{currency.USD} USD is {currency.RUB} RUB or {currency.UZS} UZS now</span>
              <span className='text-center absolute'>Any case. Any band. Any style you want.</span>
              <div className='w-full flex justify-end'>
              <select className='outline-none bg-neutral-800' value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
                {listOfLanguages}
              </select>
            </div>
          </div>
          {searchBarInputIsOpen ? <div className='w-full flex justify-center' style={{ height: '600px' }}>
            <div className='flex flex-col w-2/4 pt-6'>
              <div className='flex w-full border-b-2 border-b-slate-300 p-2'>
                <input 
                  value={openedSearchBarInput}
                  onChange={(e) => setOpenedSearchBarInput(e.target.value)} 
                  className='outline-none pl-3 w-full'
                />
                <img src={cencelIcon}
                  onClick={() => handleCencelIconClick()}
                  className='h-4 w-4 cursor-pointer'
                />
              </div>
              <span>Popular Searchings</span>
              <div>
                
              </div>
              <span>Resent Searched</span>
              <div>

              </div>
              <span>Frequent Products</span>
              <div>

              </div>
            </div>
          </div> : <div id='navBar' className='px-9 py-3 flex items-center justify-center'>
            <div className='flex items-center justify-between w-full'>
              <div id='categories' className='flex items-center justify-start h-full pl-3 relative gap-3' style={{width: '500px'}}>
  {/* Hamburger Menu------------------------------------------------------------------------------------------------------------------------------------------------*/}
                <svg id="hamburger" className="Header__toggle-svg" viewBox="0 0 60 40" onClick={() => handleMenuOpening()}>
                  <g className="lines" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"> {/* Highlighted */}
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
                {/* hover:text-blue-800 cursor-pointer h-full border-b-2 border-b-transparent hover:border-b-blue-800 */}
                {/* Change Here */}
                <span className='hover:text-blue-800 cursor-pointer h-full border-b-2 border-transparent hover:border-b-blue-800 text-center'>New</span>
                <span className='hover:text-blue-800 cursor-pointer h-full border-b-2 border-transparent hover:border-b-blue-800 text-center' onClick={handleElecronicsClick}>Electronics</span>
                <span className='hover:text-blue-800 cursor-pointer h-full border-b-2 border-transparent hover:border-b-blue-800 text-center'>Appliances</span>
                <span className='hover:text-blue-800 cursor-pointer h-full border-b-2 border-transparent hover:border-b-blue-800 text-center'>Sale*</span>
              </div>
              <div id='searchBar' className='w-96 h-full flex justify-end'>
                <div className='flex items-center mr-10 cursor-pointer' onClick={() => handleSearchClick()}><img src={searchIcon} className='mr-2'/>Search</div>
                <img className='mr-2 cursor-pointer' src={cartIcon}/>
                <img className='mr-2 cursor-pointer' src={favoritesIcon}/>
                <img className='mr-2 cursor-pointer' src={accountIcon}/>
              </div>
            </div>
            <img className='cursor-pointer absolute' src={logo} onClick={() => navigate('/')}/>
          </div>}  
          </div>
  {/* Menu Aperiance----------------------------------------------------------------------------------------------------------------------------------------------- */}
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
            <ul className='w-96 border-r-2 border-r-gray-300 h-full pt-6 pl-16 flex flex-col justify-around'>
              <span className='text-blue-800 text-2xl underline'>All Electronics</span>
              {listOfHeaderItems}
            </ul>
            <div className='w-full flex items-center justify-around py-6 pl-6 text-base'>
                {listOfRandomProducts}
            </div>
          </div> : ''}
        </header>
        {blackShadow()}
        </>
      )
  }

  export default Header;