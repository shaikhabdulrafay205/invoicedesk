import { useState } from 'react';
import { Lock } from 'lucide-react';

interface LicenseKeyScreenProps {
  onSuccess: () => void;
}

export function LicenseKeyScreen({ onSuccess }: LicenseKeyScreenProps) {
  const [licenseKey, setLicenseKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const GUMROAD_PRODUCT_PERMALINK = 'YlmE8G7oWzMth6rUOwAi1g==';
  const TEST_KEY = 'INVOICEDESK-TEST-2024';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const trimmedKey = licenseKey.trim();

      if (!trimmedKey) {
        setError('Please enter a license key');
        setLoading(false);
        return;
      }

      // Test bypass key
      if (trimmedKey === TEST_KEY) {
        localStorage.setItem('invoicedesk_license', trimmedKey);
        onSuccess();
        return;
      }

      // Verify with Gumroad API
      const formData = new URLSearchParams();
      formData.append('product_permalink', GUMROAD_PRODUCT_PERMALINK);
      formData.append('license_key', trimmedKey);

      const response = await fetch('https://api.gumroad.com/v2/licenses/verify', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('invoicedesk_license', trimmedKey);
        onSuccess();
      } else {
        setError('Invalid or expired license key');
        setLicenseKey('');
      }
    } catch (err) {
      setError('Error validating license key. Please check your connection and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 p-4 rounded-full">
            <Lock size={32} className="text-blue-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          InvoiceDesk
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Enter your license key to access the application
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
              placeholder="Enter license key"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {loading ? 'Validating...' : 'Unlock Application'}
          </button>
        </form>

        <p className="text-center text-gray-500 text-xs mt-6">
          Get a license key at <a href="https://gumroad.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">gumroad.com</a>
        </p>
      </div>
    </div>
  );
}
