import { useEffect, useState, useMemo } from "react";
import ReactPaginate from 'react-paginate'; 
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useParams, useSearchParams, useLocation, useNavigate } from 'react-router-dom';

import minusIcon from '../imagesVideos/catalogPageIcons/filterIcons/minusIcon.svg';
import plusIcon from '../imagesVideos/catalogPageIcons/filterIcons/plusIcon.svg';
import xIcon from '../imagesVideos/catalogPageIcons/filterIcons/xIcon.svg';

import unfavoritedIcon from '../imagesVideos/cardIcons/unfavorited.png';
import favoritedIcon from '../imagesVideos/cardIcons/favorited.png';

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Main Url

const baseUrl = process.env.REACT_APP_BASE_URL;

//

const CategoryPage = () => {
    const navigate = useNavigate();
    const { value } = useParams();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [filterIsOpen, setFilterIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    
    const [filters, setFilters] = useState([
        { type: 'brand', main: [], isOpen: false },
        { type: 'category', main: [], isOpen: false },
        { type: 'tag', main: [], isOpen: false },
    ]);
    
    const [selectedFilters, setSelectedFilters] = useState(() => {
        const savedFilters = localStorage.getItem('selectedFilters');
        return savedFilters ? JSON.parse(savedFilters) : { brand: [], category: [], tag: [] };
    });
    
    const [filteredProducts, setFilteredProducts] = useState(() => {
        const savedFilteredProducts = localStorage.getItem('filteredProducts');
        return savedFilteredProducts ? JSON.parse(savedFilteredProducts) : [];
    });
    
    const [allProducts, setAllProducts] = useState([]);
    
    // Fetch filtered products
    const fetchFilteredProducts = async (page = currentPage) => {
        const search = searchParams.get('search') || value;
        const brands = searchParams.get('brands') || selectedFilters.brand.join(',');
        const categories = searchParams.get('categories') || selectedFilters.category.join(',');
        const tags = searchParams.get('tags') || selectedFilters.tag.join(',');
    
        try {
            const response = await fetch(`${baseUrl}/products?search=${search}&page=${page}&brands=${brands}&categories=${categories}&tags=${tags}`);
            const data = await response.json();
            setFilteredProducts(data.data.map((elem) => ({
                main: elem,
                hovered: false,
                favorited: false,
            })));
        } catch (error) {
            console.error('Error fetching filtered products:', error);
        }
    };
    
    // Fetch all products
    const fetchAllProducts = async () => {
        try {
            const response = await fetch(`${baseUrl}/products?search=${value}&page=${currentPage}`);
            const data = await response.json();
            setAllProducts(data.data.map((elem) => ({
                main: elem,
                hovered: false,
                favorited: false,
            })));
            // Set initial filtered products if none are set
            if (filteredProducts.length === 0) {
                setFilteredProducts(data.data.map((elem) => ({
                    main: elem,
                    hovered: false,
                    favorited: false,
                })));
            }
        } catch (error) {
            console.error('Error fetching all products:', error);
        };
    };

    useEffect(() => {
        fetchFilters();
    }, []);

    useEffect(() => {
        fetchAllProducts();
    }, [value, currentPage]);

    useEffect(() => {
        localStorage.setItem('selectedFilters', JSON.stringify(selectedFilters));
    }, [selectedFilters]);

    useEffect(() => {
        localStorage.setItem('filteredProducts', JSON.stringify(filteredProducts));
    }, [filteredProducts]);

    useEffect(() => {
        const brands = selectedFilters.brand.join(',');
        const categories = selectedFilters.category.join(',');
        const tags = selectedFilters.tag.join(',');
    
        setSearchParams({
            search: value,
            page: currentPage,
            brands,
            categories,
            tags,
        });
    }, [selectedFilters, value, currentPage]);

    useEffect(() => {
        // Fetch filtered products whenever the page changes
        fetchFilteredProducts(currentPage);
    }, [currentPage]);

    const findOut = () => {
        fetchFilteredProducts(currentPage);
    };

    const clearAllFilters = () => {
        setSelectedFilters({ brand: [], category: [], tag: [] });
        setSearchParams({ search: value });
        localStorage.removeItem('selectedFilters');
        setFilteredProducts(allProducts);  // Reset to unfiltered products
    };
    
    const removeFilter = (value, filterType) => {
        setSelectedFilters(prevSelectedFilters => ({
            ...prevSelectedFilters,
            [filterType]: prevSelectedFilters[filterType].filter(item => item !== value),
        }));
    };
    
    const showFilters = () => {
        setFilterIsOpen(true);
    };
    
    const toggleFilter = (filterType) => {
        setFilters(prevFilters => prevFilters.map(filter =>
            filter.type === filterType ? { ...filter, isOpen: !filter.isOpen } : filter
        ));
    };
    
    const handleCheckboxChange = (filterType, value) => {
        setSelectedFilters(prevSelectedFilters => {
            const isSelected = prevSelectedFilters[filterType].includes(value);
            return {
                ...prevSelectedFilters,
                [filterType]: isSelected
                    ? prevSelectedFilters[filterType].filter(item => item !== value)
                    : [...prevSelectedFilters[filterType], value],
            };
        });
    };
    
    const getSelectedSlugs = (filterType) => {
        const selectedIds = selectedFilters[filterType];
        const filter = filters.find(f => f.type === filterType);
        if (filter) {
            return filter.main.filter(item => selectedIds.includes(item.id)).map(item => item.slug);
        }
        return [];
    };
    
    const handleShadowClick = () => {
        setFilterIsOpen(false);
        findOut();
    };
    
    const handleMouseEnter = (index) => {
        const updatedFilteredProducts = [...filteredProducts];
        updatedFilteredProducts[index].hovered = true;
        setFilteredProducts(updatedFilteredProducts);
    };
    
    const handleMouseLeave = (index) => {
        const updatedFilteredProducts = [...filteredProducts];
        updatedFilteredProducts[index].hovered = false;
        setFilteredProducts(updatedFilteredProducts);
    };
    
    const handleFavoriteClick = (index) => {
        const updatedFilteredProducts = [...filteredProducts];
        updatedFilteredProducts[index].favorited = !updatedFilteredProducts[index].favorited;
        setFilteredProducts(updatedFilteredProducts);
    };

    const handleXIconClick = () => {
        setFilterIsOpen(false);
        findOut();
    };

    const fetchFilters = async () => {
        try {
            const response = await fetch(`${baseUrl}/filters`);
            const data = await response.json();
            setFilters([
                { type: 'brand', main: data.brands, isOpen: false },
                { type: 'category', main: data.categories, isOpen: false },
                { type: 'tag', main: data.tags, isOpen: false },
            ]);
        } catch (error) {
            console.error('Error fetching filters:', error);
        }
    };

    const handlePageClick = (event) => {
        const selectedPage = event.selected + 1; // ReactPaginate uses 0-based index
        setCurrentPage(selectedPage);
    };
    

    return (
        <>  
            <main className="mt-32 w-full h-full">
{/* Side Left Filters--------------------------------------------------------------------------------------------------------------------------------------------- */}
                {filterIsOpen ? <div className="h-screen w-full fixed top-0 z-30 flex">
                        <div className="w-2/4 h-full bg-white flex flex-col text-xl px-6 pt-20 overflow-scroll scroll-m-0 no-scrollbar">
                            <div className="flex justify-between items-center w-full pb-10 mb-6 border-b border-b-slate-400">
                                <span>Filters</span>
                                <img className='w-4 h-4' onClick={() => handleXIconClick()} src={xIcon} />
                            </div>
                            <div className="flex flex-wrap gap-3 py-10">
                                {getSelectedSlugs('brand').map((elem, i) => (
                                <div key={i} className="cursor-pointer bg-slate-200 rounded-lg text-lg py-0.5 px-2 flex items-center" onClick={() => removeFilter(selectedFilters.brand[i], 'brand')}>
                                    <span>{elem.charAt(0).toUpperCase() + elem.slice(1)}</span>
                                    <img className="w-3 h-3 ml-2" src={xIcon} />
                                </div>
                                ))}
                                {getSelectedSlugs('category').map((elem, i) => (
                                <div key={i} className="cursor-pointer bg-slate-200 rounded-lg text-lg py-0.5 px-2 flex items-center" onClick={() => removeFilter(selectedFilters.category[i], 'category')}>
                                    <span>{elem.charAt(0).toUpperCase() + elem.slice(1)}</span>
                                    <img className="w-3 h-3 ml-2" src={xIcon} />
                                </div>
                                ))}
                                {getSelectedSlugs('tag').map((elem, i) => (
                                <div key={i} className="cursor-pointer bg-slate-200 rounded-lg text-lg py-0.5 px-2 flex items-center" onClick={() => removeFilter(selectedFilters.tag[i], 'tag')}>
                                    <span>{elem.charAt(0).toUpperCase() + elem.slice(1)}</span>
                                    <img className="w-3 h-3 ml-2" src={xIcon} />
                                </div>
                                ))}
                                <span className="underline text-blue-800 hover:text-blue-400 cursor-pointer" onClick={() => clearAllFilters()}>
                                    Clear all
                                </span>
                            </div>
                            <ul>
                                {filters.map((filter) => (
                                    <li key={filter.type} className="text-slate-600 w-full mb-4 pb-4 border-b border-b-slate-200 flex flex-col">
                                    <div className="flex items-center justify-between">
                                    <span>{filter.type.charAt(0).toUpperCase() + filter.type.slice(1)}</span>
                                    <img
                                    onClick={() => toggleFilter(filter.type)}
                                    src={filter.isOpen ? minusIcon : plusIcon}
                                    className="w-4 h-4"
                                    />
                                    </div>
                                    {filter.isOpen && (<div className="mt-10">
                                        {filter.main.map((elem, index) => <div key={index} className="flex justify-start items-center text-lg">
                                    <input
                                    type="checkbox"
                                    checked={selectedFilters[filter.type].includes(elem.id)}
                                    onChange={() => handleCheckboxChange(filter.type, elem.id)}
                                    />
                                    <span>{elem.slug.charAt(0).toUpperCase() + elem.slug.slice(1)}</span>
                                    </div>
                                    )}
                                </div>
                                )}
                            </li>))}
                        </ul>
                        <button className="bg-blue-800 border-2 border-blue-800 text-white hover:bg-white hover:text-blue-800 rounded outline-none" onClick={() => findOut()}>Find Out</button>
                     </div>
                    <div className="w-full h-full bg-slate-800/25" onClick={() => handleShadowClick()}></div>
                </div> : ''}
{/* Starting Container-------------------------------------------------------------------------------------------------------------------------------------------- */}
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
{/* Products------------------------------------------------------------------------------------------------------------------------------------------------------ */}
                <div className="flex justify-center w-full overflow-hidden">
                    <ul className="flex flex-wrap pl-4 overflow-hidden">
                        {filteredProducts.map((elem, i) => (
                            <li
                            key={i}
                            onMouseEnter={() => handleMouseEnter(i)}
                            onMouseLeave={() => handleMouseLeave(i)}
                            className='flex flex-col items-around overflow-hidden border border-slate-100'
                            style={{ height: '450px', width: '370px', }}
                            >
                            <div className="flex flex-col items-center justify-end h-full relative">
                            {elem.hovered ? <img
                                className='h-6 w-6 absolute top-3 right-5 duration-300 z-10'
                                src={elem.favorited ? favoritedIcon : unfavoritedIcon}
                                onClick={() => handleFavoriteClick(i)}
                            /> : ''}
                            <LazyLoadImage 
                            id='cardImg'
                            className={`duration-200 absolute ${elem.hovered ? 'top-10' : 'top-20'}`}
                            onClick={() => navigate(`/productPage/${elem.main.slug}`)}
                            style={{ height: elem.hovered ? '260px' : '250px', width: elem.hovered ? '260px' : '250px'}}
                            src={elem.main.thumbnail} 
                            />
                            <div className='w-full flex flex-col justify-between'>
                            <span className='text-sm text-blue-800 w-full pl-4'>{elem.main.brand.slug.charAt(0).toLocaleUpperCase() + elem.main.brand.slug.slice(1)}</span>
                            <div className='text-lg flex justify-between items-center w-full px-4 mt-2 pb-3'>
                                <span>{elem.main.slug.charAt(0).toUpperCase() + elem.main.slug.split('-').join(' ').slice(1)}</span>
                                <span>{elem.main.price} UZS</span>
                            </div>
                        </div>
                    </div>
                    <button className={`w-full h-20 text-center text-white bg-blue-800 tag overflow-hidden ${elem.hovered ? 'show' : ''}`}>
                        + Add to cart
                    </button>
                    </li>
                    ))}
                </ul>
            </div>
            <div className="flex justify-center mt-20 w-full px-96">
                <ReactPaginate
                className="flex w-1/3 h-1/3 justify-around items-center"
                pageCount={Math.ceil(filteredProducts.length / itemsPerPage)}
                onPageChange={handlePageClick}
                pageClassName="text-center text-xl font-bold px-6 py-4"
                activeClassName="border-2 border-blue-800"
                renderOnZeroPageCount={() => setCurrentPage(1)}
                forcePage={currentPage - 1}
                previousClassName="text-4xl"
                previousLabel={currentPage === Math.ceil(filteredProducts.length / itemsPerPage) ? "<" : ""}
                nextLabel=""
                breakLabel="..."
                />
            </div>
{/* Similar Products---------------------------------------------------------------------------------------------------------------------------------------------- */}
                <div className="flex flex-col items-center justify-center px-14 my-32 w-full">
                    <span className="w-full text start">Similar products</span>
                    <div className="flex">
                        <ul className="flex flex-wrap justify-center">
                            {/* Similar products */}
                        </ul>
                    </div>
                </div>
            </main>
        </>
    );
};

export default CategoryPage;