import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router';
import { Shield, Camera, Check, AlertCircle, Loader2, Video, VideoOff } from 'lucide-react';

export function FaceVerification() {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [cameraPermission, setCameraPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { verifyFace, authStage } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (authStage !== 'face') {
      navigate('/login');
      return;
    }
    checkCameraPermission();
    return () => {
      stopCamera();
    };
  }, [authStage, navigate]);

  const checkCameraPermission = async () => {
    try {
      // Check if Permissions API is available
      if ('permissions' in navigator) {
        const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
        
        if (result.state === 'granted') {
          setCameraPermission('granted');
          startCamera();
        } else if (result.state === 'denied') {
          setCameraPermission('denied');
          setError('Camera access is blocked. Click "Skip & Continue" below to test the platform without camera.');
        } else {
          // Prompt state - automatically request permission
          requestCameraPermission();
        }

        // Listen for permission changes
        result.addEventListener('change', () => {
          if (result.state === 'granted') {
            setCameraPermission('granted');
            setError('');
            startCamera();
          } else if (result.state === 'denied') {
            setCameraPermission('denied');
            setError('Camera access is blocked. Click "Skip & Continue" below to test the platform without camera.');
          }
        });
      } else {
        // Permissions API not available, try to request camera directly
        requestCameraPermission();
      }
    } catch (err) {
      // If permissions API check fails, try to request camera directly
      requestCameraPermission();
    }
  };

  const requestCameraPermission = async () => {
    setIsRequestingPermission(true);
    setError('');
    
    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported in this browser');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        } 
      });
      
      streamRef.current = stream;
      setCameraPermission('granted');
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setCameraPermission('denied');
      
      if (err instanceof Error) {
        // Log error silently for debugging (comment out to hide from console)
        // console.error('Camera Error:', err.name, err.message);
        
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setError('Camera permission was denied. Click "Allow" in your browser, or use "Skip & Continue" below to test without camera.');
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setError('No camera detected. Please connect a camera or use "Skip & Continue" to test the platform.');
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          setError('Camera is in use by another app. Please close other camera apps or use "Skip & Continue".');
        } else if (err.name === 'OverconstrainedError') {
          setError('Camera constraints not supported. Trying with basic settings...');
          // Try again with simpler constraints
          tryBasicCamera();
        } else if (err.message.includes('not supported')) {
          setError('Camera not supported in this browser. Use Chrome, Firefox, Safari, or Edge - or "Skip & Continue" to test.');
        } else {
          setError(`Camera error: ${err.message}. You can use "Skip & Continue" to test the platform.`);
        }
      } else {
        setError('Camera access blocked. Use "Skip & Continue" to test the platform.');
      }
    } finally {
      setIsRequestingPermission(false);
    }
  };

  const tryBasicCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      
      streamRef.current = stream;
      setCameraPermission('granted');
      setError('');
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Basic camera also failed:', err);
    }
  };

  const skipForTesting = () => {
    // Allow user to proceed without camera for testing purposes
    setCameraPermission('granted');
    setError('');
    // Show a message that this is testing mode
    alert('Testing mode: Camera verification skipped. In production, facial verification would be required.');
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        } 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError('Unable to access camera. Please grant camera permissions.');
      setCameraPermission('denied');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleVerify = async () => {
    setStatus('scanning');
    setError('');
    setProgress(0);

    // Simulate facial recognition progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    try {
      const success = await verifyFace();
      clearInterval(interval);

      if (success) {
        setStatus('success');
        setProgress(100);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setStatus('error');
        setError('Face verification failed. Please try again.');
      }
    } catch (err) {
      clearInterval(interval);
      setStatus('error');
      setError('An error occurred during verification.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                <Check className="h-5 w-5 text-white" />
              </div>
              <div className="w-16 sm:w-24 h-1 bg-green-600"></div>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                <Check className="h-5 w-5 text-white" />
              </div>
              <div className="w-16 sm:w-24 h-1 bg-green-600"></div>
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">3</span>
            </div>
          </div>
          <div className="flex justify-center gap-4 sm:gap-12 mt-2 text-xs text-gray-600">
            <span>Login</span>
            <span>OTP</span>
            <span className="font-medium text-blue-600">Face ID</span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Facial Verification</h1>
          <p className="text-gray-600">Position your face within the frame for biometric verification</p>
        </div>

        {/* Camera Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-800">{error}</p>
                {cameraPermission === 'denied' && (
                  <div className="mt-3 p-3 bg-white rounded border border-red-100">
                    <p className="text-xs font-medium text-red-900 mb-2">💡 How to enable camera:</p>
                    <ul className="text-xs text-red-800 space-y-1">
                      <li>• Look for a camera icon 🎥 in your browser's address bar</li>
                      <li>• Click it and select "Allow" or "Always allow"</li>
                      <li>• Click "Enable Camera" button below to try again</li>
                      <li>• Or use "Skip & Continue" to test without camera</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-900">Verification Successful!</p>
                <p className="text-xs text-green-700 mt-1">Redirecting to dashboard...</p>
              </div>
            </div>
          )}

          {/* Camera View */}
          <div className="relative mb-6 bg-gray-900 rounded-xl overflow-hidden aspect-[4/3]">
            {/* Camera Permission Pending Overlay */}
            {cameraPermission === 'pending' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 z-10">
                <Video className="h-16 w-16 text-blue-400 mb-4 animate-pulse" />
                <p className="text-white font-medium mb-2">Requesting Camera Permission</p>
                <p className="text-gray-400 text-sm text-center px-4">
                  Please allow camera access when prompted by your browser
                </p>
              </div>
            )}

            {/* Camera Permission Denied Overlay */}
            {cameraPermission === 'denied' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 z-10 px-6">
                <VideoOff className="h-16 w-16 text-red-400 mb-4" />
                <p className="text-white font-medium mb-2 text-center">Camera Access Required</p>
                <p className="text-gray-400 text-sm text-center mb-6">
                  Please grant camera permission to continue with face verification
                </p>
                <button
                  onClick={requestCameraPermission}
                  disabled={isRequestingPermission}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  {isRequestingPermission ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Requesting...
                    </>
                  ) : (
                    <>
                      <Video className="h-4 w-4" />
                      Enable Camera
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-500 mt-4 text-center">
                  If the button doesn't work, check your browser's address bar for permission settings
                </p>
                <button
                  onClick={skipForTesting}
                  className="mt-4 text-sm text-gray-400 hover:text-white underline"
                >
                  Skip for Testing (Not for Production)
                </button>
              </div>
            )}

            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />

            {/* Face Detection Overlay - Only show when camera is granted */}
            {cameraPermission === 'granted' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`w-64 h-80 border-4 rounded-3xl transition-colors ${
                  status === 'scanning'
                    ? 'border-blue-500 animate-pulse'
                    : status === 'success'
                    ? 'border-green-500'
                    : status === 'error'
                    ? 'border-red-500'
                    : 'border-white/50'
                }`}>
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-current rounded-tl-3xl"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-current rounded-tr-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-current rounded-bl-3xl"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-current rounded-br-3xl"></div>
                </div>
              </div>
            )}

            {/* Status Badge */}
            <div className="absolute top-4 right-4">
              {status === 'scanning' && (
                <div className="bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm font-medium">Scanning... {progress}%</span>
                </div>
              )}
              {status === 'success' && (
                <div className="bg-green-600 text-white px-4 py-2 rounded-full flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  <span className="text-sm font-medium">Verified</span>
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          {status === 'scanning' && (
            <div className="mb-6">
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-900 mb-2">Instructions:</p>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Ensure your face is well-lit and clearly visible</li>
              <li>• Remove any face coverings (glasses are okay)</li>
              <li>• Look directly at the camera</li>
              <li>• Keep your face within the frame</li>
            </ul>
          </div>

          <button
            onClick={handleVerify}
            disabled={status === 'scanning' || status === 'success' || cameraPermission !== 'granted'}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            {status === 'scanning' ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Verifying Face...
              </>
            ) : status === 'success' ? (
              <>
                <Check className="h-5 w-5" />
                Verified Successfully
              </>
            ) : cameraPermission !== 'granted' ? (
              <>
                <VideoOff className="h-5 w-5" />
                Camera Access Required
              </>
            ) : (
              <>
                <Camera className="h-5 w-5" />
                Start Face Verification
              </>
            )}
          </button>

          {/* Skip Button for Testing - Show when camera is denied */}
          {cameraPermission === 'denied' && (
            <button
              onClick={skipForTesting}
              className="w-full mt-3 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Check className="h-5 w-5" />
              Skip & Continue (Testing Mode)
            </button>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-xs text-gray-600 space-y-2">
              <p className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span>Your biometric data is encrypted and secure</span>
              </p>
              <p className="text-gray-500">
                We use advanced facial recognition to prevent voter impersonation.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/auth/otp')}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Back to OTP verification
          </button>
        </div>
      </div>
    </div>
  );
}