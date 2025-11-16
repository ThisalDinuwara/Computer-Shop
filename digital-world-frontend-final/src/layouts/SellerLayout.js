import React from 'react';
import SellerNavbar from '../components/SellerNavbar';

const SellerLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <SellerNavbar />
      <main className="flex-grow">{children}</main>
    </div>
  );
};

export default SellerLayout;
