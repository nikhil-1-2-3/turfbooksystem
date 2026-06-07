import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { apiConnector } from '../../../services/apiConnector';
import { studentEndpoints } from '../../../services/apis';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const { VERIFY_BOOKING_API } = studentEndpoints;

const QRScanner = () => {
    const [scanResult, setScanResult] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        const scanner = new Html5QrcodeScanner('reader', {
            qrbox: {
                width: 250,
                height: 250,
            },
            fps: 5,
        });

        scanner.render(success, error);

        async function success(result) {
            scanner.clear();
            setScanResult(result);
            await verifyTicket(result);
        }

        function error(err) {
            // Ignore ongoing scan errors (e.g. no code found)
        }

        return () => {
            scanner.clear().catch(error => console.error("Failed to clear scanner", error));
        };
    }, []);

    const verifyTicket = async (bookingToken) => {
        if (!bookingToken) return;
        setIsProcessing(true);
        try {
            const response = await apiConnector("POST", VERIFY_BOOKING_API, { bookingToken }, {
                Authorisation: `Bearer ${token}`
            });

            if (response.data.success) {
                toast.success(response.data.message || "Ticket Verified!");
                setScanResult({
                    status: 'success',
                    data: response.data.data
                });
            }
        } catch (error) {
            const errMsg = error.response?.data?.message || error.message || "Verification Failed";
            toast.error(`Error: ${errMsg}`);
            setScanResult({
                status: 'error',
                message: errMsg
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const resetScanner = () => {
        setScanResult(null);
        window.location.reload(); // Quick way to re-init scanner
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-white mb-6">Scan Digital Ticket</h1>
            
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 max-w-xl mx-auto shadow-2xl">
                {!scanResult ? (
                    <div>
                        <div id="reader" className="overflow-hidden rounded-xl bg-black border-2 border-slate-600"></div>
                        <p className="text-center text-slate-400 mt-4 text-sm">Please allow camera permissions if prompted. Hold the customer's QR code up to the camera.</p>
                    </div>
                ) : (
                    <div className="text-center space-y-6 py-8">
                        {isProcessing ? (
                            <div className="animate-pulse flex flex-col items-center">
                                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="text-blue-400 font-medium">Verifying Ticket with Server...</p>
                            </div>
                        ) : scanResult.status === 'success' ? (
                            <div className="bg-emerald-900/20 border border-emerald-500/50 p-6 rounded-xl">
                                <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                                    <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <h2 className="text-2xl font-bold text-emerald-400 mb-2">Check-In Successful!</h2>
                                
                                <div className="bg-slate-900/50 rounded-lg p-4 mt-6 text-left space-y-3">
                                    <p><span className="text-slate-400">Turf:</span> <strong className="text-white ml-2">{scanResult.data.turfName}</strong></p>
                                    <p><span className="text-slate-400">Date:</span> <strong className="text-white ml-2">{new Date(scanResult.data.bookingDate).toLocaleDateString()}</strong></p>
                                    <p><span className="text-slate-400">Time:</span> <strong className="text-white ml-2">{scanResult.data.time}</strong></p>
                                    {scanResult.data.sport && <p><span className="text-slate-400">Sport:</span> <strong className="text-white ml-2">{scanResult.data.sport}</strong></p>}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-red-900/20 border border-red-500/50 p-6 rounded-xl">
                                <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                                    <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                                </div>
                                <h2 className="text-2xl font-bold text-red-400 mb-2">Verification Failed</h2>
                                <p className="text-red-200">{scanResult.message}</p>
                            </div>
                        )}
                        
                        {!isProcessing && (
                            <button 
                                onClick={resetScanner}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors mt-6 w-full"
                            >
                                Scan Next Ticket
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default QRScanner;
