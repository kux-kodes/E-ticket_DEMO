import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { DollarSign, Bell, Settings, LogOut, FilePlus, AlertTriangle, Clock } from 'lucide-react';
import Logo from "@/components/Logo";
import FinesChart from "@/components/FinesChart";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#06404c] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Logo size="medium" />
            <h1 className="text-3xl font-bold text-white">Traffic Enforcement Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-white hover:text-[#bcdc49] hover:bg-white/10">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" className="text-white hover:text-[#bcdc49] hover:bg-white/10">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" className="text-white hover:text-[#bcdc49] hover:bg-white/10">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-[#06404c] mb-2">Welcome back, Officer!</h2>
          <p className="text-[#06404c]/70">Here is a summary of today's traffic enforcement activity.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-[#06404c]">Fines Collected (Today)</CardTitle>
              <div className="p-2 bg-[#bcdc49]/20 rounded-lg">
                <DollarSign className="h-5 w-5 text-[#bcdc49]" />
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="text-3xl font-bold text-[#06404c]">N$12,450</div>
              <p className="text-sm text-[#06404c]/70 mt-1">+15.2% from yesterday</p>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-[#06404c] hover:bg-[#06404c]/90 text-white"
                onClick={() => navigate('/paid-fines')}
              >
                View All Fines
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-[#06404c]">New Fines Issued (Today)</CardTitle>
              <div className="p-2 bg-[#bcdc49]/20 rounded-lg">
                <FilePlus className="h-5 w-5 text-[#bcdc49]" />
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="text-3xl font-bold text-[#06404c]">+82</div>
              <p className="text-sm text-[#06404c]/70 mt-1">+5% from yesterday</p>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-[#06404c] hover:bg-[#06404c]/90 text-white"
                onClick={() => navigate('/new-fines')}
              >
                View All Fines
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-[#06404c]">Pending Disputes</CardTitle>
              <div className="p-2 bg-[#bcdc49]/20 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-[#bcdc49]" />
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="text-3xl font-bold text-[#06404c]">14</div>
              <p className="text-sm text-[#06404c]/70 mt-1">3 new since yesterday</p>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-[#06404c] hover:bg-[#06404c]/90 text-white"
                onClick={() => navigate('/pending-disputes')}
              >
                View All Disputes
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-[#06404c]">Total Outstanding Fines</CardTitle>
              <div className="p-2 bg-[#bcdc49]/20 rounded-lg">
                <Clock className="h-5 w-5 text-[#bcdc49]" />
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="text-3xl font-bold text-[#06404c]">1,253</div>
              <p className="text-sm text-[#06404c]/70 mt-1">Total value: N$250,600</p>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-[#06404c] hover:bg-[#06404c]/90 text-white"
                onClick={() => navigate('/outstanding-fines')}
              >
                View All Fines
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-[#06404c]">Fines Issued Over Time</CardTitle>
              <CardDescription className="text-[#06404c]/70">Daily fines issued this week</CardDescription>
            </CardHeader>
            <CardContent>
              <FinesChart />
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-[#06404c]">Recent Activity</CardTitle>
              <CardDescription className="text-[#06404c]/70">Latest fines, payments, and disputes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: "New fine issued to N12345W", time: "2 minutes ago" },
                  { title: "Payment received for fine #8432", time: "15 minutes ago" },
                  { title: "New dispute filed for fine #8219", time: "1 hour ago" },
                  { title: "Fine #8430 is now overdue", time: "3 hours ago" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="bg-[#bcdc49]/20 p-2 rounded-full mt-0.5">
                      <div className="bg-[#bcdc49] w-2 h-2 rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#06404c]">{item.title}</p>
                      <p className="text-xs text-[#06404c]/60">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default Dashboard;