import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, ComposedChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Users, Eye, MousePointer, DollarSign, Target, BarChart3 } from 'lucide-react';

const monthlyData = [
  { month: 'Jan', revenue: 45000, visitors: 12500, conversions: 890, ctr: 3.2, impressions: 285000 },
  { month: 'Feb', revenue: 52000, visitors: 14200, conversions: 1020, ctr: 3.8, impressions: 295000 },
  { month: 'Mar', revenue: 48000, visitors: 13800, conversions: 950, ctr: 3.5, impressions: 278000 },
  { month: 'Apr', revenue: 61000, visitors: 16500, conversions: 1180, ctr: 4.1, impressions: 312000 },
  { month: 'May', revenue: 58000, visitors: 15900, conversions: 1120, ctr: 3.9, impressions: 298000 },
  { month: 'Jun', revenue: 67000, visitors: 18200, conversions: 1350, ctr: 4.3, impressions: 325000 },
];

const trafficSources = [
  { name: 'Organic Search', value: 42, color: '#8b5cf6', sessions: 7644 },
  { name: 'Social Media', value: 28, color: '#06b6d4', sessions: 5096 },
  { name: 'Direct Traffic', value: 18, color: '#10b981', sessions: 3276 },
  { name: 'Email Marketing', value: 8, color: '#f59e0b', sessions: 1456 },
  { name: 'Paid Ads', value: 4, color: '#ef4444', sessions: 728 },
];

const campaignPerformance = [
  { campaign: 'Video Ad Campaign', impressions: 125000, clicks: 4200, conversions: 180, spend: 3200, roas: 8.4 },
  { campaign: 'Social Media Push', impressions: 89000, clicks: 2800, conversions: 95, spend: 1800, roas: 4.9 },
  { campaign: 'Email Newsletter', impressions: 45000, clicks: 1900, conversions: 120, spend: 500, roas: 12.0 },
  { campaign: 'Display Retargeting', impressions: 156000, clicks: 3100, conversions: 85, spend: 2400, roas: 3.5 },
  { campaign: 'LinkedIn Ads', impressions: 32000, clicks: 890, conversions: 42, spend: 980, roas: 4.3 },
];

const topPerformingContent = [
  { title: 'Product Demo Video', views: 15420, engagement: 8.5, conversions: 145 },
  { title: 'How-to Tutorial Series', views: 12890, engagement: 7.2, conversions: 98 },
  { title: 'Customer Success Story', views: 9650, engagement: 9.1, conversions: 87 },
  { title: 'Behind the Scenes', views: 8420, engagement: 6.8, conversions: 52 },
  { title: 'Industry Insights Blog', views: 7230, engagement: 5.9, conversions: 41 },
];

const MarketingDashboard = () => {
  const currentMonth = monthlyData[monthlyData.length - 1];
  const previousMonth = monthlyData[monthlyData.length - 2];
  const revenueGrowth = ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue * 100).toFixed(1);
  const visitorGrowth = ((currentMonth.visitors - previousMonth.visitors) / previousMonth.visitors * 100).toFixed(1);

  return (
    <div className="p-6 bg-background min-h-screen space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Marketing Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">Comprehensive performance insights and campaign metrics</p>
        </div>
        <Badge variant="secondary" className="px-3 py-1">
          <TrendingUp className="w-4 h-4 mr-1" />
          +{revenueGrowth}% vs last month
        </Badge>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-bold text-foreground">${currentMonth.revenue.toLocaleString()}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +{revenueGrowth}%
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
                <p className="text-sm text-muted-foreground">Website Visitors</p>
                <p className="text-2xl font-bold text-foreground">{currentMonth.visitors.toLocaleString()}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +{visitorGrowth}%
                </p>
              </div>
              <Users className="w-8 h-8 text-coral" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold text-foreground">{currentMonth.ctr}%</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +0.4%
                </p>
              </div>
              <Target className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Impressions</p>
                <p className="text-2xl font-bold text-foreground">{(currentMonth.impressions / 1000).toFixed(0)}K</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +9.1%
                </p>
              </div>
              <Eye className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Chart */}
        <Card className="lg:col-span-2 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Revenue & Visitor Trends
              <Badge variant="outline">6 Month View</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <ComposedChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis yAxisId="left" stroke="#6b7280" />
                <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }} 
                />
                <Area 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8b5cf6" 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
                <Line yAxisId="right" type="monotone" dataKey="visitors" stroke="#06b6d4" strokeWidth={3} dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }} />
                <Bar yAxisId="left" dataKey="conversions" fill="#10b981" opacity={0.7} />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={trafficSources}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {trafficSources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value}%`, name]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {trafficSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-3" 
                      style={{ backgroundColor: source.color }}
                    />
                    <div>
                      <p className="text-sm font-medium text-foreground">{source.name}</p>
                      <p className="text-xs text-muted-foreground">{source.sessions.toLocaleString()} sessions</p>
                    </div>
                  </div>
                  <span className="font-semibold text-sm">{source.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Campaign Performance Table */}
        <Card className="lg:col-span-3 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Campaign Performance Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-sm font-semibold text-muted-foreground">Campaign</th>
                    <th className="text-right py-3 px-2 text-sm font-semibold text-muted-foreground">Impressions</th>
                    <th className="text-right py-3 px-2 text-sm font-semibold text-muted-foreground">Clicks</th>
                    <th className="text-right py-3 px-2 text-sm font-semibold text-muted-foreground">CTR</th>
                    <th className="text-right py-3 px-2 text-sm font-semibold text-muted-foreground">Conversions</th>
                    <th className="text-right py-3 px-2 text-sm font-semibold text-muted-foreground">Spend</th>
                    <th className="text-right py-3 px-2 text-sm font-semibold text-muted-foreground">ROAS</th>
                    <th className="text-right py-3 px-2 text-sm font-semibold text-muted-foreground">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {campaignPerformance.map((campaign, index) => {
                    const ctr = ((campaign.clicks / campaign.impressions) * 100).toFixed(2);
                    const conversionRate = ((campaign.conversions / campaign.clicks) * 100).toFixed(1);
                    return (
                      <tr key={index} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-4 px-2 font-medium text-foreground">{campaign.campaign}</td>
                        <td className="text-right py-4 px-2 text-sm">{campaign.impressions.toLocaleString()}</td>
                        <td className="text-right py-4 px-2 text-sm">{campaign.clicks.toLocaleString()}</td>
                        <td className="text-right py-4 px-2 text-sm">{ctr}%</td>
                        <td className="text-right py-4 px-2 text-sm font-medium">{campaign.conversions}</td>
                        <td className="text-right py-4 px-2 text-sm">${campaign.spend.toLocaleString()}</td>
                        <td className="text-right py-4 px-2 text-sm font-bold text-green-600">{campaign.roas}x</td>
                        <td className="text-right py-4 px-2">
                          <Progress 
                            value={Math.min((campaign.roas / 12) * 100, 100)} 
                            className="w-16 h-2" 
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Content */}
        <Card className="lg:col-span-2 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Top Performing Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformingContent.map((content, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">{content.title}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-muted-foreground">{content.views.toLocaleString()} views</span>
                      <span className="text-xs text-muted-foreground">{content.engagement}% engagement</span>
                      <span className="text-xs text-green-600 font-medium">{content.conversions} conversions</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">#{index + 1}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Engagement Metrics */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Engagement Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Avg. Session Duration</span>
                <span className="font-semibold">4m 32s</span>
              </div>
              <Progress value={76} className="h-2" />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Bounce Rate</span>
                <span className="font-semibold text-green-600">28.4%</span>
              </div>
              <Progress value={28} className="h-2" />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Pages per Session</span>
                <span className="font-semibold">3.7</span>
              </div>
              <Progress value={74} className="h-2" />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Email Open Rate</span>
                <span className="font-semibold text-primary">31.2%</span>
              </div>
              <Progress value={62} className="h-2" />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Social Engagement</span>
                <span className="font-semibold text-coral">8.9%</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MarketingDashboard;