import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import {
  Download,
  FileText,
  DollarSign,
  Wallet,
  TrendingUp,
  Calendar,
} from 'lucide-react';

const DATE_RANGES = [
  { value: 'this_month', label: 'This Month' },
  { value: 'last_month', label: 'Last Month' },
  { value: 'last_30_days', label: 'Last 30 Days' },
  { value: 'last_7_days', label: 'Last 7 Days' },
  { value: 'this_year', label: 'This Year' },
  { value: 'last_year', label: 'Last Year' },
];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('this_month');
  const [activeTab, setActiveTab] = useState<'revenue' | 'expenses' | 'cash-flow'>('revenue');

  const { data: revenueReport, isLoading: revenueLoading } = useQuery({
    queryKey: ['reports-revenue', dateRange],
    queryFn: async () => {
      const response = await api.get('/reports/revenue', {
        params: { range: dateRange },
      });
      return response.data;
    },
  });

  const { data: expensesReport, isLoading: expensesLoading } = useQuery({
    queryKey: ['reports-expenses', dateRange],
    queryFn: async () => {
      const response = await api.get('/reports/expenses', {
        params: { range: dateRange },
      });
      return response.data;
    },
  });

  const { data: cashFlowReport, isLoading: cashFlowLoading } = useQuery({
    queryKey: ['reports-cash-flow', dateRange],
    queryFn: async () => {
      const response = await api.get('/reports/cash-flow', {
        params: { range: dateRange },
      });
      return response.data;
    },
  });

  const handleExport = async (report: string, format: 'csv' | 'pdf') => {
    const url = `/api/reports/${report}/export/${format}`;
    const link = document.createElement('a');
    link.href = `${url}?range=${dateRange}`;
    link.download = `${report}-report-${dateRange}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600 mt-1">Financial reports and analytics</p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          {DATE_RANGES.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex gap-4 px-6">
            <button
              onClick={() => setActiveTab('revenue')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'revenue'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Revenue
            </button>
            <button
              onClick={() => setActiveTab('expenses')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'expenses'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Expenses
            </button>
            <button
              onClick={() => setActiveTab('cash-flow')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'cash-flow'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Cash Flow
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'revenue' && (
            <RevenueReport
              data={revenueReport}
              loading={revenueLoading}
              onExport={(format) => handleExport('revenue', format)}
            />
          )}

          {activeTab === 'expenses' && (
            <ExpensesReport
              data={expensesReport}
              loading={expensesLoading}
              onExport={(format) => handleExport('expenses', format)}
            />
          )}

          {activeTab === 'cash-flow' && (
            <CashFlowReport
              data={cashFlowReport}
              loading={cashFlowLoading}
              onExport={(format) => handleExport('cash-flow', format)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function RevenueReport({
  data,
  loading,
  onExport,
}: {
  data?: any;
  loading: boolean;
  onExport: (format: 'csv' | 'pdf') => void;
}) {
  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-600">Total Revenue</p>
          <p className="text-3xl font-bold text-gray-900">
            ${data?.total?.toLocaleString() || 0}
          </p>
          <p className="text-sm text-gray-500">
            {data?.count || 0} payments
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onExport('csv')}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            CSV
          </button>
          <button
            onClick={() => onExport('pdf')}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <FileText className="w-4 h-4" />
            PDF
          </button>
        </div>
      </div>

      {data?.payments && data.payments.length > 0 ? (
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Client
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.payments.map((payment: any) => (
              <tr key={payment.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-600">
                  {new Date(payment.paymentDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {payment.clientName || '-'}
                </td>
                <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">
                  ${Number(payment.amount).toLocaleString()} {payment.currency}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center py-8 text-gray-500">No payments found</div>
      )}
    </div>
  );
}

function ExpensesReport({
  data,
  loading,
  onExport,
}: {
  data?: any;
  loading: boolean;
  onExport: (format: 'csv' | 'pdf') => void;
}) {
  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-600">Total Expenses</p>
          <p className="text-3xl font-bold text-gray-900">
            ${data?.total?.toLocaleString() || 0}
          </p>
          <p className="text-sm text-gray-500">{data?.count || 0} expenses</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onExport('csv')}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            CSV
          </button>
          <button
            onClick={() => onExport('pdf')}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <FileText className="w-4 h-4" />
            PDF
          </button>
        </div>
      </div>

      {data?.expenses && data.expenses.length > 0 ? (
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Description
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.expenses.map((expense: any) => (
              <tr key={expense.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-600">
                  {new Date(expense.paidDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {expense.type}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {expense.description}
                </td>
                <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">
                  ${Number(expense.amount).toLocaleString()} {expense.currency}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center py-8 text-gray-500">No expenses found</div>
      )}
    </div>
  );
}

function CashFlowReport({
  data,
  loading,
  onExport,
}: {
  data?: any;
  loading: boolean;
  onExport: (format: 'csv' | 'pdf') => void;
}) {
  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-gray-600">
          {data?.dateRange && (
            <p>
              {new Date(data.dateRange.startDate).toLocaleDateString()} -{' '}
              {new Date(data.dateRange.endDate).toLocaleDateString()}
            </p>
          )}
        </div>
        <button
          onClick={() => onExport('pdf')}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <FileText className="w-4 h-4" />
          PDF
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-green-900">
                ${data?.revenue?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-3">
            <Wallet className="w-8 h-8 text-red-600" />
            <div>
              <p className="text-sm text-gray-600">Expenses</p>
              <p className="text-2xl font-bold text-red-900">
                ${data?.expenses?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Net Cash Flow</p>
              <p className="text-2xl font-bold text-blue-900">
                ${data?.net?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
