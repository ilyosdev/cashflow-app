import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { Send, Bell, DollarSign, MessageSquare, LogOut } from 'lucide-react';

export default function SettingsPage() {
  const [telegramUsername, setTelegramUsername] = useState('');
  const [showTelegramModal, setShowTelegramModal] = useState(false);
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['auth-me'],
    queryFn: async () => {
      const response = await api.get('/auth/me');
      return response.data;
    },
  });

  const connectTelegramMutation = useMutation({
    mutationFn: async (username: string) => {
      await api.post('/telegram/connect', { telegramUsername: username });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth-me'] });
      setShowTelegramModal(false);
      setTelegramUsername('');
    },
  });

  const disconnectTelegramMutation = useMutation({
    mutationFn: async () => {
      await api.post('/telegram/disconnect');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth-me'] });
    },
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account preferences</p>
      </div>

      <div className="max-w-2xl space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary-50 rounded-lg">
              <MessageSquare className="w-6 h-6 text-primary-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900">Telegram Notifications</h2>
              <p className="text-gray-600 mt-1">
                Connect your Telegram account to receive notifications about overdue payments,
                subscription renewals, and expense due dates.
              </p>

              {user?.telegramChatId ? (
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex-1 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-medium text-green-900">
                      ✓ Telegram Connected
                    </p>
                  </div>
                  <button
                    onClick={() => disconnectTelegramMutation.mutate()}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowTelegramModal(true)}
                  className="mt-4 flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Connect Telegram
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Bell className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
              <p className="text-gray-600 mt-1">
                Choose which notifications you want to receive.
              </p>

              <div className="mt-4 space-y-3">
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Overdue Payments</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-primary-600" />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Subscription Renewals</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-primary-600" />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Expense Due Dates</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-primary-600" />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Daily Summary</span>
                  <input type="checkbox" className="w-4 h-4 text-primary-600" />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900">Default Currency</h2>
              <p className="text-gray-600 mt-1">
                Set your default currency for new entries.
              </p>

              <select className="mt-4 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                <option value="USD">USD - US Dollar</option>
                <option value="UZS">UZS - Uzbekistan Som</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {showTelegramModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Connect Telegram Account
            </h2>
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
                <p className="font-medium mb-2">To connect your Telegram:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Open Telegram and find @{'your-bot-name'}</li>
                  <li>Send <code>/start</code> command</li>
                  <li>Enter your username below</li>
                </ol>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Telegram Username
                </label>
                <input
                  type="text"
                  value={telegramUsername}
                  onChange={(e) => setTelegramUsername(e.target.value)}
                  placeholder="@username"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowTelegramModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => connectTelegramMutation.mutate(telegramUsername)}
                  disabled={!telegramUsername || connectTelegramMutation.isPending}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {connectTelegramMutation.isPending ? 'Connecting...' : 'Connect'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
