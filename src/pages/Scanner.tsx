import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { Upload, Check, Camera, ArrowRight, AlertTriangle } from 'lucide-react';

// Define UserData interface that matches your database schema
interface UserData {
  id: string;
  name: string;
  phone: string;
  payment_status: boolean;
  checked_in: boolean;
  check_in_time: string | null;
  qr_code: string;
  [key: string]: any;
}

interface QRCodeData {
  userId: string;
  name?: string;
  timestamp?: number;
}

const Scanner = () => {
  const [scanning, setScanning] = useState(true);
  const [userInfo, setUserInfo] = useState<UserData | null>(null);
  const [uploadedQrData, setUploadedQrData] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [securityWarning, setSecurityWarning] = useState(false);
  const [recentlyScannedQRs] = useState<Set<string>>(new Set());
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const qrReaderRef = useRef(null);

  const processQrData = async (decodedText: string): Promise<void> => {
    try {
      console.log("Processing QR data:", decodedText);
      
      // Parse the QR code data
      let qrData: QRCodeData;
      try {
        qrData = JSON.parse(decodedText);
      } catch (e) {
        console.error("QR parsing error:", e);
        toast.error("Invalid QR code format");
        return;
      }
      
      // Enhanced validation
      if (!qrData.userId) {
        toast.error("Invalid QR code: missing user ID");
        return;
      }

      // Security check - detect if this QR was recently scanned
      if (recentlyScannedQRs.has(qrData.userId)) {
        setSecurityWarning(true);
        toast.error("Security Alert: This QR code was recently scanned!", { duration: 5000 });
        return;
      }
      
      // Check if user exists and mark attendance
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', qrData.userId)
        .single();
        
      if (userError || !user) {
        console.error("User lookup error:", userError);
        toast.error("Attendee not found in the system");
        return;
      }
      
      // Verify name if available in QR (extra security)
      if (qrData.name && qrData.name !== user.name) {
        console.warn("QR name doesn't match database name");
        toast("Note: Name in QR code doesn't match our records", { 
          icon: '⚠️',
          style: { background: '#FFF3CD', color: '#856404' }
        });
      }
      
      // Check if already checked in
      if (user.checked_in) {
        // Add the QR to recently scanned list for security tracking
        recentlyScannedQRs.add(qrData.userId);
        
        // Security warning - this might be a shared QR code
        toast.error("⚠️ WARNING: This attendee has already checked in!", { 
          duration: 5000,
          icon: '🚫',
          style: { background: '#F8D7DA', color: '#721C24', fontWeight: 'bold' }
        });
        
        // Still display the info but with warning
        setSecurityWarning(true);
        setUserInfo(user as UserData);
        return;
      }
      
      // Update check-in status
      const now = new Date().toISOString();
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          checked_in: true,
          check_in_time: now
        })
        .eq('id', qrData.userId);
        
      if (updateError) {
        console.error("Update error:", updateError);
        toast.error("Failed to mark attendance");
        return;
      }
      
      // Add to recently scanned list
      recentlyScannedQRs.add(qrData.userId);
      
      // Update the user info with the check-in time
      const updatedUser = {
        ...user,
        checked_in: true,
        check_in_time: now
      };
      
      // Success!
      toast.success(`${user.name} marked as present!`);
      setUserInfo(updatedUser as UserData);
      setSecurityWarning(false);
      
    } catch (error: any) {
      console.error("QR processing error:", error);
      toast.error(`Error: ${error.message || 'Failed to process QR'}`);
    }
  };

  const startScanner = () => {
    if (!scannerRef.current || !scanning) return;

    const qrCodeSuccessCallback = async (decodedText: string): Promise<void> => {
      // Temporarily stop scanning
      setScanning(false);
      if (scannerRef.current && 
          scannerRef.current.getState() !== Html5QrcodeScannerState.NOT_STARTED) {
        await scannerRef.current.stop();
      }
      
      await processQrData(decodedText);
      
      // Restart scanning after a delay
      setTimeout(() => {
        setScanning(true);
        if (qrReaderRef.current) startScanner();
      }, 3000);
    };

    const config = { fps: 10, qrbox: 250 };
    
    scannerRef.current.start(
      { facingMode: "environment" }, 
      config,
      qrCodeSuccessCallback,
      (errorMessage) => {
        console.log(errorMessage);
      }
    ).catch((err) => {
      console.error("Scanner start error:", err);
      toast.error("Failed to start camera");
    });
  };

  useEffect(() => {
    // Initialize scanner when component mounts
    if (!scannerRef.current && qrReaderRef.current) {
      scannerRef.current = new Html5Qrcode("qr-reader");
      startScanner();
    }

    // Cleanup function to stop scanner when component unmounts
    return () => {
      if (scannerRef.current && 
          scannerRef.current.getState() !== Html5QrcodeScannerState.NOT_STARTED) {
        scannerRef.current.stop().catch(err => console.error("Failed to stop scanner:", err));
      }
    };
  }, []);

  // Add file upload option as fallback
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setSelectedFile(file);
    
    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode("qr-reader");
    }
    
    try {
      // Stop camera scanner if running
      if (scannerRef.current.getState() !== Html5QrcodeScannerState.NOT_STARTED) {
        await scannerRef.current.stop();
        setScanning(false);
      }
      
      // Process the file
      const result = await scannerRef.current.scanFile(file, true);
      console.log("File scan result:", result);
      setUploadedQrData(result);
      
    } catch (error) {
      console.error("File scan error:", error);
      toast.error("Couldn't read QR code from image");
    }
  };

  const processUploadedQR = async () => {
    if (!uploadedQrData) {
      toast.error("No QR code found in the uploaded image");
      return;
    }
    
    await processQrData(uploadedQrData);
  };

  const restartCamera = () => {
    setUploadedQrData(null);
    setSelectedFile(null);
    setSecurityWarning(false);
    setUserInfo(null);
    setScanning(true);
    startScanner();
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Scan Attendee QR Code</h1>
      
      <div className="bg-white shadow-md rounded-lg p-4">
        {/* Camera scanner section */}
        {scanning && !uploadedQrData && (
          <>
            <div id="qr-reader" ref={qrReaderRef} className="w-full h-64 mb-4 relative"></div>
            <div className="text-center text-sm text-gray-500 mb-2">
              Scanning for QR code...
            </div>
          </>
        )}
        
        {/* File upload section - Improved for mobile */}
        <div className={`mt-3 ${uploadedQrData ? 'border-t pt-3' : ''}`}>
          {!uploadedQrData ? (
            <div className="flex flex-col space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Or upload QR code image:
              </label>
              
              <label 
                htmlFor="file-upload" 
                className="cursor-pointer w-full bg-blue-50 hover:bg-blue-100 
                  text-blue-700 font-medium py-2 px-4 rounded-md flex items-center justify-center"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose Image
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              {selectedFile && (
                <p className="text-xs text-gray-500 truncate text-center mt-1">
                  {selectedFile.name}
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">QR code detected!</span>
                <button
                  onClick={restartCamera}
                  className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center"
                >
                  <Camera className="h-3 w-3 mr-1" />
                  Back to camera
                </button>
              </div>
              
              <div className="flex items-center">
                <span className="text-sm text-gray-500 truncate flex-1">
                  {selectedFile?.name || 'QR code image'}
                </span>
              </div>
              
              <button
                onClick={processUploadedQR}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md flex items-center justify-center text-sm"
              >
                <Check className="h-4 w-4 mr-2" />
                Process QR Code
              </button>
            </div>
          )}
        </div>
        
        {/* Security Warning */}
        {securityWarning && (
          <div className="mt-4 p-3 bg-red-50 border border-red-300 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0" />
              <div>
                <h3 className="text-base font-bold text-red-700">Security Alert</h3>
                <p className="text-sm text-red-700 mt-1">
                  This QR code has already been used for check-in. 
                  This may be a duplicate or shared QR code.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* User info section */}
        {userInfo && (
          <div className={`mt-4 p-3 ${securityWarning ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'} border rounded-lg`}>
            <h2 className={`text-lg font-semibold ${securityWarning ? 'text-red-800' : 'text-green-800'}`}>
              Attendee Information
              {securityWarning && ' - ALREADY CHECKED IN'}
            </h2>
            <div className="mt-2 space-y-1 text-sm">
              <p><strong>Name:</strong> {userInfo.name}</p>
              <p><strong>Phone:</strong> {userInfo.phone}</p>
              <p>
                <strong>Payment Status:</strong> 
                <span className={userInfo.payment_status ? 'text-green-600' : 'text-red-600'}>
                  {userInfo.payment_status ? ' Paid' : ' Pending'}
                </span>
              </p>
              <p className={`font-bold mt-2 ${securityWarning ? 'text-red-600' : 'text-green-600'}`}>
                {userInfo.checked_in ? 
                  `Checked In at ${new Date(userInfo.check_in_time || '').toLocaleString()}` : 
                  'Not Checked In'}
              </p>
            </div>
            
            <button 
              onClick={restartCamera}
              className={`mt-3 w-full ${securityWarning ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white py-2 px-4 rounded-md flex items-center justify-center text-sm`}
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              {securityWarning ? 'Dismiss Warning' : 'Scan Next Attendee'}
            </button>
          </div>
        )}
        
        {!scanning && !userInfo && !uploadedQrData && (
          <div className="mt-4 text-center text-sm text-gray-500">
            Processing...
          </div>
        )}
      </div>
    </div>
  );
};

export default Scanner;
