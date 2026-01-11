import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  AlertCircle,
  Calendar,
} from 'lucide-react';

export default function DashboardPage() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: async () => {
      const response = await api.get('/dashboard/metrics');
      return response.data;
    },
  });

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  const cards = [
    {
      name: 'Monthly Recurring Revenue',
      value: metrics?.totalMRR || 0,
      change: '+12%',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      name: 'Total Expenses',
      value: metrics?.totalExpenses || 0,
      change: '+5%',
      icon: Wallet,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      name: 'Net Profit',
      value: metrics?.netProfit || 0,
      change: '+18%',
      icon: DollarSign,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
    },
    {
      name: 'Active Subscriptions',
      value: metrics?.activeSubscriptions || 0,
      change: '+3%',
      icon: CreditCard,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Overview of your subscriptions and expenses
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => (
          <div key={card.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.name}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  ${card.value.toLocaleString()}
                </p>
                <p className={`text-sm mt-1 ${card.color}`}>{card.change} from last month</p>
              </div>
              <div className={`${card.bgColor} p-3 rounded-lg`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Alerts</h2>
          <div className="space-y-4">
            {metrics?.overduePaymentsCount > 0 && (
              <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-red-900">
                    {metrics.overduePaymentsCount} Overdue Payments
                  </p>
                  <p className="text-sm text-red-700">
                    ${metrics.overduePayments.toLocaleString()} total overdue
                  </p>
                </div>
              </div>
            )}
            {metrics?.upcomingExpensesCount > 0 && (
              <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <Calendar className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-900">
                    {metrics.upcomingExpensesCount} Upcoming Expenses
                  </p>
                  <p className="text-sm text-yellow-700">
                    ${metrics.upcomingExpenses.toLocaleString()} due soon
                  </p>
                </div>
              </div>
            )}
            {metrics?.overduePaymentsCount === 0 && metrics?.upcomingExpensesCount === 0 && (
              <p className="text-gray-500 text-center py-8">
                No alerts at this time
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Clients</p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {metrics?.clientsCount || 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Payments This Month</p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {metrics?.paymentsCount || 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Expenses This Month</p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {metrics?.expensesCount || 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Net This Month</p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                ${metrics?.netProfit?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
