import { Bell } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';

const notifications = [
  { title: "New fine issued to N12345W", time: "2 minutes ago", read: false, path: "/new-fines" },
  { title: "Payment received for fine #8432", time: "15 minutes ago", read: false, path: "/paid-fines" },
  { title: "New dispute filed for fine #8219", time: "1 hour ago", read: true, path: "/pending-disputes" },
  { title: "Fine #8430 is now overdue", time: "3 hours ago", read: true, path: "/outstanding-fines" }
];

export function Notifications() {
  const navigate = useNavigate();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <Card className="border-none shadow-none">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>You have {unreadCount} unread messages.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-2">
              {notifications.map((item, index) => (
                <div 
                  key={index} 
                  className={`flex items-start space-x-3 p-3 rounded-lg transition-colors cursor-pointer ${!item.read ? 'bg-secondary' : 'hover:bg-secondary/50'}`}
                  onClick={() => navigate(item.path)}
                >
                  <div className={`mt-1.5 h-2 w-2 rounded-full ${!item.read ? 'bg-primary' : 'bg-transparent'}`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{item.title}</p>
                    <p className="text-xs text-foreground/60">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}