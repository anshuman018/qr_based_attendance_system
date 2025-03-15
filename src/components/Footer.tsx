import React from 'react';
import { Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white py-4 border-t text-center text-xs text-gray-500">
      <div className="container mx-auto px-4">
        <p>QR Check-In | Smart Attendance System</p>
        <div className="flex items-center justify-center mt-1">
          <span>Developed by Anshuman Singh</span>
          <a 
            href="https://github.com/anshuman018" 
            target="_blank" 
            rel="noopener noreferrer"
            className="ml-2 text-gray-600 hover:text-gray-900"
          >
            <Github className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;