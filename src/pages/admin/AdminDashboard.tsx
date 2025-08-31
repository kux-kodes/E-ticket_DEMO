import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from "@/components/Logo";
import { ThemeToggle } from '@/components/theme-toggle';

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-background/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Logo size="medium" />
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Officer View
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card 
            className="cursor-pointer hover:shadow-neumorphic-inset transition-shadow"
            onClick={() => navigate('/admin/department-requests')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-6 h-6 text-primary" />
                Department Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/70">Review and approve new department registrations.</p>
            </CardContent>
          </Card>
          <Card 
            className="cursor-pointer hover:shadow-neumorphic-inset transition-shadow"
            onClick={() => alert('User management coming soon!')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-6 h-6 text-primary" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/70">View, edit, and manage all users in the system.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;