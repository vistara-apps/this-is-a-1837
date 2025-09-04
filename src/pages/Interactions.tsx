import { useState } from 'react'
import { useCRM } from '../context/CRMContext'
import { InteractionLog } from '../components/InteractionLog'
import { Plus, Search, Filter, Phone, Mail, Calendar, MessageSquare } from 'lucide-react'
import { format } from 'date-fns'

export function Interactions() {
  const { interactions, contacts } = useCRM();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredInteractions = interactions
    .filter(interaction => {
      const contact = contacts.find(c => c.contactId === interaction.contactId);
      const matchesSearch = contact?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           interaction.notes.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || interaction.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <Phone size={16} className="text-blue-400" />;
      case 'email':
        return <Mail size={16} className="text-green-400" />;
      case 'meeting':
        return <Calendar size={16} className="text-purple-400" />;
      case 'note':
        return <MessageSquare size={16} className="text-yellow-400" />;
      default:
        return <MessageSquare size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Interactions</h1>
          <p className="mt-2 text-dark-400">Track all customer communications and touchpoints.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button 
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center"
          >
            <Plus size={16} className="mr-2" />
            Log Interaction
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400" />
          <input
            type="text"
            placeholder="Search interactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10 w-full"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter size={16} className="text-dark-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="input-field"
          >
            <option value="all">All Types</option>
            <option value="call">Calls</option>
            <option value="email">Emails</option>
            <option value="meeting">Meetings</option>
            <option value="note">Notes</option>
          </select>
        </div>
      </div>

      {/* Interactions List */}
      <div className="space-y-4">
        {filteredInteractions.map(interaction => {
          const contact = contacts.find(c => c.contactId === interaction.contactId);
          
          return (
            <div key={interaction.interactionId} className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getTypeIcon(interaction.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold text-white">
                        {interaction.type.charAt(0).toUpperCase() + interaction.type.slice(1)} with {contact?.name}
                      </h3>
                      {interaction.followUpRequired && (
                        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-md">
                          Follow-up Required
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-dark-400 mb-2">
                      {format(interaction.dateTime, 'MMMM dd, yyyy \'at\' h:mm a')}
                    </p>
                    <p className="text-dark-300">{interaction.notes}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="text-dark-400 hover:text-white text-sm">
                    Edit
                  </button>
                  <button className="text-red-400 hover:text-red-300 text-sm">
                    Delete
                  </button>
                </div>
              </div>
              
              {contact && (
                <div className="flex items-center text-sm text-dark-400">
                  <span className="mr-4">{contact.email}</span>
                  {contact.company && <span>{contact.company}</span>}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredInteractions.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare size={48} className="mx-auto text-dark-600 mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">
            {searchTerm || filterType !== 'all' ? 'No interactions found' : 'No interactions yet'}
          </h3>
          <p className="text-dark-400 mb-4">
            {searchTerm || filterType !== 'all'
              ? 'Try adjusting your search or filter.'
              : 'Start logging your customer interactions.'
            }
          </p>
          {!searchTerm && filterType === 'all' && (
            <button 
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              Log Your First Interaction
            </button>
          )}
        </div>
      )}

      {/* Interaction Form Modal */}
      {showForm && (
        <InteractionLog
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
