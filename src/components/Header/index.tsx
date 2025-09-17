import React, { useState, useEffect } from 'react';
import SmartLink from '../common/SmartLink';
import Logo from '../Logo/index';
import Socials from '../Socials/index';
import Menu from './Menu';

const Header: React.FC = () => {
  const [active, setActive] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  
  // Breakpoint for mobile menu
  const breakpoints = {
    lg: 1366,
    slg: 1200,
    md: 1024,
    sm: 840,
    xsm: 420,
  };

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      // Close menu if screen is resized to desktop
      if (window.innerWidth > breakpoints.slg && active) {
        setActive(false);
        document.body.style.overflow = '';
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [active, breakpoints.slg]);

  const toggleMenu = () => {
    setActive(!active);
    // Lock/unlock scroll when menu is open/closed
    document.body.style.overflow = !active ? 'hidden' : '';
  };

  return (
    <>
      <header className={`fixed top-0 left-0 w-full py-6 z-10 transition-all duration-300 ${active ? 'bg-transparent' : 'bg-gradient-to-b from-[#0a0a0f] to-transparent backdrop-blur-sm'}`}>
        <div className="container mx-auto px-4 flex items-center justify-between">
          <SmartLink to="/" className="block w-36">
            <Logo />
          </SmartLink>
          
          {width > breakpoints.slg && (
            <nav className="flex items-center">
              <SmartLink to="/products" className="text-white/80 hover:text-[#5B92FF] mx-4 text-sm">Products</SmartLink>
              <SmartLink to="/usecases" className="text-white/80 hover:text-[#5B92FF] mx-4 text-sm">Use Cases</SmartLink>
              <SmartLink to="/technology" className="text-white/80 hover:text-[#5B92FF] mx-4 text-sm">Technology</SmartLink>
              <SmartLink to="/developers" className="text-white/80 hover:text-[#5B92FF] mx-4 text-sm">Developers</SmartLink>
              <SmartLink to="/teer-token" className="text-white/80 hover:text-[#5B92FF] mx-4 text-sm">TEER Token</SmartLink>
              <SmartLink to="/about" className="text-white/80 hover:text-[#5B92FF] mx-4 text-sm">About</SmartLink>
              <SmartLink to="/blog" className="text-white/80 hover:text-[#5B92FF] mx-4 text-sm">Blog</SmartLink>
              <SmartLink to="/contacts" className="text-white/80 hover:text-[#5B92FF] mx-4 text-sm">Contacts</SmartLink>
            </nav>
          )}
          
          <div className="flex items-center gap-8">
            <Socials />
            
            {width > breakpoints.slg && (
              <a 
                href="https://app.incognitee.io" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="border-2 border-white/20 rounded-lg px-4 py-2 text-white text-sm"
              >
                Incognitee is live
              </a>
            )}
            
            {width <= breakpoints.slg && (
              <button 
                className={`w-[17px] h-[10px] relative z-20 ${active ? 'active' : ''}`} 
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                <div className={`absolute w-full h-[2px] bg-white/50 rounded-full transition-all ${active ? 'top-[4px] rotate-45' : 'top-0'}`} />
                <div className={`absolute w-full h-[2px] bg-white/50 rounded-full top-[4px] transition-opacity ${active ? 'opacity-0' : 'opacity-100'}`} />
                <div className={`absolute w-full h-[2px] bg-white/50 rounded-full ${active ? 'top-[4px] -rotate-45' : 'top-[8px]'}`} />
              </button>
            )}
          </div>
        </div>
      </header>
      
      {width <= breakpoints.slg && active && (
        <Menu active={active} toggleMenu={toggleMenu} />
      )}
    </>
  );
};

export default Header;
