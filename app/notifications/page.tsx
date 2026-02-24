'use client';

import { useState } from 'react';
import { FiBell, FiMail, FiSmartphone, FiSave } from 'react-icons/fi';
import Button from '../components/UI/Button';
import LayoutWrapper from '../components/Layout/LayoutWrapper';

export default function NotificationSettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    projectCreated: true,
    projectUpdated: true,
    projectAssigned: true,
    projectCompleted: true,
    statusChanges: true,
    dueDateReminders: true,
    userManagement: true,
    systemAlerts: true
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Save settings to localStorage or API
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <LayoutWrapper>
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Notification Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Customize how you receive notifications</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Delivery Methods */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Delivery Methods</h2>
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FiMail className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-700">Email Notifications</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                  className="h-4 w-4 text-primary-600 rounded border-gray-300"
                />
              </label>
              <label className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FiSmartphone className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-700">Push Notifications</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.pushNotifications}
                  onChange={(e) => setSettings({ ...settings, pushNotifications: e.target.checked })}
                  className="h-4 w-4 text-primary-600 rounded border-gray-300"
                />
              </label>
            </div>
          </div>

          {/* Notification Types */}
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Notification Types</h2>
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FiBell className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-700">Project Created</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.projectCreated}
                  onChange={(e) => setSettings({ ...settings, projectCreated: e.target.checked })}
                  className="h-4 w-4 text-primary-600 rounded border-gray-300"
                />
              </label>
              <label className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FiBell className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-700">Project Updated</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.projectUpdated}
                  onChange={(e) => setSettings({ ...settings, projectUpdated: e.target.checked })}
                  className="h-4 w-4 text-primary-600 rounded border-gray-300"
                />
              </label>
              <label className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FiBell className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-700">Project Assigned</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.projectAssigned}
                  onChange={(e) => setSettings({ ...settings, projectAssigned: e.target.checked })}
                  className="h-4 w-4 text-primary-600 rounded border-gray-300"
                />
              </label>
              <label className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FiBell className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-700">Project Completed</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.projectCompleted}
                  onChange={(e) => setSettings({ ...settings, projectCompleted: e.target.checked })}
                  className="h-4 w-4 text-primary-600 rounded border-gray-300"
                />
              </label>
              <label className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FiBell className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-700">Status Changes</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.statusChanges}
                  onChange={(e) => setSettings({ ...settings, statusChanges: e.target.checked })}
                  className="h-4 w-4 text-primary-600 rounded border-gray-300"
                />
              </label>
              <label className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FiBell className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-700">Due Date Reminders</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.dueDateReminders}
                  onChange={(e) => setSettings({ ...settings, dueDateReminders: e.target.checked })}
                  className="h-4 w-4 text-primary-600 rounded border-gray-300"
                />
              </label>
              <label className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FiBell className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-700">User Management</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.userManagement}
                  onChange={(e) => setSettings({ ...settings, userManagement: e.target.checked })}
                  className="h-4 w-4 text-primary-600 rounded border-gray-300"
                />
              </label>
              <label className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FiBell className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-700">System Alerts</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.systemAlerts}
                  onChange={(e) => setSettings({ ...settings, systemAlerts: e.target.checked })}
                  className="h-4 w-4 text-primary-600 rounded border-gray-300"
                />
              </label>
            </div>
          </div>

          {/* Save Button */}
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <Button
                variant="primary"
                onClick={handleSave}
                leftIcon={FiSave}
              >
                Save Settings
              </Button>
              {saved && (
                <span className="text-sm text-green-600">Settings saved successfully!</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
}