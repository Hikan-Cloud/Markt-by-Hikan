import React, { useState, useEffect, useRef } from 'react';
import { LazyLoadImage, LazyLoadComponent } from 'react-lazy-load-image-component';

// Tool components
import Header from '../../components/toolComponents/HeaderComponet';
import Footer from '../toolComponents/FooterComponent';
//---------------------------------------------------------------

//Videos
import macBook from '../../imagesVideos/ads/videos/macBook.mp4';
import galaxyS24 from '../../imagesVideos/ads/videos/galaxy-s24.webm';

//elctronics category container imges 
import applePhones from '../../imagesVideos/categoryImgs/applePhones.png';
import components from '../../imagesVideos/categoryImgs/components.png';
import laptops from '../../imagesVideos/categoryImgs/laptops.png';

//Favorited Product Icons
import unfavoritedIcon from '../../imagesVideos/cardIcons/unfavorited.png';
import favoritedIcon from '../../imagesVideos/cardIcons/favorited.png';

const baseUrl = process.env.REACT_APP_BASE_URL;

const HomePage = () => {
    const electronicsCategoryRef = useRef(null);

//Main Promo

    const [mainPromoRightItems, setMainPromoRightItems] = useState({});

//Middle Promo

    const [middleLeftPromoItems, setMiddlePromoLeftItems] = useState({});
    const [middleRightPromoItems, setMiddlePromoRightItems] = useState({});

//Extra Promo

    const [extraLeftPromoItems, setExtraLeftPromoItems] = useState({}); 

//Categories

    const [cellPhonesAndGadgets, setCellPhonesAndGadgets] = useState('');
    const [pcComponents, setPcComponents] = useState('');
    const [computersAndLaptops, setComputersAndLaptops] = useState('');
  
//Random

    const [randomProducts, setRandomProducts] = useState([]);

    const [selectedLanguage2, setSelectedLanguage2] = useState('');
    
    useEffect(() => {
      const fetchStoredString = () => {
        const retrievedString = localStorage.getItem('selectedLanguage');
          if (retrievedString) {
            setSelectedLanguage2(retrievedString);
          } else {
            console.warn('No string found in local storage.');
          };
        };
    
      fetchStoredString();
    }, [selectedLanguage2]);

//Scrolling--------------------------------------------------------------------------------------------------------------------------------------------------------

    useEffect(() => {
      const electronicsCategoryContainer = electronicsCategoryRef.current;
  
      const onWheel = (event) => {
        event.preventDefault();
        electronicsCategoryContainer.scrollBy({
          left: event.deltaY,
        });
      };
  
      electronicsCategoryContainer.addEventListener('wheel', onWheel);
  
      return () => {
        electronicsCategoryContainer.removeEventListener('wheel', onWheel);
      };
    }, []);    

  //Fetching-------------------------------------------------------------------------------------------------------------------------------------------------------
  
  useEffect(() => {
    const fetchMainPromo = async () => {
        const url = `${baseUrl}/promos/main`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            setMainPromoRightItems(data.right);
        } catch (err) {
            console.error(err);
        };
    };

    const fetchMiddlePromo = async () => {
      const url = `${baseUrl}/promos/middle`;
      
      try {
        const response = await fetch(url);
        const data = await response.json();
        setMiddlePromoLeftItems(data.left);
        setMiddlePromoRightItems(data.right);
      } catch (err) {
        console.error(err);
      };
    };

    const fetchExtraPromo = async () => {
      const url = `${baseUrl}/promos/extra`;
      
      try {
        const response = await fetch(url);
        const data = await response.json();
        setExtraLeftPromoItems(data.left);
      } catch (err) {
        console.error(err);
      };
    }
    

    const fetchCategories = async () => {
        const url = `${baseUrl}/categories/top`;
        
        try {
          const response = await fetch(url);
          const data = await response.json();
          setCellPhonesAndGadgets(data.data[0]);
          setPcComponents(data.data[1]);
          setComputersAndLaptops(data.data[2]);
        } catch (err) {
          console.error(err);
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

      fetchMainPromo();
      fetchMiddlePromo();
      fetchExtraPromo();
      fetchRandomProducts();
      fetchCategories();
  }, [selectedLanguage2]);
  
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
  
    const listOfRandomProducts = randomProducts.map((elem, i) => (
      <li
        key={i}
        onMouseEnter={() => handleMouseEnter(i)}
        onMouseLeave={() => handleMouseLeave(i)}
        className='flex flex-col items-around overflow-hidden'
        style={{ height: '470px', width: '600px', }}
      >
        <div className="flex flex-col items-center justify-end h-full relative">
  {/*Hard Functionality*/}
          {elem.hovered ? <img
            className='h-6 w-6 absolute top-3 right-5 duration-300 z-10'
            src={elem.favorited ? favoritedIcon : unfavoritedIcon}
            onClick={() => handleFavoriteClick(i)}
          /> : ''}
          <LazyLoadImage 
            id='cardImg'
            className={`duration-200 absolute ${elem.hovered ? 'top-10' : 'top-20'}`}
            style={{ height: elem.hovered ? '260px' : '250px', width: elem.hovered ? '260px' : '250px'}}
            src={elem.main.thumbnail} 
          />
          <div className='w-full flex flex-col justify-between'>
            <span className='text-sm text-blue-800 w-full pl-4'>{elem.main.brand.slug}</span>
            <div className='text-sm flex justify-between items-center w-full px-4 mt-2'>
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
    
    return (
      <>
      <Header />
        <main className='w-full h-full mt-32'>
        <div className='px-9 flex justify-center' style={{height: '700px'}}>
          <div className='pr-2' style={{width: '1020px'}}>
            <div className='relative'>
                <LazyLoadComponent>
                    <video className='overflow-hidden rounded-xl' autoPlay loop muted preload='auto' width='100%' height='100%'>
                    <source src={macBook} type='video/mp4' />
                </video>
                </LazyLoadComponent>
                <div className='text-white text-5xl bg-slate-900/25 absolute bottom-0 left-0 w-full h-full rounded-xl'>
                <div className='relative w-full h-full'>
                  <span className='absolute bottom-10 left-10'>Incredible speed <br/> and battery life?</span>
                </div>
              </div>
            </div>
          </div>
          <div className='rounded-xl flex flex-col items-center justify-start' style={{width: '400px'}}>
            <div className='flex flex-col justify-start items-center bg-slate-100 w-full rounded-xl relative p-4' style={{height: '390px'}}>
              <span className='text-gray-400 mb-2 text-xs'>APPLE WATCH SERIES 9</span>
              <b className='text-2xl mb-2'>Any case. Any band. <br/> Any style. You want.</b>
              <b className='text-blue-800 text-base'>from $399</b>
              <LazyLoadImage 
                id='mainRightPromoImg'
                src={mainPromoRightItems.image}
              />
            </div>
            <button className='border-2 border-blue-800 bg-blue-800 text-5xl rounded-xl text-white w-full mt-3 hover:bg-white hover:text-blue-800 relative' style={{height: '120px'}}>
              <h1>Sale <b className='absolute top-2 right-5 text-6xl'>*</b></h1>
            </button>
            <div>
          </div>
          </div>
        </div>
  {/*Categories-----------------------------------------------------------------------------------------------------------------------------------------------------*/}
        <div className='px-12' style={{height: '800px'}}>
          <h1 className='mb-7 text-4xl'>Electronics</h1>
          <div id='electronicsCategory' ref={electronicsCategoryRef} className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth text-xl no-scrollbar">
            <div className='snap-start flex-none mr-2 mb-4'>
              <LazyLoadImage
                style={{width: '400px', height: '400px'}}
                className='h-full w-full overflow-hidden'
                src={applePhones}
              />
              <span className='mt-2 pl-2 block'>{cellPhonesAndGadgets.slug}</span>
            </div>
            <div className='snap-start flex-none mr-2'>
              <LazyLoadImage
                style={{width: '400px', height: '400px'}}
                className='h-full w-full overflow-hidden'
                src={components}
              />
              <span className='mt-2 pl-2 block'>{pcComponents.slug}</span>
            </div>
            <div className='snap-start flex-none rounded-xl overflow-hidden mr-2'>
              <LazyLoadImage
                style={{width: '400px', height: '400px'}}
                className='h-full w-full'
                src={laptops}              
              />
              <span className='mt-2 pl-2 block'>{computersAndLaptops.slug}</span>
            </div>
  {/*Repeating------------------------------------------------------------------------------------------------------------------------------------------------------*/}
            <div className='snap-start flex-none mr-2 mb-4'>
              <LazyLoadImage
                style={{width: '400px', height: '400px'}}
                className='h-full w-full overflow-hidden'
                src={applePhones}
              />
              <span className='mt-2 pl-2 block'>Apple Phones</span>
            </div>
            <div className='snap-start flex-none mr-2'>
              <LazyLoadImage
                style={{width: '400px', height: '400px'}}
                className='h-full w-full overflow-hidden'
                src={components}
              />
              <span className='mt-2 pl-2 block'>Components</span>
            </div>
            <div className='snap-start flex-none rounded-xl overflow-hidden mr-2'>
              <LazyLoadImage
                style={{width: '400px', height: '400px'}}
                className='h-full w-full'
                src={laptops}              
              />
              <span className='mt-2 pl-2 block'>Laptops</span>
            </div>
          </div>
        </div>
  {/*New Arrivals---------------------------------------------------------------------------------------------------------------------------------------------------*/}
        <div className='px-12 w-full overflow-auto' style={{height: '850px'}}>
          <div className='flex justify-between mb-20'>
            <h1 className='text-4xl'>New arrivals</h1>
            <span className='text-slate-600 underline decoration-solid'>Show all</span>
          </div>
          <ul className='flex justify-center'>
            {listOfRandomProducts}
          </ul>
        </div>
  {/*Banners--------------------------------------------------------------------------------------------------------------------------------------------------------*/}
        <div className='px-12 mb-10 w-full'>
          <div className='flex justify-center' style={{height: '800px'}}>
            <div className='h-full bg-slate-100 rounded-xl flex flex-col justify-end mr-2 relative' style={{maxWidth: '700px', width: '700px'}}>
              <LazyLoadImage
                style={{width: '100%', height: '500px'}}
                className='absolute top-10'
                src={middleLeftPromoItems.image}
              />
              <div className='flex flex-col items-center justify-center w-full absolute bottom-14'>
                <span className='text-slate-400'>IPHONE 15 VS IPHONE 13</span>
                <span className='text-3xl'>How do they compare?</span>
              </div>
            </div>
            <div className='h-full bg-slate-100 rounded-xl flex flex-col justify-start relative' style={{maxWidth: '800px', width: '1000px'}}>
              <div className='flex flex-col items-center justify-center text-center absolute top-14 w-full'>
                <span className='text-slate-400 mb-2 text-xl'>NEW RELEASES</span>
                <span className='text-5xl'>The Samsung Galaxy <br/> S24 rage is here</span>
              </div>
              <LazyLoadImage
                style={{width:'100%', height: '600px'}}
                className='absolute bottom-0'
                src={middleRightPromoItems.image}
              />
            </div>
          </div>
          <div className='flex justify-around items-center h-full mt-2 bg-slate-100 rounded-xl' style={{height: '300px'}}>
            <LazyLoadImage
              src={extraLeftPromoItems.image}
              className='h-full'
            />
            <div className='flex flex-col justify-center h-full items-center text-center'>
              <span className='mb-4 text-slate-400 text-xl'>APPLE WATCH SERIES 9</span>
              <span className='text-5xl'>Any case. Any band. <br/> Any style you want.</span>
            </div>
          </div>
        </div>
  {/*Promo videos---------------------------------------------------------------------------------------------------------------------------------------------------*/}
        <div className='w-full flex justify-center items-center mb-20'>
          <div className='relative flex justify-center' style={{height: '800px'}}>
            <LazyLoadComponent>
              <video autoPlay loop muted preload='auto' className='w-full h-full'>
                <source src={galaxyS24} type='video/webm' />
              </video>
            </LazyLoadComponent>
              <div className='absolute bottom-32 flex flex-col justify-center items-center text-white'>
                <span className='text-6xl mb-6'>Galaxy S24 Ultra</span>
                <span className='text-3xl mb-6'>Galaxy AI here</span>
                <button className='border-2 border-white text-center px-11 py-4 text-xl'>SHOP NOW *</button>
              </div>
          </div>
        </div>
      </main>
      <Footer />
      </>
    );
  };

  export default HomePage;