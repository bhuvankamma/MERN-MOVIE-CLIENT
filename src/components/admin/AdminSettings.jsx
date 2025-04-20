import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';

const AdminSettings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark', !darkMode); // tailwind dark mode
  };

  return (
    <Card className="p-6 shadow-md">
      <CardContent>
        <h2 className="text-2xl font-semibold mb-6">🧙 Admin Settings</h2>

        <div className="flex items-center justify-between mb-4">
          <span>🌙 Enable Dark Mode</span>
          <Switch checked={darkMode} onCheckedChange={handleDarkModeToggle} />
        </div>

        <div className="flex items-center justify-between">
          <span>🔔 Notifications</span>
          <Switch checked={notificationsEnabled} onCheckedChange={() => setNotificationsEnabled(!notificationsEnabled)} />
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminSettings;
