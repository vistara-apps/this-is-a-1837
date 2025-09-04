import React, { useState } from 'react'
import { useCRM } from '../context/CRMContext'
import { ContactForm } from '../components/ContactForm'
import { Plus, Search, Mail, Phone, Building, Calendar, MessageCircle } from 'lucide-react'
import { format } from 'date-fns'

export function Contacts() {
  const { contacts, deleteContact } = useCRM();
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (contact) => {
    setEditingContact(contact);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingContact(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Contacts</h1>
          <p className="mt-2 text-dark-400">Manage your customer relationships and contact information.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button 
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center"
          >
            <Plus size={16} className="mr-2" />
            Add Contact
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400" />
        <input
          type="text"
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-10 w-full max-w-md"
        />
      </div>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContacts.map(contact => (
          <div key={contact.contactId} className="card p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">{contact.name}</h3>
                <p className="text-dark-400 text-sm">{contact.company}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(contact)}
                  className="text-dark-400 hover:text-white text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteContact(contact.contactId)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-dark-300">
                <Mail size={14} className="mr-2 text-dark-400" />
                {contact.email}
              </div>
              {contact.phone && (
                <div className="flex items-center text-sm text-dark-300">
                  <Phone size={14} className="mr-2 text-dark-400" />
                  {contact.phone}
                </div>
              )}
              {contact.company && (
                <div className="flex items-center text-sm text-dark-300">
                  <Building size={14} className="mr-2 text-dark-400" />
                  {contact.company}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-sm text-dark-400 mb-4">
              <div className="flex items-center">
                <MessageCircle size={14} className="mr-1" />
                {contact.totalInteractions} interactions
              </div>
              {contact.lastInteraction && (
                <div className="flex items-center">
                  <Calendar size={14} className="mr-1" />
                  {format(contact.lastInteraction, 'MMM dd')}
                </div>
              )}
            </div>

            {contact.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {contact.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-dark-700 text-dark-300 text-xs rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredContacts.length === 0 && (
        <div className="text-center py-12">
          <Users size={48} className="mx-auto text-dark-600 mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">
            {searchTerm ? 'No contacts found' : 'No contacts yet'}
          </h3>
          <p className="text-dark-400 mb-4">
            {searchTerm 
              ? 'Try adjusting your search terms.' 
              : 'Get started by adding your first contact.'
            }
          </p>
          {!searchTerm && (
            <button 
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              Add Your First Contact
            </button>
          )}
        </div>
      )}

      {/* Contact Form Modal */}
      {showForm && (
        <ContactForm
          contact={editingContact}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}