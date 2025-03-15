import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import toast from 'react-hot-toast';
import { Save, Loader, Download } from 'lucide-react';

const AddUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    payment_status: false
  });
  const [loading, setLoading] = useState(false);
  const [qrCodeData, setQRCodeData] = useState<string | null>(null);
  const [userName, setUserName] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create QR data
      const userId = crypto.randomUUID();
      const qrData = JSON.stringify({
        userId,
        name: formData.name,
        timestamp: Date.now()
      });

      // Insert into Supabase
      const { error } = await supabase.from('users').insert({
        id: userId,
        name: formData.name,
        phone: formData.phone,
        payment_status: formData.payment_status,
        qr_code: qrData,
        checked_in: false
      });

      if (error) throw error;

      // Set QR code data for display
      setQRCodeData(qrData);
      setUserName(formData.name);
      toast.success('Attendee added successfully!');
      
      // Reset form after successful submission
      setFormData({
        name: '',
        phone: '',
        payment_status: false
      });
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Failed to add attendee. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = () => {
    if (!qrCodeData || !userName) return;
    
    const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement;
    if (!canvas) {
      // If canvas isn't directly accessible, we need to create one
      const svgElement = document.getElementById('qr-code-svg');
      if (!svgElement) return;
      
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        downloadFromCanvas(canvas);
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
      return;
    }
    
    downloadFromCanvas(canvas);
  };
  
  const downloadFromCanvas = (canvas: HTMLCanvasElement) => {
    const sanitizedName = userName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const dataURL = canvas.toDataURL('image/png');
    
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = `qr_${sanitizedName}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Attendee</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number*
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="payment_status"
              name="payment_status"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              checked={formData.payment_status}
              onChange={handleInputChange}
            />
            <label htmlFor="payment_status" className="ml-2 block text-sm text-gray-900">
              Payment Received
            </label>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin h-5 w-5 mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Save Attendee
                </>
              )}
            </button>
          </div>
        </form>

        {qrCodeData && (
          <div className="mt-8 p-6 border-t border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Generated QR Code for {userName}</h2>
            <div className="flex flex-col items-center space-y-4">
              <QRCodeCanvas 
                id="qr-canvas"
                value={qrCodeData} 
                size={200} 
                level="H" 
                includeMargin={true}
              />
              <p className="text-sm text-gray-500">
                This QR code is unique to the attendee. Save or print it for check-in.
              </p>
              <button
                onClick={downloadQR}
                className="flex items-center bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                <Download className="h-5 w-5 mr-2" />
                Download QR Code
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddUser;