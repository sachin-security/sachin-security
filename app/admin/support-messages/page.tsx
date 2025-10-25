// app/admin/support-messages/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Mail, Clock, CheckCircle, Loader2, Eye, Trash2, X } from 'lucide-react';

interface SupportMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'New' | 'In Progress' | 'Resolved';
  createdAt: string;
}

export default function SupportMessagesPage() {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<SupportMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState<SupportMessage | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredMessages(messages);
    } else {
      setFilteredMessages(messages.filter(msg => msg.status === statusFilter));
    }
  }, [statusFilter, messages]);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/contact');
      const data = await response.json();
      
      if (data.success) {
        setMessages(data.data);
        setFilteredMessages(data.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = {
    total: messages.length,
    new: messages.filter(m => m.status === 'New').length,
    inProgress: messages.filter(m => m.status === 'In Progress').length,
    resolved: messages.filter(m => m.status === 'Resolved').length
  };

  const handleViewDetails = (message: SupportMessage) => {
    setSelectedMessage(message);
    setShowDetailsModal(true);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-amber-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Support Messages</h1>
        <p className="text-gray-600">Manage customer inquiries and support requests</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Messages</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Mail className="w-10 h-10 text-gray-400" />
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-700 text-sm mb-1">New</p>
              <p className="text-3xl font-bold text-blue-900">{stats.new}</p>
            </div>
            <Mail className="w-10 h-10 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-700 text-sm mb-1">In Progress</p>
              <p className="text-3xl font-bold text-yellow-900">{stats.inProgress}</p>
            </div>
            <Clock className="w-10 h-10 text-yellow-400" />
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-700 text-sm mb-1">Resolved</p>
              <p className="text-3xl font-bold text-green-900">{stats.resolved}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">All Messages</option>
            <option value="New">New</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Subject</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMessages.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No messages found
                  </td>
                </tr>
              ) : (
                filteredMessages.map((message) => (
                  <tr key={message.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">{message.id}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">{message.name}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">{message.email}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">{message.subject}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        message.status === 'New'
                          ? 'bg-blue-100 text-blue-800'
                          : message.status === 'In Progress'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {message.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewDetails(message)}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        {/* <button
                          className="p-2 hover:bg-gray-100 rounded-lg"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Details Modal */}
      {showDetailsModal && selectedMessage && (
        <MessageDetailsModal
          message={selectedMessage}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
    </div>
  );
}

// Message Details Modal
function MessageDetailsModal({ message, onClose }: { message: SupportMessage; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Message Details</h2>
            <p className="text-gray-600">{message.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium text-gray-900">{message.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium text-gray-900">{message.email}</p>
            </div>
            {message.phone && (
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium text-gray-900">{message.phone}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-600">Date</p>
              <p className="font-medium text-gray-900">
                {new Date(message.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-2">Subject</p>
            <p className="font-medium text-gray-900">{message.subject}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-2">Message</p>
            <p className="text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
              {message.message}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-2">Status</p>
            <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
              message.status === 'New'
                ? 'bg-blue-100 text-blue-800'
                : message.status === 'In Progress'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-green-100 text-green-800'
            }`}>
              {message.status}
            </span>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 font-semibold"
          >
            Close
          </button>
          <button className="flex-1 bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 font-semibold">
            Reply via Email
          </button>
        </div>
      </div>
    </div>
  );
}
