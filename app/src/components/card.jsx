// const handleMouseEnter = (index) => {
    //     const updatedFilteredProducts = [...filteredProducts];
    //     filteredProducts[index].hovered = true;
    //     setFilteredProducts(updatedFilteredProducts);
    //   };
    
    //   const handleMouseLeave = (index) => {
    //     const updatedFilteredProducts = [...filteredProducts];
    //     filteredProducts[index].hovered = false;
    //     setFilteredProducts(updatedFilteredProducts);
    //   };
    
    //   const handleFavoriteClick = (index) => {
    //     const updatedFilteredProducts = [...filteredProducts];
    //     updatedFilteredProducts[index].favorited = !updatedFilteredProducts[index].favorited;
    //     setFilteredProducts(updatedFilteredProducts);
    //   };
    
    //   const listOfFilteredProducts = filteredProducts.map((elem, i) => (
    //     <li
    //       key={i}
    //       onMouseEnter={() => handleMouseEnter(i)}
    //       onMouseLeave={() => handleMouseLeave(i)}
    //       className='flex flex-col items-around overflow-hidden'
    //       style={{ height: '470px', width: '600px', }}
    //     >
    //       <div className="flex flex-col items-center justify-end h-full relative">
    // {/*Hard Functionality*/}
    //         {elem.hovered ? <img
    //           className='h-6 w-6 absolute top-3 right-5 duration-300 z-10'
    //           src={elem.favorited ? favoritedIcon : unfavoritedIcon}
    //           onClick={() => handleFavoriteClick(i)}
    //         /> : ''}
    //         <LazyLoadImage 
    //           id='cardImg'
    //           className={`duration-200 absolute ${elem.hovered ? 'top-10' : 'top-20'}`}
    //           style={{ height: elem.hovered ? '260px' : '250px', width: elem.hovered ? '260px' : '250px'}}
    //           src={elem.main.thumbnail} 
    //         />
    //         <div className='w-full flex flex-col justify-between'>
    //           <span className='text-sm text-blue-800 w-full pl-4'>{elem.main.brand.slug}</span>
    //           <div className='text-sm flex justify-between items-center w-full px-4 mt-2'>
    //             <span>{elem.main.slug}</span>
    //             <span>{elem.main.price}</span>
    //           </div>
    //         </div>
    //       </div>
    //       <button className={`w-full h-20 text-center text-white bg-blue-800 tag ${elem.hovered ? 'show' : ''}`}>
    //         + Add to cart
    //       </button>
    //     </li>
    //   ));