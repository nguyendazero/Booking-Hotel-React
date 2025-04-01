import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-purple-700 text-gray-200 py-10">
      <div className="container mx-auto px-6">
        
        <div className="flex flex-col items-center text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-100">.fis</h1>
          <p className="mt-2 text-sm">
            Making the world a better place through constructing elegant hierarchies.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left mb-8 max-w-4xl mx-auto">
          <div>
            <h2 className="font-bold text-lg mb-2">Solutions</h2>
            <ul>
              <li className="hover:text-purple-400 cursor-pointer">Marketing</li>
              <li className="hover:text-purple-400 cursor-pointer">Analytics</li>
              <li className="hover:text-purple-400 cursor-pointer">Automation</li>
              <li className="hover:text-purple-400 cursor-pointer">Commerce</li>
            </ul>
          </div>

          <div>
            <h2 className="font-bold text-lg mb-2">Support</h2>
            <ul>
              <li className="hover:text-purple-400 cursor-pointer">Submit Ticket</li>
              <li className="hover:text-purple-400 cursor-pointer">Documentation</li>
              <li className="hover:text-purple-400 cursor-pointer">Guides</li>
            </ul>
          </div>

          <div>
            <h2 className="font-bold text-lg mb-2">Company</h2>
            <ul>
              <li className="hover:text-purple-400 cursor-pointer">About</li>
              <li className="hover:text-purple-400 cursor-pointer">Blog</li>
              <li className="hover:text-purple-400 cursor-pointer">Jobs</li>
              <li className="hover:text-purple-400 cursor-pointer">Press</li>
            </ul>
          </div>

          <div>
            <h2 className="font-bold text-lg mb-2">Legal</h2>
            <ul>
              <li className="hover:text-purple-400 cursor-pointer">Terms of Service</li>
              <li className="hover:text-purple-400 cursor-pointer">Privacy Policy</li>
              <li className="hover:text-purple-400 cursor-pointer">License</li>
              <li className="hover:text-purple-400 cursor-pointer">Insights</li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm">© 2024 Your Company, Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
