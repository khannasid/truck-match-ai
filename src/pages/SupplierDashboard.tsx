import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package, Plus, Truck, MapPin, Clock, Users, Phone, Mail, Building } from "lucide-react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {getTenders, createTender} from "../api/api.js"; // Assuming you have an API module to fetch tenders

interface Tender {
  id: string;
  title: string;
  description: string;
  pickupLocation: string;
  deliveryLocation: string;
  truckType: string;
  goodsType: string;
  weight: string;
  duration: string;
  budget: string;
  createdAt: string;
  status: "active" | "matched" | "completed";
}

interface TruckOwner {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  trucks: Array<{
    id: string;
    type: string;
    capacity: string;
    location: string;
    driverName: string;
    available: boolean;
  }>;
}

const SupplierDashboard = () => {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [truckOwners, setTruckOwners] = useState<TruckOwner[]>([]);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<Omit<Tender, "id" | "createdAt" | "status">>();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "supplier") {
      navigate("/truck-owner-dashboard");
      return;
    }
    setUser(parsedUser);
    async function fetchTenders() {
    await getTenders().then(data => {
      setTenders(data);
    }).catch(error => {
      console.error("Failed to fetch tenders:", error)});
    // Load mock data
    // loadMockData();
    }
    fetchTenders();
  }, [navigate]);

  const loadMockData = () => {
    // Mock tenders
    const mockTenders: Tender[] = [
      {
        id: "1",
        title: "Electronics Delivery",
        description: "Urgent delivery of electronics from warehouse to retail stores",
        pickupLocation: "Mumbai, Maharashtra",
        deliveryLocation: "Pune, Maharashtra",
        truckType: "Closed Body",
        goodsType: "Electronics",
        weight: "5 tons",
        duration: "1 day",
        budget: "₹15,000 - ₹20,000",
        createdAt: "2024-01-15",
        status: "active"
      }
    ];

    // Mock truck owners
    const mockTruckOwners: TruckOwner[] = [
      {
        id: "1",
        name: "Rajesh Kumar",
        email: "rajesh@example.com",
        phone: "+91 98765 43210",
        company: "Kumar Transport",
        trucks: [
          {
            id: "1",
            type: "Closed Body",
            capacity: "10 tons",
            location: "Mumbai, Maharashtra",
            driverName: "Suresh Singh",
            available: true
          },
          {
            id: "2",
            type: "Open Body",
            capacity: "15 tons",
            location: "Thane, Maharashtra",
            driverName: "Mohan Yadav",
            available: false
          }
        ]
      },
      {
        id: "2",
        name: "Amit Logistics",
        email: "amit@logistics.com",
        phone: "+91 87654 32109",
        company: "Amit Cargo Services",
        trucks: [
          {
            id: "3",
            type: "Refrigerated",
            capacity: "8 tons",
            location: "Nashik, Maharashtra",
            driverName: "Vikram Patil",
            available: true
          }
        ]
      }
    ];

    setTenders(mockTenders);
    setTruckOwners(mockTruckOwners);
  };

  const onSubmitTender = async(data: Omit<Tender, "id" | "createdAt" | "status">) => {
    const newTender: Tender = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString().split('T')[0],
      status: "active"
    };

    setTenders(prev => [newTender, ...prev]);
    form.reset();
    await createTender(newTender).then(() => {
      console.log("Tender created successfully");
    }).catch(error => {
      console.error("Failed to create tender:", error);
    });
    toast({
      title: "Tender Posted Successfully!",
      description: "Your tender is now visible to truck owners",
    });
  };

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Package className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold">Supplier Dashboard</h1>
              <p className="text-sm text-muted-foreground">Welcome, {user.name}</p>
            </div>
          </div>
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="tenders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tenders">My Tenders</TabsTrigger>
            <TabsTrigger value="trucks">Available Trucks</TabsTrigger>
          </TabsList>

          <TabsContent value="tenders" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Your Tenders</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Post New Tender
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Post New Tender</DialogTitle>
                    <DialogDescription>
                      Create a new logistics request for truck owners to see
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmitTender)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="title"
                          rules={{ required: "Title is required" }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tender Title</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Electronics Delivery" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="truckType"
                          rules={{ required: "Truck type is required" }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Truck Type</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select truck type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Open Body">Open Body</SelectItem>
                                  <SelectItem value="Closed Body">Closed Body</SelectItem>
                                  <SelectItem value="Refrigerated">Refrigerated</SelectItem>
                                  <SelectItem value="Tanker">Tanker</SelectItem>
                                  <SelectItem value="Flatbed">Flatbed</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="description"
                        rules={{ required: "Description is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Describe your logistics requirement..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="pickupLocation"
                          rules={{ required: "Pickup location is required" }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Pickup Location</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Mumbai, Maharashtra" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="deliveryLocation"
                          rules={{ required: "Delivery location is required" }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Delivery Location</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Pune, Maharashtra" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="goodsType"
                          rules={{ required: "Goods type is required" }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Goods Type</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Electronics" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="weight"
                          rules={{ required: "Weight is required" }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Weight</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., 5 tons" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="duration"
                          rules={{ required: "Duration is required" }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Duration</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., 2 days" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="budget"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Budget Range (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., ₹15,000 - ₹20,000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="w-full">
                        Post Tender
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-6">
              {tenders.map((tender) => (
                <Card key={tender.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <Package className="h-5 w-5" />
                        <span>{tender.title}</span>
                      </CardTitle>
                      <Badge variant={tender.status === "active" ? "default" : "secondary"}>
                        {tender.status}
                      </Badge>
                    </div>
                    <CardDescription>{tender.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="font-medium text-muted-foreground">Route</div>
                        <div>{tender.pickupLocation} → {tender.deliveryLocation}</div>
                      </div>
                      <div>
                        <div className="font-medium text-muted-foreground">Truck Type</div>
                        <div>{tender.truckType}</div>
                      </div>
                      <div>
                        <div className="font-medium text-muted-foreground">Weight</div>
                        <div>{tender.weight}</div>
                      </div>
                      <div>
                        <div className="font-medium text-muted-foreground">Duration</div>
                        <div>{tender.duration}</div>
                      </div>
                    </div>
                    {tender.budget && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="font-medium text-muted-foreground">Budget Range</div>
                        <div className="text-lg font-semibold text-success">{tender.budget}</div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trucks" className="space-y-6">
            <h2 className="text-2xl font-bold">Available Trucks</h2>
            
            <div className="grid gap-6">
              {truckOwners.map((owner) => (
                <Card key={owner.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-5 w-5" />
                      <span>{owner.name}</span>
                    </CardTitle>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Building className="h-4 w-4" />
                        <span>{owner.company}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="h-4 w-4" />
                        <span>{owner.phone}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Mail className="h-4 w-4" />
                        <span>{owner.email}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {owner.trucks.map((truck) => (
                        <div key={truck.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Truck className="h-4 w-4" />
                              <span className="font-medium">{truck.type}</span>
                            </div>
                            <Badge variant={truck.available ? "default" : "secondary"}>
                              {truck.available ? "Available" : "Busy"}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <div className="font-medium text-muted-foreground">Capacity</div>
                              <div>{truck.capacity}</div>
                            </div>
                            <div>
                              <div className="font-medium text-muted-foreground">Location</div>
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-3 w-3" />
                                <span>{truck.location}</span>
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-muted-foreground">Driver</div>
                              <div>{truck.driverName}</div>
                            </div>
                          </div>
                          {truck.available && (
                            <Button size="sm" className="mt-3">
                              Contact Owner
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SupplierDashboard;