import { useState } from "react";
import QrScanner from "./pages/qr-scanner/qr-scanner";

const App: React.FC = () => {
  const [scannedCode, setScannedCode] = useState<string>("");

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">QR Code Scanner PWA</h1>
      <QrScanner onDetected={(code) => setScannedCode(code)} />
      {scannedCode && (
        <p className="mt-4 text-green-600">Scanned: {scannedCode}</p>
      )}
    </div>
  );
};

export default App;
