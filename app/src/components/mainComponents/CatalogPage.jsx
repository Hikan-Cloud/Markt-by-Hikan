import { useEffect, useState } from "react";
import { LazyLoadImage, LazyLoadComponent } from 'react-lazy-load-image-component';
import { useParams } from 'react-router-dom';

//Tool components
import Header from '../toolComponents/HeaderComponet';
import Footer from '../toolComponents/FooterComponent';

import minusIcon from '../../imagesVideos/catalogPageIcons/filterIcons/minusIcon.svg';
import plusIcon from '../../imagesVideos/catalogPageIcons/filterIcons/plusIcon.svg';
import xIcon from '../../imagesVideos/catalogPageIcons/filterIcons/xIcon.svg';

import unfavoritedIcon from '../../imagesVideos/cardIcons/unfavorited.png';
import favoritedIcon from '../../imagesVideos/cardIcons/favorited.png';


const baseUrl = process.env.REACT_APP_BASE_URL;

const CategoryPage = () => {
    const { value } = useParams();

    const [filters, setFilters] = useState([
        { type: 'brand', main: [], selected: [], isOpen: false },
        { type: 'category', main: [], selected: [], isOpen: false },
        { type: 'tag', main: [], selected: [], isOpen: false },
    ]);

    const paramsString = "name=topic";
    const searchParams = new URLSearchParams(paramsString);
    
    // Append a new parameter
    searchParams.append("topic", "webdev");

    const [filterIsOpen, setFilterIsOpen] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState([
        {
            main: {
                brand: {
                    slug: '',
                },
                thumbnail: '',
                slug: '',
            },
            hovered: false,
            favorited: false,
        }
    ]);

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const response = await fetch(`${baseUrl}/filters`);
                const data = await response.json();
                setFilters([
                    { type: 'brand', main: data.brands, selected: [], isOpen: false },
                    { type: 'category', main: data.categories, selected: [], isOpen: false },
                    { type: 'tag', main: data.tags, selected: [], isOpen: false },
                ]);
            } catch (error) {
                console.error(error);
            };
        };

        const fetchProducts = async () => {
            try {
                const response = await fetch(`${baseUrl}/products`);
                const data = await response.json();
                setFilteredProducts(data.data.map((elem, i) => {
                    return {
                        main: elem,
                        hovered: false,
                        favorited: false,
                    }
                }));
            } catch (error) {
                console.error(error);
            };
        };

        fetchFilters();
        fetchProducts();
    }, []);
    
    const showFilters = () => {
        setFilterIsOpen(true);
    };

    const toggleFilter = (filterType) => {
        setFilters((prevFilters) => {
          return prevFilters.map((filter) => filter.type === filterType ? { ...filter, isOpen: !filter.isOpen } : filter);
        });
    };

    const handleCheckboxChange = (filterType, value) => {
        setFilters((prevFilters) =>
            prevFilters.map(elem => {
                if (elem.type === filterType) {
                    const isSelected = elem.selected.includes(value);
                    const newSelected = isSelected ? elem.selected.filter(item => item !== value) : [...elem.selected, value];
                    return { ...elem, selected: newSelected };
                }
                return elem;
            })
        );
    };

    const getSelectedSlugs = (filterType) => {
        const filter = filters.find(f => f.type === filterType);
        if (filter) {
            return filter.main
                .filter(item => filter.selected.includes(item.id))
                .map(item => item.slug);
        }
        return [];
    };

    const handleMouseEnter = (index) => {
        const updatedFilteredProducts = [...filteredProducts];
        filteredProducts[index].hovered = true;
        setFilteredProducts(updatedFilteredProducts);
      };
    
      const handleMouseLeave = (index) => {
        const updatedFilteredProducts = [...filteredProducts];
        filteredProducts[index].hovered = false;
        setFilteredProducts(updatedFilteredProducts);
      };
    
      const handleFavoriteClick = (index) => {
        const updatedFilteredProducts = [...filteredProducts];
        updatedFilteredProducts[index].favorited = !updatedFilteredProducts[index].favorited;
        setFilteredProducts(updatedFilteredProducts);
      };

    const listOfFilteredProducts = filteredProducts.map((elem, i) => (
        <li
          key={i}
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={() => handleMouseLeave(i)}
          className='flex flex-col items-around overflow-hidden'
          style={{ height: '450px', width: '370px', }}
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

    const listOfFilters = filters.map((filter) => {
        return (
            <li key={filter.type} className="text-slate-600 w-full mb-4 pb-4 border-b border-b-slate-200 flex flex-col">
                <div className="flex items-center justify-between">
                    <span>{filter.type.charAt(0).toUpperCase() + filter.type.slice(1)}</span>
                    <img
                        onClick={() => toggleFilter(filter.type)}
                        src={filter.isOpen ? minusIcon : plusIcon}
                        className="w-4 h-4"
                    />
                </div>
                {filter.isOpen && (
                    <div className="mt-10">
                        {filter.main.map((elem, index) => {
                            return (
                                <div key={index} className="flex justify-start items-center text-lg">
                                    <input
                                        type="checkbox"
                                        className="mr-2 h-4 w-4"
                                        checked={filter.selected.includes(elem.id)}
                                        onChange={() => handleCheckboxChange(filter.type, elem.id)}
                                    />
                                    <span>{elem.slug.charAt(0).toUpperCase() + elem.slug.slice(1)}</span>
                                </div>
                            )
                        })}
                    </div>
                )}
            </li>
        );
    });
    
    return (
        <>
        <Header />
            <main className="mt-32 w-full h-full">
                {filterIsOpen && (
                    <div className="h-screen w-full fixed top-0 z-30 flex">
                        <div className="w-2/4 h-full bg-white flex flex-col text-xl px-6 pt-20 overflow-scroll scroll-m-0 no-scrollbar">
                            <div className="flex justify-between items-center w-full pb-10 mb-6 border-b border-b-slate-400">
                                <span>Filters</span>
                                <img className='w-4 h-4' onClick={() => setFilterIsOpen(false)} src={xIcon} />
                            </div>
                            <div className="flex flex-wrap gap-3 py-10">
                                {getSelectedSlugs('brand').map((elem, i) => (
                                    <span key={i}>{elem.charAt(0).toUpperCase() + elem.slice(1)}</span>
                                ))}
                                {getSelectedSlugs('category').map((elem, i) => (
                                    <span key={i}>{elem.charAt(0).toUpperCase() + elem.slice(1)}</span>
                                ))}
                                {getSelectedSlugs('tag').map((elem, i) => (
                                    <span key={i}>{elem.charAt(0).toUpperCase() + elem.slice(1)}</span>
                                ))}
                            </div>
                            <ul>
                                {listOfFilters}
                            </ul>
                            <button className="bg-blue-800 border-2 border-blue-800 text-white hover:bg-white hover:text-blue-800 rounded outline-none">Find Out</button>
                        </div>
                        <div className="w-full h-full bg-slate-800/25" onClick={() => setFilterIsOpen(false)}></div>
                    </div>
                )}
                <div className="flex justify-center flex-col items-center w-full px-14 mb-32">
                    <h1 className="mt-20 text-4xl">{value.charAt(0).toUpperCase() + value.slice(1)}</h1>
                    <div className="flex justify-between w-full mt-32">
                        <div>
                            <span className="mr-3">Sort by</span>
                            <span className='cursor-pointer' onClick={() => showFilters()}>Filters</span>
                        </div>
                        <div>
                            <i className="mr-3">put icon here</i>
                            <i>put icon here</i>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center w-full">
                    <ul className="flex flex-wrap pl-4 overflow-hidden">
                        {listOfFilteredProducts}
                    </ul>
                </div>
                <div className="flex flex-col items-center justify-center px-14 my-32 w-full">
                    <span className="w-full text start">Similar products</span>
                    <div className="flex">
                        <ul className="flex flex-wrap justify-center">
                            {/* Similar products */}
                        </ul>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default CategoryPage;