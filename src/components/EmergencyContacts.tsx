import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EmergencyContactCard from './EmergencyContactCard';
import { Siren, Building, Ambulance } from 'lucide-react';

const emergencyServices = [
  { name: "Namibian Police", number: "10111", tel: "tel:10111", icon: Siren },
  { name: "Fire Department", number: "211 111", tel: "tel:211111", icon: Building },
  { name: "MVA Fund", number: "+264 61 289 7000", tel: "tel:+264612897000", icon: Ambulance },
  { name: "State Hospital", number: "203 9111", tel: "tel:2039111", icon: Ambulance },
];

const EmergencyContacts = () => {
  return (
    <Card>
      <CardHeader><CardTitle>Emergency Contacts</CardTitle></CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {emergencyServices.map((service) => (
          <EmergencyContactCard key={service.name} service={service} />
        ))}
      </CardContent>
    </Card>
  );
};

export default React.memo(EmergencyContacts);