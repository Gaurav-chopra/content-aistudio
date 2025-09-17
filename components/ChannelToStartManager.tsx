import React, { useState } from 'react';
import { ChannelToStart } from '../types';
import Modal from './Modal';
import ChannelToStartForm from './ChannelToStartForm';

interface ChannelToStartManagerProps {
  channelsToStart: ChannelToStart[];
  setChannelsToStart: React.Dispatch<React.SetStateAction<ChannelToStart[]>>;
}

const ChannelToStartCard: React.FC<{
  channel: ChannelToStart;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ channel, onEdit, onDelete }) => {
  const [isCompetitorsExpanded, setIsCompetitorsExpanded] = useState(false);

  return (
    <div className="bg-slate-800 p-4 rounded-lg shadow-md space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-indigo-400">{channel.niche}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1 text-sm text-slate-400 mt-2">
              <p><span className="font-semibold text-slate-300">Category:</span> {channel.category || 'N/A'}</p>
              <p><span className="font-semibold text-slate-300">Difficulty:</span> {channel.difficulty || 'N/A'}</p>
              <p><span className="font-semibold text-slate-300">Priority:</span> {channel.priorityNumber || 'N/A'}</p>
              <p><span className="font-semibold text-slate-300">Potential:</span> {channel.monetizationPotential}</p>
              <p><span className="font-semibold text-slate-300">Competition:</span> {channel.competitionLevel}</p>
          </div>
        </div>
        <div className="flex-shrink-0 flex gap-2 ml-4">
          <button onClick={onEdit} className="p-1 text-slate-400 hover:text-indigo-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
          </button>
          <button onClick={onDelete} className="p-1 text-slate-400 hover:text-red-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
          </button>
        </div>
      </div>
       <div>
        <button 
          onClick={() => setIsCompetitorsExpanded(!isCompetitorsExpanded)}
          className="w-full flex justify-between items-center text-left font-semibold text-slate-300"
        >
          Competitors:
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${isCompetitorsExpanded ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        {isCompetitorsExpanded && (
          channel.competitors && channel.competitors.length > 0 ? (
            <div className="space-y-3 mt-2">
              {channel.competitors.map((competitor) => (
                <div key={competitor.id} className="p-3 bg-slate-700/50 rounded-md border border-slate-600">
                  <h4 className="font-semibold text-slate-200">{competitor.name || 'Unnamed Competitor'}</h4>
                  <a href={competitor.url} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-400 hover:underline break-all">{competitor.url}</a>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1 text-sm text-slate-400 mt-2">
                    <p><span className="font-semibold text-slate-300">Subscribers:</span> {competitor.subscribers || 'N/A'}</p>
                    <p><span className="font-semibold text-slate-300">Avg Views:</span> {competitor.avgViews || 'N/A'}</p>
                    <p><span className="font-semibold text-slate-300">Start Date:</span> {competitor.startDate || 'N/A'}</p>
                    <p><span className="font-semibold text-slate-300">Frequency:</span> {competitor.postingFrequency || 'N/A'}</p>
                    <p><span className="font-semibold text-slate-300">Priority:</span> {competitor.priority || 'N/A'}</p>
                    <p><span className="font-semibold text-slate-300">Content:</span> {competitor.contentType || 'N/A'}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 mt-1">No competitors listed.</p>
          )
        )}
      </div>
      {channel.notes && <p className="text-slate-300 whitespace-pre-wrap mt-2 border-t border-slate-700 pt-3">{channel.notes}</p>}
    </div>
  );
};


const ChannelToStartManager: React.FC<ChannelToStartManagerProps> = ({ channelsToStart, setChannelsToStart }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChannel, setEditingChannel] = useState<ChannelToStart | null>(null);

  const handleOpenModal = (channel: ChannelToStart | null = null) => {
    setEditingChannel(channel);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingChannel(null);
  };

  const handleSave = (channelData: Omit<ChannelToStart, 'id'>) => {
    if (editingChannel) {
      setChannelsToStart(channelsToStart.map(c => c.id === editingChannel.id ? { ...c, ...channelData } : c));
    } else {
      const newChannel: ChannelToStart = { id: Date.now().toString(), ...channelData };
      setChannelsToStart([...channelsToStart, newChannel]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this channel idea?')) {
      setChannelsToStart(channelsToStart.filter(c => c.id !== id));
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
          Add Channel Idea
        </button>
      </div>
      
      <div className="space-y-4">
        {channelsToStart.length > 0 ? (
          channelsToStart.map(channel => (
            <ChannelToStartCard 
                key={channel.id} 
                channel={channel} 
                onEdit={() => handleOpenModal(channel)}
                onDelete={() => handleDelete(channel.id)}
            />
          ))
        ) : (
          <p className="text-slate-400 text-center py-10 text-lg">No new channel ideas yet. Click 'Add Channel Idea' to get started.</p>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingChannel ? 'Edit Channel Idea' : 'Add New Channel Idea'}
      >
        <ChannelToStartForm
          channel={editingChannel}
          onSave={handleSave}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

export default ChannelToStartManager;
