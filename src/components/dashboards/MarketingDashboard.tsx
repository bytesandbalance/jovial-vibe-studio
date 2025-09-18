import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Users, DollarSign, Eye, MousePointerClick } from 'lucide-react';

const campaignData = [
  { name: 'Jan', revenue: 4200, clicks: 2400, impressions: 24000 },
  { name: 'Feb', revenue: 3800, clicks: 1800, impressions: 18000 },
  { name: 'Mar', revenue: 5200, clicks: 3200, impressions: 32000 },
  { name: 'Apr', revenue: 4800, clicks: 2800, impressions: 28000 },
  { name: 'May', revenue: 6400, clicks: 4100, impressions: 41000 },
  { name: 'Jun', revenue: 7200, clicks: 4800, impressions: 48000 },
];

const channelData = [
  { name: 'Social Media', value: 35, color: '#8b5cf6' },
  { name: 'Google Ads', value: 28, color: '#06b6d4' },
  { name: 'Email', value: 20, color: '#10b981' },
  { name: 'Direct', value: 17, color: '#f59e0b' },
];

const MarketingDashboard = () => {
  return (
    <div className="p-6 space-y-6 bg-background min-h-[500px]">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Marketing Performance</h2>
        <span className="text-sm text-muted-foreground">Last 6 months</span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-muted-foreground">Revenue</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-foreground">$31.6K</div>
              <div className="flex items-center text-green-500 text-sm">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.5%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MousePointerClick className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-muted-foreground">Clicks</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-foreground">20.1K</div>
              <div className="flex items-center text-green-500 text-sm">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8.2%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium text-muted-foreground">Impressions</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-foreground">191K</div>
              <div className="flex items-center text-green-500 text-sm">
                <TrendingUp className="h-3 w-3 mr-1" />
                +15.3%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium text-muted-foreground">CTR</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-foreground">10.5%</div>
              <div className="flex items-center text-red-500 text-sm">
                <TrendingDown className="h-3 w-3 mr-1" />
                -2.1%
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Revenue & Clicks Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={campaignData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                    color: 'hsl(var(--foreground))'
                  }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6' }} />
                <Line type="monotone" dataKey="clicks" stroke="#06b6d4" strokeWidth={2} dot={{ fill: '#06b6d4' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={channelData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                    color: 'hsl(var(--foreground))'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MarketingDashboard;