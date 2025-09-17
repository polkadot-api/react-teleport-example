import React from 'react';
import Header from '../Header/index';
import Footer from '../Footer/index';

interface AppWrapperProps {
  children: React.ReactNode;
}

const AppWrapper: React.FC<AppWrapperProps> = ({ children }) => {
  return (
    <div className="wrapper relative overflow-hidden min-h-[120vh]">
      <Header />
      
      {/* Background image container - Only left background kept */}
      <div className="image-wrap absolute top-0 left-0 w-full h-[200vh] overflow-hidden">
        {/* Right background component removed as requested */}
      </div>
      
      {/* Main content */}
      <div className="page-wrapper relative pt-[91px]">
        {children}
      </div>
      
      {/* Bottom background lines */}
      <div className="container relative mx-auto px-4">
        <img 
          src="/img/global/bg-line.png" 
          className="bottom-lines absolute -left-[280px] -top-[1062px] w-[1060px] transform rotate-[159.84deg] scale-x-[-1] z-[-1]
                   lg:w-[1023px] lg:-left-[245px] lg:-top-[992px]
                   md:w-[740px] md:-left-[185px] md:-top-[620px]
                   sm:w-[634px] sm:-left-[115px] sm:-top-[216px]"
          alt="Lines" 
        />
      </div>
      
      <Footer />
    </div>
  );
};

export default AppWrapper;
