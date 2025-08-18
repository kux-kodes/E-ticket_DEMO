import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Users, TrendingUp, DollarSign, Bell, Settings, LogOut } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#06404c] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-[#bcdc49] rounded-full flex items-center justify-center">
              <span className="text-xl font-bold text-[#06404c]">D</span>
            </div>
            <h1 className="text-3xl font-bold text-white">DRIVA Dashboard</h1>
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
          <h2 className="text-2xl font-semibold text-[#06404c] mb-2">Welcome back!</h2>
          <p className="text-[#06404c]/70">Here's what's happening with your business today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-[#06404c]">Total Revenue</CardTitle>
              <div className="p-2 bg-[#bcdc49]/20 rounded-lg">
                <DollarSign className="h-5 w-5 text-[#bcdc49]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#06404c]">$45,231.89</div>
              <p className="text-sm text-[#06404c]/70 mt-1">+20.1% from last month</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-[#06404c]">Subscriptions</CardTitle>
              <div className="p-2 bg-[#bcdc49]/20 rounded-lg">
                <Users className="h-5 w-5 text-[#bcdc49]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#06404c]">+2,350</div>
              <p className="text-sm text-[#06404c]/70 mt-1">+180.1% from last month</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-[#06404c]">Sales</CardTitle>
              <div className="p-2 bg-[#bcdc49]/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-[#bcdc49]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#06404c]">+12,234</div>
              <p className="text-sm text-[#06404c]/70 mt-1">+19% from last month</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-[#06404c]">Active Now</CardTitle>
              <div className="p-2 bg-[#bcdc49]/20 rounded-lg">
                <BarChart className="h-5 w-5 text-[#bcdc49]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#06404c]">+573</div>
              <p className="text-sm text-[#06404c]/70 mt-1">+201 since last hour</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-[#06404c]">Performance Overview</CardTitle>
              <CardDescription className="text-[#06404c]/70">Monthly performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center bg-[#06404c]/5 rounded-lg border-2 border-dashed border-[#06404c]/20">
                <div className="text-center">
                  <BarChart className="h-12 w-12 text-[#06404c]/40 mx-auto mb-4" />
                  <p className="text-[#06404c]/60">Chart visualization will appear here</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-[#06404c]">Recent Activity</CardTitle>
              <CardDescription className="text-[#06404c]/70">Latest updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: "New user registered", time: "2 minutes ago", type: "user" },
                  { title: "Payment received", time: "15 minutes ago", type: "payment" },
                  { title: "New subscription", time: "1 hour ago", type: "subscription" },
                  { title: "Report generated", time: "3 hours ago", type: "report" }
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

export default Index;