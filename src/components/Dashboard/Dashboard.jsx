import { motion } from 'framer-motion';
import {
  Activity,
  BarChart3,
  Clock,
  FileText,
  MessageSquare,
  TrendingUp,
  Upload,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { translations } from "../../locales/translations";

const StatCard = ({ icon: Icon, label, value, change, color = "primary", trend }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="bg-secondary-800/50 backdrop-blur-sm border border-secondary-700/50 rounded-xl p-6 hover:border-primary-500/50 transition-all duration-300"
  >
    <div className="flex items-start justify-between">
      <div className="flex items-center space-x-3">
        <div className={`p-3 bg-${color}-600/20 rounded-lg border border-${color}-600/30`}>
          <Icon className={`w-6 h-6 text-${color}-400`} />
        </div>
        <div>
          <p className="text-secondary-400 text-sm font-medium">{label}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
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
          <TrendingUp className="w-3 h-3 mr-1" />
          {change}
        </motion.div>
      )}
    </div>
  </motion.div>
);


const QuickActionCard = ({ icon: Icon, title, description, action, color = "primary" }) => (
  <motion.button
    onClick={action}
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    className="w-full text-left bg-gradient-to-br from-secondary-800/50 to-secondary-700/30 backdrop-blur-sm border border-secondary-700/50 rounded-xl p-6 hover:border-primary-500/50 transition-all duration-300 group"
  >
    <div className="flex items-start space-x-4">
      <div className={`p-3 bg-${color}-600/20 rounded-lg border border-${color}-600/30 group-hover:bg-${color}-600/30 transition-colors`}>
        <Icon className={`w-6 h-6 text-${color}-400`} />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-white text-lg">{title}</h3>
        <p className="text-secondary-400 text-sm mt-1">{description}</p>
      </div>
    </div>
  </motion.button>
);

const RecentActivityItem = ({ activity }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="flex items-center space-x-3 py-3"
  >
    <div className="w-2 h-2 bg-primary-400 rounded-full" />
    <div className="flex-1">
      <p className="text-white text-sm">
        {activity.type === 'upload' ? 'Document uploaded:' : 'Question asked about:'} 
        <span className="font-medium ml-1">{activity.document}</span>
      </p>
      <p className="text-secondary-400 text-xs">
        {new Date(activity.timestamp).toLocaleTimeString()}
      </p>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { state } = useApp();
  const navigate = useNavigate();
  const t = translations[state.language].dashboard;

  const activityData = [
    { name: 'Mon', documents: 12, questions: 45 },
    { name: 'Tue', documents: 19, questions: 52 },
    { name: 'Wed', documents: 8, questions: 38 },
    { name: 'Thu', documents: 15, questions: 67 },
    { name: 'Fri', documents: 22, questions: 84 },
    { name: 'Sat', documents: 6, questions: 23 },
    { name: 'Sun', documents: 4, questions: 18 },
  ];

  const departmentData = [
    { name: 'Operations', value: 35, color: '#3b82f6' },
    { name: 'Engineering', value: 25, color: '#059669' },
    { name: 'Procurement', value: 20, color: '#ea580c' },
    { name: 'Safety', value: 12, color: '#dc2626' },
    { name: 'Legal', value: 8, color: '#7c3aed' },
  ];

  const processingTimeData = [
    { time: '0-1s', count: 45 },
    { time: '1-3s', count: 32 },
    { time: '3-5s', count: 18 },
    { time: '5s+', count: 5 },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-600/20 to-accent-600/20 rounded-xl p-6 border border-primary-600/30"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{t.welcome}</h1>
            <p className="text-secondary-300">{t.description}</p>
          </div>
          <motion.div
            animate={{ rotate: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl"
          >
            🚇
          </motion.div>
        </div>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={FileText}
          label={t.totalDocuments}
          value={state.analytics.totalDocuments || 0}
          change="+12%"
          trend="up"
          color="primary"
        />
        <StatCard
          icon={MessageSquare}
          label={t.questionsAsked}
          value={state.analytics.totalQuestions || 0}
          change="+8%"
          trend="up"
          color="accent"
        />
        <StatCard
          icon={Clock}
          label={t.avgProcessingTime}
          value="2.3s"
          change="-15%"
          trend="up"
          color="metro-green"
        />
        <StatCard
          icon={Users}
          label={t.activeDepartments}
          value="5"
          change="+1"
          trend="up"
          color="metro-orange"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-secondary-800/50 backdrop-blur-sm border border-secondary-700/50 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Activity className="w-5 h-5 text-primary-400 mr-2" />
            {t.weeklyActivity}
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="documentsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="questionsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#dc55ee" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#dc55ee" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
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
                dataKey="documents"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#documentsGradient)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="questions"
                stroke="#dc55ee"
                fillOpacity={1}
                fill="url(#questionsGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-secondary-800/50 backdrop-blur-sm border border-secondary-700/50 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 text-accent-400 mr-2" />
            {t.departmentUsage}
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={departmentData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {departmentData.map((entry, index) => (
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
        </motion.div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-secondary-800/50 backdrop-blur-sm border border-secondary-700/50 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">{t.quickActions}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <QuickActionCard
              icon={Upload}
              title={t.uploadDocument}
              description={t.uploadDescription}
              action={() => navigate('/upload')}
              color="primary"
            />
            <QuickActionCard
              icon={MessageSquare}
              title={t.askAssistant}
              description={t.askDescription}
              action={() => navigate('/chat')}
              color="accent"
            />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-secondary-800/50 backdrop-blur-sm border border-secondary-700/50 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">{t.recentActivity}</h3>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {state.analytics.recentActivity.length > 0 ? (
              state.analytics.recentActivity.map((activity, index) => (
                <RecentActivityItem key={index} activity={activity} />
              ))
            ) : (
              <div className="text-center py-8 text-secondary-400">
                <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>{t.noActivity}</p>
                <p className="text-xs mt-1">{t.noActivityMessage}</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-secondary-800/50 backdrop-blur-sm border border-secondary-700/50 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Clock className="w-5 h-5 text-metro-green mr-2" />
          {t.processingTime}
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={processingTimeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #374151',
                borderRadius: '8px'
              }}
            />
            <Bar 
              dataKey="count" 
              fill="#059669"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default Dashboard;