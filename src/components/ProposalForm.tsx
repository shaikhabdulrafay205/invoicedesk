import { Plus, Trash2 } from 'lucide-react';
import { ProposalData, Service, Currency } from '../types';

interface ProposalFormProps {
  data: ProposalData;
  onChange: (data: ProposalData) => void;
  onReset: () => void;
}

export const ProposalForm = ({ data, onChange, onReset }: ProposalFormProps) => {
  const updateField = (field: keyof ProposalData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const addService = () => {
    const newService: Service = {
      id: Date.now().toString(),
      name: '',
      quantity: 1,
      price: 0,
    };
    updateField('services', [...data.services, newService]);
  };

  const removeService = (id: string) => {
    updateField(
      'services',
      data.services.filter(s => s.id !== id)
    );
  };

  const updateService = (id: string, field: keyof Service, value: any) => {
    updateField(
      'services',
      data.services.map(s => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Proposal Details</h2>
        <button
          onClick={onReset}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          Reset Form
        </button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">
              Freelancer Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  value={data.freelancerName}
                  onChange={e => updateField('freelancerName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Email *
                </label>
                <input
                  type="email"
                  value={data.freelancerEmail}
                  onChange={e => updateField('freelancerEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Phone
                </label>
                <input
                  type="tel"
                  value={data.freelancerPhone}
                  onChange={e => updateField('freelancerPhone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">
              Client Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Name *
                </label>
                <input
                  type="text"
                  value={data.clientName}
                  onChange={e => updateField('clientName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Acme Corporation"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Email *
                </label>
                <input
                  type="email"
                  value={data.clientEmail}
                  onChange={e => updateField('clientEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="client@acme.com"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">
            Project Details
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Title *
              </label>
              <input
                type="text"
                value={data.projectTitle}
                onChange={e => updateField('projectTitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Website Redesign Project"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Description *
              </label>
              <textarea
                value={data.projectDescription}
                onChange={e => updateField('projectDescription', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the project scope, objectives, and deliverables..."
                required
              />
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700">Services</h3>
            <button
              onClick={addService}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              Add Service
            </button>
          </div>
          <div className="space-y-3">
            {data.services.map((service, index) => (
              <div
                key={service.id}
                className="grid grid-cols-12 gap-3 p-4 bg-gray-50 rounded-md border border-gray-200"
              >
                <div className="col-span-12 md:col-span-5">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Service Name
                  </label>
                  <input
                    type="text"
                    value={service.name}
                    onChange={e => updateService(service.id, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Web Design"
                  />
                </div>
                <div className="col-span-5 md:col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={service.quantity}
                    onChange={e =>
                      updateService(service.id, 'quantity', parseInt(e.target.value) || 1)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div className="col-span-5 md:col-span-3">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Unit Price
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={service.price}
                    onChange={e =>
                      updateService(service.id, 'price', parseFloat(e.target.value) || 0)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div className="col-span-2 md:col-span-2 flex items-end justify-end">
                  <button
                    onClick={() => removeService(service.id)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Remove service"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
            {data.services.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No services added. Click "Add Service" to get started.
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Currency *
            </label>
            <select
              value={data.currency}
              onChange={e => updateField('currency', e.target.value as Currency)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="PKR">PKR (₨)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Terms *
            </label>
            <select
              value={data.paymentTerms}
              onChange={e => updateField('paymentTerms', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select payment terms</option>
              <option value="100% upfront">100% upfront</option>
              <option value="100% on delivery">100% on delivery</option>
              <option value="50% upfront, 50% on delivery">50% upfront, 50% on delivery</option>
              <option value="30% upfront, 70% on delivery">30% upfront, 70% on delivery</option>
              <option value="70% upfront, 30% on delivery">70% upfront, 30% on delivery</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date *
            </label>
            <input
              type="date"
              value={data.dueDate}
              onChange={e => updateField('dueDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Thank You Note
          </label>
          <textarea
            value={data.thankYouNote}
            onChange={e => updateField('thankYouNote', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Thank you for considering this proposal. I look forward to working with you!"
          />
        </div>
      </div>
    </div>
  );
};
