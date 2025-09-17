import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { getMainDomainUrl, shouldRedirectToMainDomain } from '../../configs/url.config';

interface SmartLinkProps extends Omit<LinkProps, 'to'> {
  to: string;
  className?: string;
}

/**
 * SmartLink component that automatically determines if a link should go to the main domain
 * or stay on the current subdomain based on the path.
 */
const SmartLink: React.FC<SmartLinkProps> = ({ to, children, className, ...props }) => {
  // If the link should redirect to the main domain
  if (shouldRedirectToMainDomain(to)) {
    const mainDomainUrl = getMainDomainUrl(to);
    
    return (
      <a 
        href={mainDomainUrl} 
        className={className} 
        target="_self" // Open in the same tab by default
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  }
  
  // Otherwise, use React Router Link for local navigation
  return (
    <Link to={to} className={className} {...props}>
      {children}
    </Link>
  );
};

export default SmartLink;
