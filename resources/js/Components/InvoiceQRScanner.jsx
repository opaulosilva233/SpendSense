import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import Modal from '@/Components/Modal';
import { X } from 'lucide-react';

export default function InvoiceQRScanner({ show, onClose, onScan }) {
    const [error, setError] = useState(null);
    const scannerRef = useRef(null);
    const html5QrCode = useRef(null);

    useEffect(() => {
        if (show) {
            startScanner();
        } else {
            stopScanner();
        }

        return () => {
            stopScanner();
        };
    }, [show]);

    const startScanner = async () => {
        try {
            setError(null);
            
            // Wait for the modal and DOM element to fully render
            setTimeout(async () => {
                if (!scannerRef.current) return;
                
                html5QrCode.current = new Html5Qrcode(scannerRef.current.id);
                
                // Get cameras
                const devices = await Html5Qrcode.getCameras();
                if (devices && devices.length) {
                    const cameraId = devices.length > 1 ? { facingMode: "environment" } : devices[0].id;
                    
                    const scanSize = Math.min(window.innerWidth - 120, 260);

                    await html5QrCode.current.start(
                        cameraId,
                        {
                            fps: 10,
                            qrbox: { width: scanSize, height: scanSize },
                            aspectRatio: window.innerWidth < 640 ? 1.2 : 1.0,
                        },
                        (decodedText) => {
                            if (decodedText) {
                                stopScanner();
                                onScan(decodedText);
                                onClose();
                            }
                        },
                        (errorMessage) => {
                            // Ignored (usually just "QR code not found")
                        }
                    );
                } else {
                    setError('Nenhuma câmara encontrada no dispositivo.');
                }
            }, 100);
            
        } catch (err) {
            console.error('Error starting scanner:', err);
            setError('Não foi possível aceder à câmara. Verifique as permissões.');
        }
    };

    const stopScanner = () => {
        if (html5QrCode.current && html5QrCode.current.isScanning) {
            html5QrCode.current.stop()
                .then(() => {
                    html5QrCode.current.clear();
                    html5QrCode.current = null;
                })
                .catch(err => console.error('Failed to stop scanner.', err));
        }
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="sm">
            <div className="p-4 sm:p-6 dark:bg-[#0a0a0a]">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                        Ler QR Code Fatura
                    </h3>
                    <button 
                        onClick={onClose}
                        className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                    >
                        <X className="h-6 w-6" strokeWidth={2} />
                    </button>
                </div>
                
                {error ? (
                    <div className="p-4 rounded-xl bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 text-sm">
                        {error}
                    </div>
                ) : (
                    <div className="relative overflow-hidden rounded-2xl bg-black h-56 sm:h-auto sm:aspect-square">
                        <div id="qr-reader" ref={scannerRef} className="w-full h-full" />
                        <div className="absolute inset-0 border-[6px] border-black/20 pointer-events-none rounded-2xl z-10" />
                    </div>
                )}
                
                <p className="mt-4 text-sm text-center text-zinc-500 dark:text-zinc-400">
                    Aponte a câmara para o QR Code da fatura com NIF (formato standard AT PT).
                </p>
            </div>
        </Modal>
    );
}
