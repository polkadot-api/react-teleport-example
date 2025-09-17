// Configuration for domain and paths

// Base domain for the main Integritee website
export const MAIN_DOMAIN = 'https://integritee.network';

// Function to create absolute URLs for routes that should point to the main domain
export const getMainDomainUrl = (path: string): string => {
  // Ensure path starts with '/'
  const formattedPath = path.startsWith('/') ? path : `/${path}`;
  return `${MAIN_DOMAIN}${formattedPath}`;
};

// Config to determine if a route should go to the main domain
export const shouldRedirectToMainDomain = (path: string): boolean => {
  // List of paths that should stay on the subdomain (TEER bridge tool)
  const localPaths = [
    '/',                // Home page of the bridge tool
    '/bridge',          // Bridge functionality
    '/settings',        // Any settings pages
    '/transactions',    // Transaction history
  ];
  
  return !localPaths.some(localPath => 
    path === localPath || path.startsWith(`${localPath}/`)
  );
};
