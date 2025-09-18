import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, ShoppingCart, Target, Users } from 'lucide-react';

const salesData = [
  { month: 'Jan', revenue: 15400, orders: 124, customers: 89 },
  { month: 'Feb', revenue: 18200, orders: 142, customers: 96 },
  { month: 'Mar', revenue: 22100, orders: 168, customers: 112 },
  { month: 'Apr', revenue: 19800, orders: 156, customers: 104 },
  { month: 'May', revenue: 25600, orders: 189, customers: 128 },
  { month: 'Jun', revenue: 28900, orders: 215, customers: 145 },
];

const productData = [
  { name: 'Web Development', sales: 12500, growth: 15 },
  { name: 'Mobile Apps', sales: 8900, growth: 8 },
  { name: 'AI Solutions', sales: 6200, growth: 25 },
  { name: 'Dashboards', sales: 4800, growth: 12 },
];

const SalesDashboard = () => {
  return (
    <div className="p-6 space-y-6 bg-background min-h-[500px]">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Sales Performance</h2>
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          +18.5% vs last period
        </Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-muted-foreground">Total Revenue</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-foreground">$130.0K</div>
              <div className="text-sm text-muted-foreground">This period</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-muted-foreground">Orders</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-foreground">994</div>
              <div className="text-sm text-green-600">+12% increase</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium text-muted-foreground">Customers</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-foreground">674</div>
              <div className="text-sm text-green-600">New & returning</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium text-muted-foreground">Avg. Order</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-foreground">$131</div>
              <div className="text-sm text-green-600">+5.2% AOV</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                    color: 'hsl(var(--foreground))'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  fill="url(#colorRevenue)" 
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Product Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {productData.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-foreground">{product.name}</div>
                    <div className="text-sm text-muted-foreground">${product.sales.toLocaleString()}</div>
                  </div>
                  <div className="flex items-center text-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span className="text-sm">+{product.growth}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Orders Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-foreground">Monthly Orders & Customer Acquisition</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                  color: 'hsl(var(--foreground))'
                }}
              />
              <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="customers" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesDashboard;