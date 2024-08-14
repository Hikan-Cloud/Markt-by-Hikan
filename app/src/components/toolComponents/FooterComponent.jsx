import '../../App.css';
import React, { useState, useEffect } from 'react';

//Logo
import logo from '../../imagesVideos/logo/logo.svg';

//Footer Icons
import shopPayIcon from '../../imagesVideos/bottomIcons/shopPayIcon.svg';
import instagramIcon from '../../imagesVideos/bottomIcons/instagramIcon.svg';
import telegramIcon from '../../imagesVideos/bottomIcons/telegramIcon.svg';

const baseUrl = process.env.REACT_APP_BASE_URL;

const Footer = () => {
    const [footerItems, setFooterItems] = useState({
        line1: ['', '', ''],
        line2: ['', '', ''],
    });

    useEffect(() => {
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

                setFooterItems({
                    line1: data['line_1'],
                    line2: data['line_2'],
                });
            } catch (error) {
                console.error(error);
            }
        };
    
        fetchFooter();
    }, []);

    return (
        <footer className='flex justify-between px-9 w-full pt-20 border-t-gray-300 border-t-2' style={{ height: '500px' }}>
            <div id='leftSide' className='w-1/3 flex flex-col items-start justify-between h-full p-6'>
                <img src={logo} alt="Logo" />
                <span className='pl-4'>©2024 Markt store</span>
            </div>
            <div id='rightSide' className='w-full flex justify-between h-full pr-72'>
                <div className='flex flex-col items-start w-1/3 p-12 relative'>
                    <div className='flex flex-col gap-4'>
                        <span className='text-blue-800'>{footerItems.line1[0]?.slug}*</span>
                        <span>{footerItems.line1[1]?.slug}</span>
                        <span>{footerItems.line1[2]?.slug}</span>
                        <img className='absolute bottom-0 left-2' src={shopPayIcon} alt="Shop Pay" />
                    </div>
                </div>
                <div className='flex flex-col items-start w-1/3 p-12'>
                    <div className='flex flex-col'>
                        <span>{footerItems.line2[0]?.slug}</span>
                        <span>{footerItems.line2[1]?.slug}</span>
                        <span>{footerItems.line2[2]?.slug}</span>
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
    );
};

export default Footer;
