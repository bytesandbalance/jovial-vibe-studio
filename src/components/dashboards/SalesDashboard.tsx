import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, ComposedChart, Area, AreaChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Target, Users, DollarSign, ShoppingCart, Calendar, Award } from 'lucide-react';

const monthlySalesData = [
  { month: 'Jul', revenue: 28000, orders: 45, customers: 38, target: 25000, profit: 8400 },
  { month: 'Aug', revenue: 32000, orders: 52, customers: 44, target: 28000, profit: 9600 },
  { month: 'Sep', revenue: 29000, orders: 48, customers: 41, target: 30000, profit: 8700 },
  { month: 'Oct', revenue: 38000, orders: 61, customers: 53, target: 32000, profit: 11400 },
  { month: 'Nov', revenue: 42000, orders: 68, customers: 58, target: 35000, profit: 12600 },
  { month: 'Dec', revenue: 51000, orders: 78, customers: 67, target: 38000, profit: 15300 },
];

const productRevenue = [
  { name: 'Video Production', revenue: 22000, orders: 28, margin: 35, color: '#8b5cf6' },
  { name: 'Web Development', revenue: 18000, orders: 15, margin: 42, color: '#06b6d4' },
  { name: 'Analytics Dashboards', revenue: 8000, orders: 22, margin: 28, color: '#10b981' },
  { name: 'AI Automation', revenue: 3000, orders: 13, margin: 45, color: '#f59e0b' },
];

const salesTeamData = [
  { name: 'Sarah Johnson', revenue: 15000, deals: 8, quota: 12000, performance: 125, region: 'North' },
  { name: 'Mike Chen', revenue: 12000, deals: 6, quota: 12000, performance: 100, region: 'West' },
  { name: 'Emma Davis', revenue: 18000, deals: 12, quota: 15000, performance: 120, region: 'East' },
  { name: 'Alex Rodriguez', revenue: 6000, deals: 4, quota: 8000, performance: 75, region: 'South' },
  { name: 'Lisa Wang', revenue: 9500, deals: 7, quota: 10000, performance: 95, region: 'Central' },
];

const recentDeals = [
  { client: 'TechCorp Inc.', value: 8500, service: 'Video Campaign', status: 'Closed Won', probability: 100, stage: 'Closed', date: '2024-01-15' },
  { client: 'Fashion Forward', value: 12000, service: 'Web Development', status: 'Closed Won', probability: 100, stage: 'Closed', date: '2024-01-14' },
  { client: 'FitLife Gym', value: 3500, service: 'Social Media Ads', status: 'Proposal', probability: 75, stage: 'Proposal', date: '2024-01-13' },
  { client: 'Local Restaurant', value: 2800, service: 'Video Content', status: 'Negotiation', probability: 60, stage: 'Negotiation', date: '2024-01-12' },
  { client: 'E-commerce Plus', value: 15000, service: 'Full Platform', status: 'Closed Won', probability: 100, stage: 'Closed', date: '2024-01-11' },
  { client: 'StartupX', value: 6200, service: 'AI Chatbot', status: 'Discovery', probability: 25, stage: 'Discovery', date: '2024-01-10' },
];

const monthlyTargets = [
  { metric: 'Revenue Target', current: 51000, target: 45000, percentage: 113 },
  { metric: 'New Customers', current: 67, target: 60, percentage: 112 },
  { metric: 'Deal Velocity', current: 18, target: 21, percentage: 86 },
  { metric: 'Win Rate', current: 68, target: 65, percentage: 105 },
];

const SalesDashboard = () => {
  const totalRevenue = monthlySalesData[monthlySalesData.length - 1].revenue;
  const previousRevenue = monthlySalesData[monthlySalesData.length - 2].revenue;
  const monthlyGrowth = ((totalRevenue - previousRevenue) / previousRevenue * 100).toFixed(1);
  const totalOrders = monthlySalesData.reduce((sum, month) => sum + month.orders, 0);

  return (
    <div className="p-6 bg-background min-h-screen space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sales Performance Dashboard</h1>
          <p className="text-muted-foreground mt-1">Real-time sales analytics and team performance metrics</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="secondary" className="px-3 py-1">
            <Calendar className="w-4 h-4 mr-1" />
            Q4 2024
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            <TrendingUp className="w-4 h-4 mr-1" />
            +{monthlyGrowth}% vs last month
          </Badge>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-bold text-foreground">${totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +{monthlyGrowth}%
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold text-foreground">{monthlySalesData[monthlySalesData.length - 1].orders}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +14.7%
                </p>
              </div>
              <ShoppingCart className="w-8 h-8 text-coral" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">New Customers</p>
                <p className="text-2xl font-bold text-foreground">{monthlySalesData[monthlySalesData.length - 1].customers}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +15.5%
                </p>
              </div>
              <Users className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Goal Achievement</p>
                <p className="text-2xl font-bold text-foreground">134%</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <Award className="w-3 h-3 mr-1" />
                  Above target
                </p>
              </div>
              <Target className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue vs Target & Profit */}
        <Card className="lg:col-span-2 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Revenue Performance & Profitability
              <Badge variant="outline">6 Month Trend</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <ComposedChart data={monthlySalesData}>
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }} 
                />
                <Bar dataKey="target" fill="#e5e7eb" opacity={0.7} name="Target" />
                <Bar dataKey="revenue" fill="#8b5cf6" name="Actual Revenue" />
                <Area type="monotone" dataKey="profit" stroke="#10b981" fill="url(#colorProfit)" name="Profit" />
                <Line type="monotone" dataKey="orders" stroke="#06b6d4" strokeWidth={2} name="Orders" dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Targets & KPIs */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Monthly Targets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {monthlyTargets.map((target, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-foreground">{target.metric}</span>
                  <span className={`text-sm font-bold ${target.percentage >= 100 ? 'text-green-600' : 'text-orange-600'}`}>
                    {target.percentage}%
                  </span>
                </div>
                <Progress 
                  value={Math.min(target.percentage, 100)} 
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{target.current.toLocaleString()}</span>
                  <span>Target: {target.target.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Product Revenue Mix */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Revenue by Service Line</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={productRevenue}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="revenue"
                >
                  {productRevenue.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {productRevenue.map((product, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: product.color }}
                      />
                      <span className="text-muted-foreground">{product.name}</span>
                    </div>
                    <span className="font-medium">${product.revenue.toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-muted-foreground ml-5 flex justify-between">
                    <span>{product.orders} orders</span>
                    <span className="text-green-600">{product.margin}% margin</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sales Team Performance */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Sales Team Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {salesTeamData.map((rep, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {rep.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        {rep.performance >= 120 && (
                          <Award className="w-3 h-3 text-yellow-500 absolute -top-1 -right-1" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{rep.name}</p>
                        <p className="text-xs text-muted-foreground">{rep.region} Region • {rep.deals} deals</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">${rep.revenue.toLocaleString()}</p>
                      <p className={`text-xs ${rep.performance >= 100 ? 'text-green-600' : 'text-orange-600'}`}>
                        {rep.performance}% of quota
                      </p>
                    </div>
                  </div>
                  <Progress 
                    value={Math.min(rep.performance, 100)} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sales Pipeline & Recent Deals */}
        <Card className="lg:col-span-3 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Sales Pipeline & Recent Activity
              <Badge variant="outline">${recentDeals.reduce((sum, deal) => sum + deal.value, 0).toLocaleString()} in pipeline</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-sm font-semibold text-muted-foreground">Client</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-muted-foreground">Service</th>
                    <th className="text-right py-3 px-2 text-sm font-semibold text-muted-foreground">Value</th>
                    <th className="text-center py-3 px-2 text-sm font-semibold text-muted-foreground">Stage</th>
                    <th className="text-center py-3 px-2 text-sm font-semibold text-muted-foreground">Probability</th>
                    <th className="text-center py-3 px-2 text-sm font-semibold text-muted-foreground">Status</th>
                    <th className="text-right py-3 px-2 text-sm font-semibold text-muted-foreground">Expected Close</th>
                  </tr>
                </thead>
                <tbody>
                  {recentDeals.map((deal, index) => (
                    <tr key={index} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-2 font-medium text-foreground">{deal.client}</td>
                      <td className="py-4 px-2 text-sm text-muted-foreground">{deal.service}</td>
                      <td className="text-right py-4 px-2 font-medium">${deal.value.toLocaleString()}</td>
                      <td className="text-center py-4 px-2">
                        <Badge variant="secondary" className="text-xs">
                          {deal.stage}
                        </Badge>
                      </td>
                      <td className="text-center py-4 px-2">
                        <div className="flex items-center justify-center">
                          <Progress value={deal.probability} className="w-12 h-2 mr-2" />
                          <span className="text-xs text-muted-foreground">{deal.probability}%</span>
                        </div>
                      </td>
                      <td className="text-center py-4 px-2">
                        <Badge 
                          variant={deal.status === 'Closed Won' ? 'default' : deal.status === 'Negotiation' ? 'secondary' : 'outline'}
                          className="text-xs"
                        >
                          {deal.status}
                        </Badge>
                      </td>
                      <td className="text-right py-4 px-2 text-sm text-muted-foreground">{deal.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SalesDashboard;