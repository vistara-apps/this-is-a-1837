import React, { useState } from 'react'
import { useCRM } from '../context/CRMContext'
import { X } from 'lucide-react'

interface InteractionLogProps {
  onClose: () => void;
}

export function InteractionLog({ onClose }: InteractionLogProps) {
  const { contacts, addInteraction } = useCRM();
  const [formData, setFormData] = useState({
    contactId: '',
    type: 'call' as 'call' | 'email' | 'meeting' | 'note',
    dateTime: new Date().toISOString().slice(0, 16),
    notes: '',
    followUpRequired: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.contactId) {
      alert('Please select a contact');
      return;
    }

    const interactionData = {
      ...formData,
      dateTime: new Date(formData.dateTime),
      userId: 'user_1' // In a real app, this would come from auth
    };

    addInteraction(interactionData);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="card p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Log Interaction</h2>
          <button onClick={onClose} className="text-dark-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Contact *
            </label>
            <select
              name="contactId"
              value={formData.contactId}
              onChange={handleChange}
              required
              className="input-field w-full"
            >
              <option value="">Select a contact</option>
              {contacts.map(contact => (
                <option key={contact.contactId} value={contact.contactId}>
                  {contact.name} - {contact.company || contact.email}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Type *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="input-field w-full"
            >
              <option value="call">Phone Call</option>
              <option value="email">Email</option>
              <option value="meeting">Meeting</option>
              <option value="note">Note</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Date & Time *
            </label>
            <input
              type="datetime-local"
              name="dateTime"
              value={formData.dateTime}
              onChange={handleChange}
              required
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Notes *
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              required
              rows={4}
              className="input-field w-full resize-none"
              placeholder="Describe the interaction..."
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="followUpRequired"
              checked={formData.followUpRequired}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="text-sm text-dark-300">
              Follow-up required
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
            <button type="submit" className="btn-primary flex-1">
              Log Interaction
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