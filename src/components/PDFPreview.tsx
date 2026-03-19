import { useEffect, useState } from 'react';
import { Download, FileText } from 'lucide-react';
import { ProposalData, CURRENCY_SYMBOLS } from '../types';
import { generateProposalPDF } from '../utils/pdfGenerator';

interface PDFPreviewProps {
  data: ProposalData;
}

export const PDFPreview = ({ data }: PDFPreviewProps) => {
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    try {
      const doc = generateProposalPDF(data);
      const blob = doc.output('blob');
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    } catch (error) {
      console.error('Error generating PDF preview:', error);
    }

    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [data]);

  const handleDownload = () => {
    try {
      const doc = generateProposalPDF(data);
      const fileName = `proposal_${data.projectTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  const calculateTotal = () => {
    return data.services.reduce((sum, service) => sum + service.quantity * service.price, 0);
  };

  const currencySymbol = CURRENCY_SYMBOLS[data.currency];
  const total = calculateTotal();

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <FileText className="text-blue-600" size={24} />
            <h2 className="text-2xl font-bold text-gray-800">Preview</h2>
          </div>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors font-medium shadow-sm"
          >
            <Download size={18} />
            Download PDF
          </button>
        </div>

        <div className="mb-4 p-4 bg-blue-50 rounded-md border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Total Amount</p>
              <p className="text-2xl font-bold text-blue-600">
                {currencySymbol}
                {total.toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                {data.services.length} {data.services.length === 1 ? 'service' : 'services'}
              </p>
              <p className="text-sm text-gray-600">Due: {data.dueDate || 'Not set'}</p>
            </div>
          </div>
        </div>

        {previewUrl ? (
          <div className="border border-gray-300 rounded-md overflow-hidden shadow-inner bg-gray-100">
            <iframe
              src={previewUrl}
              className="w-full h-[700px]"
              title="PDF Preview"
            />
          </div>
        ) : (
          <div className="border border-gray-300 rounded-md p-12 text-center bg-gray-50">
            <FileText className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-500">Fill out the form to see a preview</p>
          </div>
        )}
      </div>
    </div>
  );
};
