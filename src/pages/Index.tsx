import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Database, Users, LayoutDashboard, ShieldCheck, Gavel, ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: FileText,
      title: "Digital Fine Issuance",
      description: "Issue traffic fines instantly from any mobile device, eliminating manual paperwork."
    },
    {
      icon: Database,
      title: "Centralized Database",
      description: "All fines are logged in a secure, real-time database, accessible from anywhere."
    },
    {
      icon: Users,
      title: "Citizen Portal",
      description: "A public-facing portal for offenders to easily view, dispute, and pay their fines online."
    },
    {
      icon: LayoutDashboard,
      title: "Officer Dashboards",
      description: "Provide officers with a clear overview of their issued fines and their current statuses."
    },
    {
      icon: ShieldCheck,
      title: "Secure Payments",
      description: "Integrated with a secure payment gateway for fast and hassle-free fine settlements."
    },
    {
      icon: Gavel,
      title: "Streamlined Disputes",
      description: "An efficient, evidence-based process for citizens to dispute fines they believe are incorrect."
    }
  ];

  const testimonials = [
    {
      name: "Inspector M. Kavari",
      role: "Chief of Traffic Police, Windhoek",
      content: "DRIVA has revolutionized our process. What used to take weeks of paperwork now happens in real-time."
    },
    {
      name: "Sgt. A. Shipanga",
      role: "Traffic Officer, Khomas Region",
      content: "Issuing fines on the roadside is now faster and more accurate. The citizen portal has also reduced queries at the station."
    },
    {
      name: "John Doe",
      role: "Citizen",
      content: "I was able to pay my fine online in minutes. The process was straightforward and much more convenient."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#06404c] via-[#0a5a6a] to-[#06404c]">
      {/* Navigation */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Logo size="medium" />
              <span className="text-xl font-bold text-white">DRIVA</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                className="text-white hover:text-[#bcdc49] hover:bg-white/10"
                onClick={() => navigate('/sign-in')}
              >
                Login
              </Button>
              <Button 
                className="bg-[#bcdc49] hover:bg-[#bcdc49]/90 text-[#06404c] font-medium"
                onClick={() => navigate('/sign-up')}
              >
                Register
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Modernizing Traffic Enforcement,
            <br />
            <span className="text-[#bcdc49]">One Fine at a Time.</span>
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
            DRIVA replaces manual ticketing and Excel databases with a seamless,
            digital system for issuing, tracking, and settling traffic fines.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-[#bcdc49] hover:bg-[#bcdc49]/90 text-[#06404c] text-lg font-medium px-8 py-6"
              onClick={() => navigate('/sign-up')}
            >
              Officer Portal
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 text-lg font-medium px-8 py-6"
            >
              Pay a Fine
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">A Smarter System for Safer Roads</h2>
            <p className="text-xl text-white/70">Powerful features for officers and citizens alike.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <div className="w-12 h-12 bg-[#bcdc49]/20 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-[#bcdc49]" />
                  </div>
                  <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-white/70">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-[#bcdc49] mb-2">50,000+</div>
              <div className="text-white/70">Fines Processed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#bcdc49] mb-2">95%</div>
              <div className="text-white/70">Faster Processing</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#bcdc49] mb-2">14</div>
              <div className="text-white/70">Regions Covered</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#bcdc49] mb-2">99.9%</div>
              <div className="text-white/70">System Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Trusted by Law Enforcement</h2>
            <p className="text-xl text-white/70">See what officials and citizens are saying.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <CheckCircle key={i} className="h-5 w-5 text-[#bcdc49] fill-current" />
                    ))}
                  </div>
                  <p className="text-white/80 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <div className="text-white font-medium">{testimonial.name}</div>
                    <div className="text-white/60 text-sm">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Modernize Your Traffic System?</h2>
          <p className="text-xl text-white/70 mb-8">
            Join the digital transformation of traffic enforcement.
          </p>
          <Button 
            size="lg" 
            className="bg-[#bcdc49] hover:bg-[#bcdc49]/90 text-[#06404c] text-xl font-medium px-10 py-6"
            onClick={() => navigate('/sign-up')}
          >
            Register Your Department
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/5 border-t border-white/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <Logo size="small" />
              <span className="text-xl font-bold text-white">DRIVA</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-white/60 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">Support</a>
            </div>
          </div>
          <div className="text-center mt-8">
            <MadeWithDyad />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;