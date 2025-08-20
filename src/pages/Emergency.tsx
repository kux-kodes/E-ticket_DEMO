import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Siren, Ambulance, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from "@/components/Logo";
import { MadeWithDyad } from '@/components/made-with-dyad';
import { ThemeToggle } from '@/components/theme-toggle';

const emergencyServices = [
  { name: "Namibian Police", number: "10111", tel: "tel:10111", icon: Siren },
  { name: "Headquarters Fire Station", number: "211 111", tel: "tel:211111", icon: Building },
  { name: "MVA Fund", number: "+264 61 289 7000", tel: "tel:+264612897000", icon: Ambulance },
  { name: "State Hospital", number: "203 9111", tel: "tel:2039111", icon: Ambulance },
];

const Emergency = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-background/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Logo size="medium" />
            <h1 className="text-3xl font-bold text-foreground">Emergency Contacts</h1>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              onClick={() => navigate('/citizen-dashboard')}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Emergency Services</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {emergencyServices.map((service) => (
              <Card key={service.name} className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-secondary rounded-full">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-lg">{service.name}</p>
                    <p className="text-foreground/70">{service.number}</p>
                  </div>
                  <Button asChild>
                    <a href={service.tel}>
                      <Phone className="mr-2 h-4 w-4" /> Call
                    </a>
                  </Button>
                </div>
              </Card>
            ))}
          </CardContent>
        </Card>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default Emergency;