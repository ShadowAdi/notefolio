import {
  defaultLegalLinks,
  defaultSections,
  defaultSocialLinks,
} from "@/data/Hero/FooterData";
import { FooterProps } from "@/types/Hero/FooterProps";
import React from "react";

const Footer = ({
  logo = {
    url: "https://shadowadi.github.io/WebDev_Portfolio/",
    title: "Portfolio",
  },
  description = "This is  a blog app created by Aditya Shukla❣️",
  socialLinks = defaultSocialLinks,
  copyright = "© 2025 Aditya Shukla. All rights reserved.",
  legalLinks = defaultLegalLinks,
}: FooterProps) => {
  return (
    <footer className="py-32">
      <div className="container">
        <div className="flex w-full flex-col justify-between gap-10 lg:flex-row lg:items-start lg:text-left">
          <div className="flex w-full flex-col justify-between gap-6 lg:items-start">
            <h2 className="text-xl font-semibold">{logo.title}</h2>

            <p className="text-muted-foreground max-w-[70%] text-sm">
              {description}
            </p>
            <ul className="text-muted-foreground flex items-center space-x-6">
              {socialLinks.map((social, idx) => (
                <li key={idx} className="hover:text-primary font-medium">
                  <a href={social.href} aria-label={social.label}>
                    {social.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="text-muted-foreground mt-8 flex flex-col justify-between gap-4 border-t py-8 text-xs font-medium md:flex-row md:items-center md:text-left">
          <p className="order-2 lg:order-1">{copyright}</p>
          <ul className="order-1 flex flex-col gap-2 md:order-2 md:flex-row">
            {legalLinks.map((link, idx) => (
              <li key={idx} className="hover:text-primary">
                <a href={link.href}> {link.name}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
