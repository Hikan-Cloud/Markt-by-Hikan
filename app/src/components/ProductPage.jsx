import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";

import unfavoritedIcon from '../imagesVideos/cardIcons/unfavorited.png';
import favoritedIcon from '../imagesVideos/cardIcons/favorited.png';

import minusIcon from '../imagesVideos/catalogPageIcons/filterIcons/minusIcon.svg';
import plusIcon from '../imagesVideos/catalogPageIcons/filterIcons/plusIcon.svg';

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Define the color mapping with lowercase keys

const colorMapping = {
  red: 'bg-red-500',
  pink: 'bg-pink-500',
  purple: 'bg-purple-500',
  deepPurple: 'bg-deep-purple-500',
  indigo: 'bg-indigo-500',
  blue: 'bg-blue-500',
  lightBlue: 'bg-light-blue-500',
  cyan: 'bg-cyan-500',
  teal: 'bg-teal-500',
  green: 'bg-green-500',
  lightGreen: 'bg-light-green-500',
  lime: 'bg-lime-500',
  yellow: 'bg-yellow-500',
  amber: 'bg-amber-500',
  orange: 'bg-orange-500',
  deepOrange: 'bg-deep-orange-500',
  brown: 'bg-brown-500',
  grey: 'bg-grey-500',
  blueGrey: 'bg-blue-grey-500',
  black: 'bg-black',
  white: 'bg-white',
  gray: 'bg-gray-500',
  // Add more color mappings as needed
};

const baseUrl = process.env.REACT_APP_BASE_URL;

const ProductPage = () => {
// The slug of the product
  const { productSlug } = useParams();

// The information about the product
  const [productInfo, setProductInfo] = useState(null);

// Favorited or not

  const [favorited, setFavorited] = useState(false);

// Selected features
  const [selectedAttributes, setSelectedAttributes] = useState({});

// The quantity of selected product

  const [selectedQuantity, setSelectedQuantity] = useState(1);

// Fetching the product

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${baseUrl}/products/${productSlug}`);
        const data = await response.json();
        setProductInfo(data.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [productSlug]);

// To change favorited state

  const handleFavoriteToggle = () => {
    setFavorited(!favorited);
  };

// Selecter to exact state 

  const handleItemClick = (attributeSlug, itemValue) => {
    setSelectedAttributes((prevSelectedAttributes) => ({
      ...prevSelectedAttributes,
      [attributeSlug]: prevSelectedAttributes[attributeSlug] === itemValue ? null : itemValue,
    }));
  };

  const isSelected = (attributeSlug, itemValue) => {
    return selectedAttributes[attributeSlug] === itemValue;
  };

// Color definer

  const getColorClass = (itemValue) => {
    const colorClass = colorMapping[itemValue.toLowerCase()];
    return colorClass || 'bg-gray-200';
  };

// Weating for fetching product

  if (!productInfo) {
    return <div>Loading...</div>;
  };

// Price calculation

  const currentPrice = productInfo.price * selectedQuantity;

// Quantity handlers

  const handleMinusClick = () => {
    setSelectedQuantity(prevQuantity => Math.max(1, prevQuantity - 1));
  };

  const handlePlusClick = () => {
    if (selectedQuantity < productInfo.stocks[0].quantity) {
      setSelectedQuantity(prevQuantity => prevQuantity + 1);
    }
  };

  return (
    <main className="w-full h-full mt-32 mb-10 px-14 flex justify-between">
{/* Product Photos ----------------------------------------------------------------------------------------------------------------------------------------------- */}
      <div className="h-full w-2/4 gap-10 flex flex-col">
        {productInfo.images?.map((elem, i) => (
          <LazyLoadImage
            className="h-full shadow-xl rounded-xl overflow-hidden"
            key={i}
            src={elem}
          />
        ))}
      </div>
{/* Product Option Bar ------------------------------------------------------------------------------------------------------------------------------------------- */}
      <div className="w-2/5 px-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl text-blue-800">
            {productInfo.brand?.slug.charAt(0).toUpperCase() + productInfo.brand?.slug.slice(1)}
          </h1>
          <div className="border shadow-xl rounded-full p-2" onClick={handleFavoriteToggle}>
            <img
              className="h-8 w-8 duration-300 mt-1 mx-0.5"
              src={favorited ? favoritedIcon : unfavoritedIcon}
              alt="Favorite Icon"
            />
          </div>
        </div>
        <h1 className="mt-10 text-4xl">
          {productInfo.slug.charAt(0).toUpperCase() + productInfo.slug.split('-').join(' ').slice(1)}
        </h1>
        <div className="flex flex-col gap-10 mt-20">
          {productInfo.attributes?.map((attribute, i) => (
            <div key={i} className="text-2xl flex">
              <span className="mr-10 text-slate-600">{attribute.slug.charAt(0).toUpperCase() + attribute.slug.slice(1)}</span>
              <div className="flex gap-4">
                {attribute.items?.map((item, itemI) => {
                  const isColorAttribute = attribute.slug.toLowerCase() === 'color';
                  const colorClass = isColorAttribute ? getColorClass(item.value) : '';
                  const borderClass = isSelected(attribute.slug, item.value) ? 'border-2 border-blue-800' : 'border-2 border-transparent';
                  return (
                    <span
                      className={`cursor-pointer px-3 py-1 border ${borderClass} ${colorClass} ${isColorAttribute ? 'w-8 h-8 rounded-full' : ''}`}
                      key={itemI}
                      onClick={() => handleItemClick(attribute.slug, item.value)}
                    >
                      {!isColorAttribute && item.value}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-10 mt-10 mb-20">
          <span className="text-2xl text-slate-600">Quantity</span>
          <div className="flex items-center justify-around gap-4 border px-2 py-1 shadow-xl">
            <img
              src={minusIcon}
              onClick={handleMinusClick}
              className="w-3 h-3 cursor-pointer"
              alt="Decrease quantity"
            />
            <span>{selectedQuantity}</span>
            <img 
              src={plusIcon}
              onClick={handlePlusClick}
              className="w-3 h-3 cursor-pointer"
              alt="Increase quantity"
            />
          </div>
          <span className="text-blue-800">{productInfo.stocks[0].quantity} In Stock</span>
        </div>
        <span className="text-2xl">{`${currentPrice.toFixed(2)} sum`}</span>
        <button className="text-white bg-blue-800 border-2 border-blue-800 hover:bg-white hover:text-blue-800 w-full mt-4 text-lg py-1 shadow-xl">Add to cart</button>
        <button className="text-white bg-stone-800 border-2 border-stone-800 hover:bg-white hover:text-stone-800 w-full mt-2 text-lg py-1 shadow-xl">Buy now</button>
      </div>
    </main>
  );
};

export default ProductPage;