import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full light-navbar border mt-8 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">
              About
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link
                  to="#"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">
              Support
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link
                  to="#"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  Safety Center
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  Community Guidelines
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">
              Legal
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link
                  to="#"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">
              Connect
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link
                  to="#"
                  className="text-base text-gray-500 hover:text-gray-900 flex items-center"
                >
                  <Facebook className="h-5 w-5 mr-2" />
                  Facebook
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-base text-gray-500 hover:text-gray-900 flex items-center"
                >
                  <Twitter className="h-5 w-5 mr-2" />
                  Twitter
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-base text-gray-500 hover:text-gray-900 flex items-center"
                >
                  <Instagram className="h-5 w-5 mr-2" />
                  Instagram
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-base text-gray-500 hover:text-gray-900 flex items-center"
                >
                  <Github className="h-5 w-5 mr-2" />
                  GitHub
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8 flex justify-between items-center">
          <p className="text-base text-gray-400">
            &copy; 2024 KnowledgeChain. All rights reserved.
          </p>
          <img
            src="../../assets/Logo.svg"
            alt="KnowledgeChain Logo"
            className="h-8 w-auto"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
