import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from "@/components/Logo";
import { MadeWithDyad } from '@/components/made-with-dyad';

const Settings = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#06404c] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Logo size="medium" />
            <h1 className="text-3xl font-bold text-white">Settings</h1>
          </div>
          <Button 
            variant="ghost" 
            className="text-white hover:text-[#bcdc49] hover:bg-white/10"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Dashboard
          </Button>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Profile Information Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-[#06404c]">Profile Information</CardTitle>
              <CardDescription className="text-[#06404c]/70">Update your personal details here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue="officer.doe@traffic.gov.na" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="badgeNumber">Badge Number</Label>
                <Input id="badgeNumber" defaultValue="TP12345" disabled />
              </div>
              <Button className="bg-[#06404c] hover:bg-[#06404c]/90 text-white">Save Changes</Button>
            </CardContent>
          </Card>

          {/* Security Settings Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-[#06404c]">Security</CardTitle>
              <CardDescription className="text-[#06404c]/70">Manage your password and security settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <Button className="bg-[#06404c] hover:bg-[#06404c]/90 text-white">Update Password</Button>
            </CardContent>
          </Card>

          {/* Notification Settings Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-[#06404c]">Notifications</CardTitle>
              <CardDescription className="text-[#06404c]/70">Control how you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifications" className="font-medium">Email Notifications</Label>
                  <p className="text-sm text-[#06404c]/70">Receive summaries and alerts via email.</p>
                </div>
                <Switch id="emailNotifications" defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="pushNotifications" className="font-medium">Push Notifications</Label>
                  <p className="text-sm text-[#06404c]/70">Get real-time alerts on your device.</p>
                </div>
                <Switch id="pushNotifications" />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default Settings;