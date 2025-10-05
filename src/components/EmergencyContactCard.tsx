import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, LucideIcon } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type EmergencyContactCardProps = {
  service: {
    name: string;
    number: string;
    tel: string;
    icon: LucideIcon;
  };
};

const EmergencyContactCard: React.FC<EmergencyContactCardProps> = ({ service }) => {
  const ServiceIcon = service.icon;
  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-secondary rounded-full">
            <ServiceIcon className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-grow">
            <p className="font-semibold text-lg">{service.name}</p>
            <p className="text-foreground/70">{service.number}</p>
          </div>
        </div>
        
        <div className="flex-shrink-0">
            <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button>
                <Phone className="mr-2 h-4 w-4" /> Call
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Call {service.name}?</AlertDialogTitle>
                <AlertDialogDescription>
                    This will open your phone app to place a call to {service.number}.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => window.location.href = service.tel}>
                    Call
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialog>
        </div>
      </div>
    </Card>
  );
};

export default React.memo(EmergencyContactCard);