import { useState } from 'react'
import { useCRM } from '../context/CRMContext'
import { TaskScheduler } from '../components/TaskScheduler'
import { Plus, Search, Filter, Calendar, CheckCircle, Circle, Clock, AlertCircle } from 'lucide-react'
import { format, isToday, isTomorrow, isPast } from 'date-fns'
import { Task } from '../types'

export function Tasks() {
  const { tasks, contacts, updateTask, deleteTask } = useCRM();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  const filteredTasks = tasks
    .filter(task => {
      const contact = task.contactId ? contacts.find(c => c.contactId === task.contactId) : null;
      const matchesSearch = task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (contact?.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = filterStatus === 'all' || 
                           (filterStatus === 'completed' && task.completed) ||
                           (filterStatus === 'pending' && !task.completed) ||
                           (filterStatus === 'overdue' && !task.completed && isPast(task.dueDate));
      
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
      
      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      // Sort by completion status first, then by due date
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      return a.dueDate.getTime() - b.dueDate.getTime();
    });

  const handleToggleComplete = (taskId: string, completed: boolean) => {
    updateTask(taskId, { completed });
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const getDateStatus = (date: Date, completed: boolean) => {
    if (completed) return 'completed';
    if (isPast(date)) return 'overdue';
    if (isToday(date)) return 'today';
    if (isTomorrow(date)) return 'tomorrow';
    return 'upcoming';
  };

  const getDateColor = (status: string) => {
    switch (status) {
      case 'overdue':
        return 'text-red-400';
      case 'today':
        return 'text-yellow-400';
      case 'tomorrow':
        return 'text-blue-400';
      case 'completed':
        return 'text-green-400';
      default:
        return 'text-dark-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-400 bg-red-400/10';
      case 'medium':
        return 'border-yellow-400 bg-yellow-400/10';
      case 'low':
        return 'border-green-400 bg-green-400/10';
      default:
        return 'border-dark-600 bg-dark-700/50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Tasks</h1>
          <p className="mt-2 text-dark-400">Manage your follow-ups and action items.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button 
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center"
          >
            <Plus size={16} className="mr-2" />
            Create Task
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10 w-full"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-dark-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="input-field"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.map(task => {
          const contact = task.contactId ? contacts.find(c => c.contactId === task.contactId) : null;
          const dateStatus = getDateStatus(task.dueDate, task.completed);
          
          return (
            <div key={task.taskId} className={`card p-4 ${task.completed ? 'opacity-75' : ''}`}>
              <div className="flex items-start space-x-4">
                <button
                  onClick={() => handleToggleComplete(task.taskId, !task.completed)}
                  className="flex-shrink-0 mt-1"
                >
                  {task.completed ? (
                    <CheckCircle size={20} className="text-green-400" />
                  ) : (
                    <Circle size={20} className="text-dark-400 hover:text-white" />
                  )}
                </button>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className={`text-lg font-medium ${task.completed ? 'line-through text-dark-400' : 'text-white'}`}>
                        {task.description}
                      </h3>
                      {contact && (
                        <p className="text-sm text-dark-400 mt-1">
                          Related to: {contact.name}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <span className={`px-2 py-1 rounded-md text-xs border ${getPriorityColor(task.priority)}`}>
                        {task.priority.toUpperCase()}
                      </span>
                      <button
                        onClick={() => handleEdit(task)}
                        className="text-dark-400 hover:text-white text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTask(task.taskId)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm">
                    <div className={`flex items-center ${getDateColor(dateStatus)}`}>
                      {dateStatus === 'overdue' && <AlertCircle size={14} className="mr-1" />}
                      {dateStatus === 'today' && <Clock size={14} className="mr-1" />}
                      <Calendar size={14} className="mr-1" />
                      <span>
                        Due: {format(task.dueDate, 'MMM dd, yyyy')}
                        {dateStatus === 'overdue' && ' (Overdue)'}
                        {dateStatus === 'today' && ' (Today)'}
                        {dateStatus === 'tomorrow' && ' (Tomorrow)'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <CheckCircle size={48} className="mx-auto text-dark-600 mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">
            {searchTerm || filterStatus !== 'all' || filterPriority !== 'all' 
              ? 'No tasks found' 
              : 'No tasks yet'
            }
          </h3>
          <p className="text-dark-400 mb-4">
            {searchTerm || filterStatus !== 'all' || filterPriority !== 'all'
              ? 'Try adjusting your search or filters.'
              : 'Create your first task to get started.'
            }
          </p>
          {!searchTerm && filterStatus === 'all' && filterPriority === 'all' && (
            <button 
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              Create Your First Task
            </button>
          )}
        </div>
      )}

      {/* Task Form Modal */}
      {showForm && (
        <TaskScheduler
          task={editingTask}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}
