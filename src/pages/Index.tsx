import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Users, TrendingUp, DollarSign, Shield, Zap, Globe, Clock, ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: BarChart,
      title: "Real-time Analytics",
      description: "Track your business performance with live dashboards and detailed reports"
    },
    {
      icon: Users,
      title: "Customer Management",
      description: "Manage customer relationships, subscriptions, and engagement in one place"
    },
    {
      icon: TrendingUp,
      title: "Growth Insights",
      description: "Get AI-powered recommendations to grow your business faster"
    },
    {
      icon: DollarSign,
      title: "Revenue Tracking",
      description: "Monitor revenue streams, payments, and financial health with precision"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with end-to-end encryption and compliance standards"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Instant loading times and real-time updates across all your devices"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CEO, TechStart Inc",
      content: "DRIVA transformed how we track our SaaS metrics. The insights are incredible!"
    },
    {
      name: "Michael Chen",
      role: "Founder, GrowthLabs",
      content: "Best investment we've made. Our revenue grew 300% in 6 months with DRIVA."
    },
    {
      name: "Emma Rodriguez",
      role: "Operations Director, ScaleUp",
      content: "The customer management features are game-changing. Highly recommend!"
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
                Sign In
              </Button>
              <Button 
                className="bg-[#bcdc49] hover:bg-[#bcdc49]/90 text-[#06404c] font-medium"
                onClick={() => navigate('/sign-up')}
              >
                Get Started Free
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Drive Your Business
            <br />
            <span className="text-[#bcdc49]">Forward with Data</span>
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
            Join 10,000+ businesses using DRIVA to track revenue, manage customers, 
            and accelerate growth with real-time analytics and AI-powered insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-[#bcdc49] hover:bg-[#bcdc49]/90 text-[#06404c] text-lg font-medium px-8 py-6"
              onClick={() => navigate('/sign-up')}
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 text-lg font-medium px-8 py-6"
              onClick={() => navigate('/sign-in')}
            >
              Sign In
            </Button>
          </div>
          <p className="text-white/60 mt-4">No credit card required • 14-day free trial</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Everything You Need to Scale</h2>
            <p className="text-xl text-white/70">Powerful features designed for growing businesses</p>
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
              <div className="text-4xl font-bold text-[#bcdc49] mb-2">10,000+</div>
              <div className="text-white/70">Active Businesses</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#bcdc49] mb-2">$2.5B+</div>
              <div className="text-white/70">Revenue Tracked</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#bcdc49] mb-2">99.9%</div>
              <div className="text-white/70">Uptime</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#bcdc49] mb-2">24/7</div>
              <div className="text-white/70">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Trusted by Industry Leaders</h2>
            <p className="text-xl text-white/70">See what our customers are saying</p>
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
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Your Business?</h2>
          <p className="text-xl text-white/70 mb-8">
            Join thousands of businesses already using DRIVA to accelerate their growth.
          </p>
          <Button 
            size="lg" 
            className="bg-[#bcdc49] hover:bg-[#bcdc49]/90 text-[#06404c] text-xl font-medium px-10 py-6"
            onClick={() => navigate('/sign-up')}
          >
            Start Your Free Trial Now
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