import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Package, Users, MapPin, Clock, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Truck className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">TruckMatch</span>
          </div>
          <div className="flex space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-warning/5">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-warning bg-clip-text text-transparent">
            Connect Suppliers with Truck Owners
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Streamline your logistics operations. Suppliers can post tenders, truck owners can showcase their fleet. 
            Find the perfect match for your transportation needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/signup?role=supplier">I'm a Supplier</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/signup?role=truck-owner">I'm a Truck Owner</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Package className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Post Tenders</CardTitle>
                <CardDescription>
                  Suppliers can easily post their logistics requirements with detailed specifications
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <Truck className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Showcase Fleet</CardTitle>
                <CardDescription>
                  Truck owners can display their vehicles with capacity, location, and availability
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Smart Matching</CardTitle>
                <CardDescription>
                  Our platform connects the right suppliers with the right truck owners efficiently
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose TruckMatch?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex items-start space-x-4">
              <MapPin className="h-6 w-6 text-success mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Location-Based Matching</h3>
                <p className="text-muted-foreground">Find trucks and suppliers in your area for efficient logistics</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <Clock className="h-6 w-6 text-warning mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Real-Time Updates</h3>
                <p className="text-muted-foreground">Stay updated with live truck locations and tender status</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <Shield className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Verified Users</h3>
                <p className="text-muted-foreground">All users are verified for secure and reliable transactions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Truck className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">TruckMatch</span>
          </div>
          <p className="text-muted-foreground">© 2024 TruckMatch. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;