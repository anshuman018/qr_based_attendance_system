import React from 'react';
import { Heart, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white py-6 border-t">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600">
              <span className="font-medium">QR Check-In</span> | Smart Attendance System
            </p>
          </div>
          
          <div className="flex items-center">
            <p className="text-sm text-gray-600 flex items-center">
              Developed with <Heart className="h-4 w-4 mx-1 text-red-500" fill="currentColor" /> by 
              <span className="font-medium ml-1">Anshuman Singh</span>
            </p>
            <a 
              href="https://github.com/anshumansinghtfw" 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-4 text-gray-600 hover:text-gray-900"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;