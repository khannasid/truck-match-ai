import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Truck, Plus, Package, MapPin, Users, Phone, Mail, Building, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {getTrucks, addTruck} from "../api/api.js"; // Assuming you have an API module to fetch trucks

interface TruckData {
  id: string;
  type: string;
  capacity: string;
  currentLocation: string;
  driverName: string;
  driverPhone: string;
  registrationNumber: string;
  available: boolean;
  specializations: string[];
}

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
  supplierName: string;
  supplierPhone: string;
  supplierEmail: string;
  postedAt: string;
}

const TruckOwnerDashboard = () => {
  const [trucks, setTrucks] = useState<TruckData[]>([]);
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<Omit<TruckData, "id">>();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "truck-owner") {
      navigate("/supplier-dashboard");
      return;
    }
    setUser(parsedUser);
    getTrucks().then(data => {
      setTrucks(data);
    }).catch(error => {
      console.error("Failed to fetch trucks:", error);
    });
    // Fetch tenders from API
    // Assuming you have an API module to fetch tenders
    // Load mock data
    loadMockData();
  }, [navigate]);

  const loadMockData = () => {
    // Mock trucks
    const mockTrucks: TruckData[] = [
      {
        id: "1",
        type: "Closed Body",
        capacity: "10 tons",
        currentLocation: "Mumbai, Maharashtra",
        driverName: "Suresh Singh",
        driverPhone: "+91 99887 76543",
        registrationNumber: "MH-01-AB-1234",
        available: true,
        specializations: ["Electronics", "Textiles"]
      }
    ];

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
        supplierName: "Tech Solutions Ltd",
        supplierPhone: "+91 98765 43210",
        supplierEmail: "contact@techsolutions.com",
        postedAt: "2024-01-15"
      },
      {
        id: "2",
        title: "Food Products Transport",
        description: "Regular transport of packaged food items",
        pickupLocation: "Nashik, Maharashtra",
        deliveryLocation: "Mumbai, Maharashtra",
        truckType: "Refrigerated",
        goodsType: "Food Products",
        weight: "8 tons",
        duration: "6 hours",
        budget: "₹25,000 - ₹30,000",
        supplierName: "Fresh Foods Co",
        supplierPhone: "+91 87654 32109",
        supplierEmail: "logistics@freshfoods.com",
        postedAt: "2024-01-14"
      }
    ];

    setTrucks(mockTrucks);
    setTenders(mockTenders);
  };

  const onSubmitTruck = async(data: Omit<TruckData, "id">) => {
    const newTruck: TruckData = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      specializations: data.specializations || []
    };

    setTrucks(prev => [newTruck, ...prev]);
    form.reset();
    await addTruck(newTruck).then(() => {
      console.log("Truck added successfully");
    }).catch(error => {
      console.error("Failed to add truck:", error); 
    });
    toast({
      title: "Truck Added Successfully!",
      description: "Your truck is now visible to suppliers",
    });
  };

  const toggleTruckAvailability = (truckId: string) => {
    setTrucks(prev => prev.map(truck => 
      truck.id === truckId 
        ? { ...truck, available: !truck.available }
        : truck
    ));
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
            <Truck className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold">Truck Owner Dashboard</h1>
              <p className="text-sm text-muted-foreground">Welcome, {user.name}</p>
            </div>
          </div>
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="trucks" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="trucks">My Fleet</TabsTrigger>
            <TabsTrigger value="tenders">Available Tenders</TabsTrigger>
          </TabsList>

          <TabsContent value="trucks" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Your Fleet</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Truck
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Truck</DialogTitle>
                    <DialogDescription>
                      Add a new truck to your fleet for suppliers to see
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmitTruck)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="registrationNumber"
                          rules={{ required: "Registration number is required" }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Registration Number</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., MH-01-AB-1234" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="type"
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
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="capacity"
                          rules={{ required: "Capacity is required" }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Capacity</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., 10 tons" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="currentLocation"
                          rules={{ required: "Current location is required" }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Current Location</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Mumbai, Maharashtra" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="driverName"
                          rules={{ required: "Driver name is required" }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Driver Name</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Suresh Singh" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="driverPhone"
                          rules={{ required: "Driver phone is required" }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Driver Phone</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., +91 99887 76543" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="available"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Switch 
                                checked={field.value} 
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel>Available for new orders</FormLabel>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="w-full">
                        Add Truck
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-6">
              {trucks.map((truck) => (
                <Card key={truck.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <Truck className="h-5 w-5" />
                        <span>{truck.registrationNumber}</span>
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          checked={truck.available}
                          onCheckedChange={() => toggleTruckAvailability(truck.id)}
                        />
                        <Badge variant={truck.available ? "default" : "secondary"}>
                          {truck.available ? "Available" : "Busy"}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription>{truck.type} • {truck.capacity}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="font-medium text-muted-foreground">Current Location</div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{truck.currentLocation}</span>
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-muted-foreground">Driver</div>
                        <div>{truck.driverName}</div>
                      </div>
                      <div>
                        <div className="font-medium text-muted-foreground">Driver Phone</div>
                        <div className="flex items-center space-x-1">
                          <Phone className="h-3 w-3" />
                          <span>{truck.driverPhone}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tenders" className="space-y-6">
            <h2 className="text-2xl font-bold">Available Tenders</h2>
            
            <div className="grid gap-6">
              {tenders.map((tender) => (
                <Card key={tender.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <Package className="h-5 w-5" />
                        <span>{tender.title}</span>
                      </CardTitle>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Posted {tender.postedAt}</span>
                      </div>
                    </div>
                    <CardDescription>{tender.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
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
                        <div className="pt-2 border-t">
                          <div className="font-medium text-muted-foreground">Budget Range</div>
                          <div className="text-lg font-semibold text-success">{tender.budget}</div>
                        </div>
                      )}
                      
                      <div className="pt-2 border-t">
                        <div className="font-medium text-muted-foreground mb-2">Supplier Contact</div>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <Building className="h-4 w-4" />
                            <span>{tender.supplierName}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Phone className="h-4 w-4" />
                            <span>{tender.supplierPhone}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Mail className="h-4 w-4" />
                            <span>{tender.supplierEmail}</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button className="w-full">
                        Express Interest
                      </Button>
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

export default TruckOwnerDashboard;