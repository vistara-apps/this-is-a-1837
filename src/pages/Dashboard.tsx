import { DashboardWidget } from '../components/DashboardWidget'
import { useCRM } from '../context/CRMContext'
import { Users, MessageCircle, CheckSquare, TrendingUp, AlertCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import { format, subDays, startOfDay } from 'date-fns'

export function Dashboard() {
  const { stats, interactions, tasks, contacts } = useCRM();

  // Generate interaction data for the last 7 days
  const interactionData = Array.from({ length: 7 }, (_, i) => {
    const date = startOfDay(subDays(new Date(), 6 - i));
    const dayInteractions = interactions.filter(interaction => 
      startOfDay(interaction.dateTime).getTime() === date.getTime()
    ).length;
    
    return {
      date: format(date, 'MMM dd'),
      interactions: dayInteractions
    };
  });

  const overdueTasks = tasks.filter(task => 
    !task.completed && task.dueDate < new Date()
  );

  const recentInteractions = interactions
    .sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime())
    .slice(0, 5);

  const upcomingTasks = tasks
    .filter(task => !task.completed)
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Dashboard</h1>
          <p className="mt-2 text-dark-400">Welcome back! Here's what's happening with your contacts.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="btn-primary">
            New Interaction
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <DashboardWidget variant="summary">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-dark-400">Total Contacts</p>
              <p className="text-2xl font-bold text-white">{stats.totalContacts}</p>
            </div>
          </div>
        </DashboardWidget>

        <DashboardWidget variant="summary">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <MessageCircle className="h-8 w-8 text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-dark-400">Interactions</p>
              <p className="text-2xl font-bold text-white">{stats.totalInteractions}</p>
            </div>
          </div>
        </DashboardWidget>

        <DashboardWidget variant="summary">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckSquare className="h-8 w-8 text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-dark-400">Pending Tasks</p>
              <p className="text-2xl font-bold text-white">{stats.pendingTasks}</p>
            </div>
          </div>
        </DashboardWidget>

        <DashboardWidget variant="summary">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-dark-400">This Week</p>
              <p className="text-2xl font-bold text-white">{stats.thisWeekInteractions}</p>
            </div>
          </div>
        </DashboardWidget>
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interaction Chart */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Interaction Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={interactionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Bar dataKey="interactions" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Overdue Tasks Alert */}
        <div className="card p-6">
          <div className="flex items-center mb-4">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <h3 className="text-lg font-semibold text-white">Alerts & Notifications</h3>
          </div>
          
          {overdueTasks.length > 0 ? (
            <div className="space-y-3">
              <div className="bg-red-500/10 border border-red-500/20 rounded-md p-3">
                <p className="text-red-400 font-medium">
                  {overdueTasks.length} overdue task{overdueTasks.length > 1 ? 's' : ''}
                </p>
                {overdueTasks.slice(0, 3).map(task => (
                  <p key={task.taskId} className="text-sm text-dark-300 mt-1">
                    • {task.description}
                  </p>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-green-500/10 border border-green-500/20 rounded-md p-3">
              <p className="text-green-400">All tasks are up to date! 🎉</p>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-dark-700">
            <h4 className="font-medium text-white mb-2">Quick Actions</h4>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-sm text-dark-300 hover:text-white hover:bg-dark-700 rounded-md transition-colors">
                + Add new contact
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-dark-300 hover:text-white hover:bg-dark-700 rounded-md transition-colors">
                📞 Log interaction
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-dark-300 hover:text-white hover:bg-dark-700 rounded-md transition-colors">
                ✅ Create task
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Interactions */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Interactions</h3>
          <div className="space-y-4">
            {recentInteractions.map(interaction => {
              const contact = contacts.find(c => c.contactId === interaction.contactId);
              return (
                <div key={interaction.interactionId} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-white">
                      {contact?.name.split(' ').map(n => n[0]).join('') || '??'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">
                      {interaction.type.charAt(0).toUpperCase() + interaction.type.slice(1)} with {contact?.name}
                    </p>
                    <p className="text-xs text-dark-400">
                      {format(interaction.dateTime, 'MMM dd, yyyy')}
                    </p>
                    <p className="text-sm text-dark-300 mt-1 truncate">
                      {interaction.notes}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Upcoming Tasks</h3>
          <div className="space-y-4">
            {upcomingTasks.map(task => {
              const contact = task.contactId ? contacts.find(c => c.contactId === task.contactId) : null;
              const isOverdue = task.dueDate < new Date();
              
              return (
                <div key={task.taskId} className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 w-4 h-4 rounded border-2 mt-1 ${
                    task.priority === 'high' ? 'border-red-400' :
                    task.priority === 'medium' ? 'border-yellow-400' : 'border-green-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">
                      {task.description}
                    </p>
                    {contact && (
                      <p className="text-xs text-dark-400">for {contact.name}</p>
                    )}
                    <p className={`text-xs ${isOverdue ? 'text-red-400' : 'text-dark-400'}`}>
                      Due: {format(task.dueDate, 'MMM dd, yyyy')}
                      {isOverdue && ' (Overdue)'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
