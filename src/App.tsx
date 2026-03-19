import { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import { ProposalForm } from './components/ProposalForm';
import { PDFPreview } from './components/PDFPreview';
import { LicenseKeyScreen } from './components/LicenseKeyScreen';
import { ProposalData } from './types';

const getInitialData = (): ProposalData => ({
  freelancerName: '',
  freelancerEmail: '',
  freelancerPhone: '',
  clientName: '',
  clientEmail: '',
  projectTitle: '',
  projectDescription: '',
  services: [],
  currency: 'USD',
  paymentTerms: '50% upfront, 50% on delivery',
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  thankYouNote: 'Thank you for considering this proposal. I look forward to working with you!',
});

function App() {
  const [proposalData, setProposalData] = useState<ProposalData>(getInitialData());
  const [isLicensed, setIsLicensed] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const storedLicense = localStorage.getItem('invoicedesk_license');
    if (storedLicense) {
      setIsLicensed(true);
    }
    setIsChecking(false);
  }, []);

  const handleLicenseSuccess = () => {
    setIsLicensed(true);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset the form? All data will be lost.')) {
      setProposalData(getInitialData());
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!isLicensed) {
    return <LicenseKeyScreen onSuccess={handleLicenseSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-gray-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <FileText size={32} className="text-blue-400" />
            <div>
              <h1 className="text-3xl font-bold">InvoiceDesk</h1>
              <p className="text-gray-300 text-sm">
                Official Project Proposal & Invoice
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <ProposalForm
              data={proposalData}
              onChange={setProposalData}
              onReset={handleReset}
            />
          </div>
          <div className="lg:sticky lg:top-8 lg:self-start">
            <PDFPreview data={proposalData} />
          </div>
        </div>
      </div>

      <footer className="bg-gray-800 text-gray-400 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm">
          <p>InvoiceDesk - Empowering freelancers with professional proposal generation</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
