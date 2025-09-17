import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';

interface Order {
  id: string;
  business_name: string;
  business_description: string;
  category: string;
  style_preferences: string;
  budget_range: string;
  timeline: string;
  status: string;
  notes: string;
  created_at: string;
}

const CATEGORIES = [
  { value: 'food', label: 'Food & Beverage' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'retail', label: 'Retail' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'beauty', label: 'Beauty' },
  { value: 'clothing', label: 'Clothing' },
];

const BUDGET_RANGES = [
  { value: '1000-2500', label: '$1,000 - $2,500' },
  { value: '2500-5000', label: '$2,500 - $5,000' },
  { value: '5000-10000', label: '$5,000 - $10,000' },
  { value: '10000+', label: '$10,000+' },
];

const TIMELINES = [
  { value: '1-2-weeks', label: '1-2 weeks' },
  { value: '3-4-weeks', label: '3-4 weeks' },
  { value: '1-2-months', label: '1-2 months' },
  { value: 'flexible', label: 'Flexible' },
];

export default function OrderPage() {
  const navigate = useNavigate();
  const { user, userRole, loading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  
  // Form state
  const [businessName, setBusinessName] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [category, setCategory] = useState('');
  const [stylePreferences, setStylePreferences] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [timeline, setTimeline] = useState('');

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/auth');
        return;
      }
      if (userRole === 'customer') {
        fetchOrders();
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, userRole, authLoading, navigate]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('customer_orders')
        .select('*')
        .eq('customer_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitOrder = async () => {
    if (!businessName || !businessDescription || !category || !budgetRange || !timeline) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('customer_orders')
        .insert({
          customer_id: user?.id,
          business_name: businessName,
          business_description: businessDescription,
          category: category as any,
          style_preferences: stylePreferences,
          budget_range: budgetRange,
          timeline: timeline,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Order Submitted!",
        description: "We'll review your request and get back to you soon."
      });

      // Reset form
      setBusinessName('');
      setBusinessDescription('');
      setCategory('');
      setStylePreferences('');
      setBudgetRange('');
      setTimeline('');
      setShowOrderForm(false);
      fetchOrders();

    } catch (error) {
      console.error('Order submission error:', error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen pt-24">
        <Navigation />
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">Loading orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-background">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              My <span className="gradient-text">Orders</span>
            </h1>
            <p className="text-muted-foreground">
              Track your video production requests and submit new orders
            </p>
          </div>
          
          <Button 
            onClick={() => setShowOrderForm(true)} 
            className="btn-hero"
          >
            New Order
          </Button>
        </div>

        {/* Order Form */}
        {showOrderForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Submit New Video Order</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Your business name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="businessDescription">Business Description *</Label>
                <Textarea
                  id="businessDescription"
                  value={businessDescription}
                  onChange={(e) => setBusinessDescription(e.target.value)}
                  placeholder="Tell us about your business, what you do, your target audience..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stylePreferences">Style Preferences</Label>
                <Textarea
                  id="stylePreferences"
                  value={stylePreferences}
                  onChange={(e) => setStylePreferences(e.target.value)}
                  placeholder="Describe your preferred video style, mood, or reference examples..."
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget Range *</Label>
                  <Select value={budgetRange} onValueChange={setBudgetRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      {BUDGET_RANGES.map((budget) => (
                        <SelectItem key={budget.value} value={budget.value}>
                          {budget.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timeline">Timeline *</Label>
                  <Select value={timeline} onValueChange={setTimeline}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMELINES.map((time) => (
                        <SelectItem key={time.value} value={time.value}>
                          {time.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center justify-end gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowOrderForm(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmitOrder} 
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit Order'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Orders List */}
        <div className="space-y-4">
          {orders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <h3 className="text-xl font-semibold text-foreground mb-2">No orders yet</h3>
                <p className="text-muted-foreground mb-6">
                  Submit your first video order to get started
                </p>
                <Button onClick={() => setShowOrderForm(true)} className="btn-hero">
                  Create First Order
                </Button>
              </CardContent>
            </Card>
          ) : (
            orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{order.business_name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {CATEGORIES.find(c => c.value === order.category)?.label} • {order.budget_range}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{order.business_description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Timeline:</strong> {order.timeline}
                    </div>
                    <div>
                      <strong>Submitted:</strong> {new Date(order.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  
                  {order.style_preferences && (
                    <div className="mt-4 p-4 bg-muted rounded-lg">
                      <strong className="text-sm">Style Preferences:</strong>
                      <p className="text-sm mt-1">{order.style_preferences}</p>
                    </div>
                  )}
                  
                  {order.notes && (
                    <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                      <strong className="text-sm">Notes from Jovial Studio:</strong>
                      <p className="text-sm mt-1">{order.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}