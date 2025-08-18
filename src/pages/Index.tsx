import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Users, TrendingUp, DollarSign } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#06404c] shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="border-[#bcdc49] text-[#bcdc49] hover:bg-[#bcdc49] hover:text-[#06404c]">
              Settings
            </Button>
            <Button className="bg-[#bcdc49] text-[#06404c] hover:bg-[#bcdc49]/90">
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-[#06404c]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#06404c]">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-[#06404c]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#06404c]">$45,231.89</div>
              <p className="text-xs text-[#06404c]/70">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card className="border-[#06404c]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#06404c]">Subscriptions</CardTitle>
              <Users className="h-4 w-4 text-[#06404c]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#06404c]">+2350</div>
              <p className="text-xs text-[#06404c]/70">+180.1% from last month</p>
            </CardContent>
          </Card>
          <Card className="border-[#06404c]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#06404c]">Sales</CardTitle>
              <TrendingUp className="h-4 w-4 text-[#06404c]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#06404c]">+12,234</div>
              <p className="text-xs text-[#06404c]/70">+19% from last month</p>
            </CardContent>
          </Card>
          <Card className="border-[#06404c]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#06404c]">Active Now</CardTitle>
              <BarChart className="h-4 w-4 text-[#06404c]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#06404c]">+573</div>
              <p className="text-xs text-[#06404c]/70">+201 since last hour</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="col-span-1 border-[#06404c]/20">
            <CardHeader>
              <CardTitle className="text-[#06404c]">Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-80 flex items-center justify-center bg-[#06404c]/5 rounded-lg">
                <p className="text-[#06404c]/70">Chart visualization would go here</p>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-1 border-[#06404c]/20">
            <CardHeader>
              <CardTitle className="text-[#06404c]">Recent Activity</CardTitle>
              <CardDescription className="text-[#06404c]/70">You have 3 new notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center">
                    <div className="bg-[#bcdc49]/20 p-2 rounded-full mr-4">
                      <div className="bg-[#bcdc49] w-2 h-2 rounded-full"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#06404c]">New user registered</p>
                      <p className="text-xs text-[#06404c]/70">5 minutes ago</p>
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