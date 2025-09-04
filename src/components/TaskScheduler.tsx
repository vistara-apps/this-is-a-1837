import { useState, useEffect } from 'react'
import { useCRM } from '../context/CRMContext'
import { X } from 'lucide-react'
import { Task } from '../types'

interface TaskSchedulerProps {
  task?: Task | null;
  onClose: () => void;
}

export function TaskScheduler({ task, onClose }: TaskSchedulerProps) {
  const { contacts, addTask, updateTask } = useCRM();
  const [formData, setFormData] = useState({
    description: '',
    contactId: '',
    dueDate: new Date().toISOString().slice(0, 16),
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  useEffect(() => {
    if (task) {
      setFormData({
        description: task.description,
        contactId: task.contactId || '',
        dueDate: task.dueDate.toISOString().slice(0, 16),
        priority: task.priority
      });
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const taskData = {
      ...formData,
      dueDate: new Date(formData.dueDate),
      contactId: formData.contactId || undefined,
      userId: 'user_1', // In a real app, this would come from auth
      completed: false
    };

    if (task) {
      updateTask(task.taskId, taskData);
    } else {
      addTask(taskData);
    }
    
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="card p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            {task ? 'Edit Task' : 'Create Task'}
          </h2>
          <button onClick={onClose} className="text-dark-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className="input-field w-full resize-none"
              placeholder="Describe the task..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Related Contact (Optional)
            </label>
            <select
              name="contactId"
              value={formData.contactId}
              onChange={handleChange}
              className="input-field w-full"
            >
              <option value="">No specific contact</option>
              {contacts.map(contact => (
                <option key={contact.contactId} value={contact.contactId}>
                  {contact.name} - {contact.company || contact.email}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Due Date *
            </label>
            <input
              type="datetime-local"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              required
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Priority *
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="input-field w-full"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <button type="submit" className="btn-primary flex-1">
              {task ? 'Update Task' : 'Create Task'}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}