import React, { useState, useEffect } from "react";
import { Footer, FooterBrand, FooterCopyright, FooterDivider, FooterLink, FooterLinkGroup } from "flowbite-react";
import { useNavigate } from 'react-router-dom';

export const YabrFooter = () => {
  const navigate = useNavigate();

  return (
    <Footer container className="rounded-none rounded-b-lg">
    <div className="w-full text-center">
      <div className="w-full justify-between sm:flex sm:items-center sm:justify-between">
        <Footer.Brand
          src="/assets/logo.png"
          alt="Yet Another Book Review Logo"
          name="YABR"
        />
        <Footer.LinkGroup>
          <Footer.Link href="#" onClick={() => navigate('/about')}>About</Footer.Link>
          <Footer.Link href="#" onClick={() => navigate('/privacy')}>Privacy Policy</Footer.Link>
          <Footer.Link href="#" onClick={() => navigate('/terms')}>Terms and Conditions</Footer.Link>
          <Footer.Link href="#" onClick={() => navigate('/contact')}>Contact</Footer.Link>
        </Footer.LinkGroup>
      </div>
      <Footer.Divider />
      <Footer.Copyright href="https://www.linkedin.com/in/mikekruger" by="Mike Kruger" year={2024} />
    </div>
  </Footer>
  );
};
