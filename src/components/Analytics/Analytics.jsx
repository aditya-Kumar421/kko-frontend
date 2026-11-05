import { motion } from 'framer-motion';
import {
    Activity,
    BarChart3,
    Clock,
    Download,
    FileText,
    Filter,
    MessageSquare,
    Target,
    TrendingUp,
    Users,
    Zap
} from 'lucide-react';
import { useState } from 'react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ComposedChart,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

// Comprehensive mock data for analytics
const generateAnalyticsData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const departments = ['Operations', 'Engineering', 'Procurement', 'Safety', 'Legal', 'Finance'];
  const docTypes = ['Safety Manual', 'Engineering Report', 'Procurement Order', 'Legal Document', 'Maintenance Log'];
  
  return {
    monthlyTrends: months.map((month, i) => ({
      month,
      documents: Math.floor(Math.random() * 50) + 20,
      questions: Math.floor(Math.random() * 200) + 100,
      processingTime: Math.random() * 3 + 1,
      accuracy: Math.random() * 10 + 90,
    })),
    
    departmentUsage: departments.map((dept, i) => ({
      name: dept,
      documents: Math.floor(Math.random() * 100) + 50,
      questions: Math.floor(Math.random() * 500) + 200,
      avgTime: Math.random() * 2 + 1,
      satisfaction: Math.random() * 20 + 80,
      color: ['#3b82f6', '#059669', '#ea580c', '#dc2626', '#7c3aed', '#f59e0b'][i]
    })),
    
    documentTypes: docTypes.map((type, i) => ({
      name: type,
      count: Math.floor(Math.random() * 30) + 10,
      avgSize: Math.random() * 5 + 1,
      processingTime: Math.random() * 4 + 1,
    })),
    
    hourlyActivity: [...Array(24)].map((_, i) => ({
      hour: i,
      activity: Math.floor(Math.random() * 20) + (i >= 9 && i <= 17 ? 30 : 5),
    })),
    
    responseTimeDistribution: [
      { range: '0-1s', count: 45, percentage: 45 },
      { range: '1-2s', count: 32, percentage: 32 },
      { range: '2-5s', count: 18, percentage: 18 },
      { range: '5s+', count: 5, percentage: 5 },
    ],
    
    accuracyTrends: [...Array(30)].map((_, i) => ({
      day: i + 1,
      accuracy: Math.random() * 15 + 85,
      confidence: Math.random() * 20 + 80,
    })),
  };
};

const MetricCard = ({ icon: Icon, title, value, change, color = "primary", subtitle, trend }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-secondary-800/50 backdrop-blur-sm border border-secondary-700/50 rounded-xl p-6 hover:border-primary-500/50 transition-all duration-300"
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 bg-${color}/20 rounded-lg border border-${color}/30`}>
        <Icon className={`w-6 h-6 text-${color}`} />
      </div>
      {change && (
        <motion.div 
          className={`flex items-center text-sm px-2 py-1 rounded-lg ${
            trend === 'up' ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'
          }`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <TrendingUp className={`w-3 h-3 mr-1 ${trend === 'down' ? 'rotate-180' : ''}`} />
          {change}
        </motion.div>
      )}
    </div>
    <div>
      <h3 className="text-secondary-400 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      {subtitle && <p className="text-secondary-500 text-sm">{subtitle}</p>}
    </div>
  </motion.div>
);

const ChartCard = ({ title, icon: Icon, children, fullWidth = false }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-secondary-800/50 backdrop-blur-sm border border-secondary-700/50 rounded-xl p-6 ${
      fullWidth ? 'col-span-full' : ''
    }`}
  >
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-3">
        {Icon && <Icon className="w-5 h-5 text-primary-400" />}
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <button className="p-2 text-secondary-400 hover:text-white transition-colors">
        <Download className="w-4 h-4" />
      </button>
    </div>
    {children}
  </motion.div>
);

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [analyticsData] = useState(generateAnalyticsData());

  const timeRanges = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
          <p className="text-secondary-300">Comprehensive insights into document processing and AI interactions</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-secondary-800 border border-secondary-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
          >
            {timeRanges.map(range => (
              <option key={range.value} value={range.value}>{range.label}</option>
            ))}
          </select>
          
          <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-white transition-colors flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={FileText}
          title="Documents Processed"
          value="1,234"
          change="+12%"
          trend="up"
          color="primary-600"
          subtitle="This month"
        />
        <MetricCard
          icon={MessageSquare}
          title="Questions Answered"
          value="5,678"
          change="+8%"
          trend="up"
          color="accent-600"
          subtitle="Total interactions"
        />
        <MetricCard
          icon={Clock}
          title="Avg Response Time"
          value="1.8s"
          change="-15%"
          trend="up"
          color="green-600"
          subtitle="Last 30 days"
        />
        <MetricCard
          icon={Target}
          title="Accuracy Rate"
          value="96.2%"
          change="+2.1%"
          trend="up"
          color="blue-600"
          subtitle="AI responses"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <ChartCard title="Document Processing Trends" icon={TrendingUp}>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={analyticsData.monthlyTrends}>
              <defs>
                <linearGradient id="documentsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis yAxisId="left" stroke="#9ca3af" />
              <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="documents"
                fill="url(#documentsGradient)"
                stroke="#3b82f6"
                strokeWidth={2}
              />
              <Bar yAxisId="right" dataKey="questions" fill="#dc55ee" opacity={0.6} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Department Usage */}
        <ChartCard title="Department Usage Distribution" icon={Users}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData.departmentUsage}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="documents"
              >
                {analyticsData.departmentUsage.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Response Time Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard title="Response Time Distribution" icon={Clock}>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analyticsData.responseTimeDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="range" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Bar 
                dataKey="percentage" 
                fill="#059669"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Hourly Activity Pattern" icon={Activity}>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={analyticsData.hourlyActivity}>
              <defs>
                <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ea580c" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ea580c" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="hour" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Area
                type="monotone"
                dataKey="activity"
                stroke="#ea580c"
                fill="url(#activityGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Document Type Breakdown" icon={BarChart3}>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analyticsData.documentTypes} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9ca3af" />
              <YAxis dataKey="name" type="category" stroke="#9ca3af" width={80} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="count" fill="#7c3aed" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

    

      {/* Performance Summary */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-r from-primary-600/20 to-accent-600/20 rounded-xl p-6 border border-primary-600/30"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Performance Summary</h3>
            <p className="text-secondary-300">
              System is performing excellently with 96.2% accuracy and 1.8s average response time.
              Total of 1,234 documents processed and 5,678 questions answered this month.
            </p>
          </div>
          <motion.div
            animate={{ rotate: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-4xl"
          >
            📊
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Analytics;