import React, { useState, useEffect } from "react";
import { Footer, FooterBrand, FooterCopyright, FooterDivider, FooterLink, FooterLinkGroup } from "flowbite-react";

export const YabrFooter = () => {
  return (
    <Footer container className="rounded-none rounded-b-lg">
    <div className="w-full text-center">
      <div className="w-full justify-between sm:flex sm:items-center sm:justify-between">
        <Footer.Brand
          src="/src/assets/logo.png"
          alt="Yet Another Book Review Logo"
          name="YABR"
        />
        <Footer.LinkGroup>
          <Footer.Link href="/about">About</Footer.Link>
          <Footer.Link href="/privacy">Privacy Policy</Footer.Link>
          <Footer.Link href="/terms">Terms and Conditions</Footer.Link>
          <Footer.Link href="/contact">Contact</Footer.Link>
        </Footer.LinkGroup>
      </div>
      <Footer.Divider />
      <Footer.Copyright href="https://www.linkedin.com/in/mikekruger" by="Mike Kruger" year={2024} />
    </div>
  </Footer>
  );
};
