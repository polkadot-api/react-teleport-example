import React from 'react';
import SmartLink from '../common/SmartLink';
import Socials from '../Socials/index';

interface MenuProps {
  active: boolean;
  toggleMenu: () => void;
}

const Menu: React.FC<MenuProps> = ({ active, toggleMenu }) => {
  if (!active) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full z-[5] bg-[#0a0a0f] pt-[100px] px-4 overflow-auto">
      <div className="flex flex-col">
        <SmartLink to="/products" className="text-xl mb-6 text-white" onClick={toggleMenu}>Products</SmartLink>
        <SmartLink to="/usecases" className="text-xl mb-6 text-white" onClick={toggleMenu}>Use Cases</SmartLink>
        <SmartLink to="/technology" className="text-xl mb-6 text-white" onClick={toggleMenu}>Technology</SmartLink>
        <SmartLink to="/developers" className="text-xl mb-6 text-white" onClick={toggleMenu}>Developers</SmartLink>
        <SmartLink to="/teer-token" className="text-xl mb-6 text-white" onClick={toggleMenu}>TEER Token</SmartLink>
        <SmartLink to="/about" className="text-xl mb-6 text-white" onClick={toggleMenu}>About</SmartLink>
        <SmartLink to="/blog" className="text-xl mb-6 text-white" onClick={toggleMenu}>Blog</SmartLink>
        <SmartLink to="/contacts" className="text-xl mb-6 text-white" onClick={toggleMenu}>Contacts</SmartLink>
        <a href="https://app.incognitee.io" target="_blank" rel="noopener noreferrer" className="border-2 border-white/20 rounded-lg px-4 py-2 text-white text-center mt-6">Incognitee is live</a>
      </div>
      <div className="mt-8">
        <Socials />
      </div>
    </div>
  );
};

export default Menu;
