import React, { useState, useEffect } from 'react';
// Fix: Correctly import from the now valid `types.ts` module.
import { Channel, Competitor } from '../types';

interface ChannelFormProps {
  channel: Channel | null;
  onSave: (channel: Omit<Channel, 'id'>) => void;
  onCancel: () => void;
}

const defaultCompetitor = (): Competitor => ({
  id: `temp-${Date.now()}-${Math.random()}`,
  name: '',
  url: '',
  subscribers: '',
  avgViews: '',
  startDate: '',
  postingFrequency: '',
  priority: '',
  contentType: '',
});


const ChannelForm: React.FC<ChannelFormProps> = ({ channel, onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [competitors, setCompetitors] = useState<Competitor[]>([defaultCompetitor()]);

  useEffect(() => {
    if (channel) {
      setName(channel.name);
      setUrl(channel.url);
      setCompetitors(channel.competitors.length > 0 ? channel.competitors.map(c => ({...c})) : [defaultCompetitor()]);
    } else {
      setName('');
      setUrl('');
      setCompetitors([defaultCompetitor()]);
    }
  }, [channel]);

  const handleCompetitorChange = (index: number, field: keyof Omit<Competitor, 'id'>, value: string) => {
    const newCompetitors = [...competitors];
    const updatedCompetitor = { ...newCompetitors[index], [field]: value };
    newCompetitors[index] = updatedCompetitor;
    setCompetitors(newCompetitors);
  };

  const addCompetitorField = () => {
    setCompetitors([...competitors, defaultCompetitor()]);
  };
  
  const removeCompetitorField = (index: number) => {
    if (competitors.length > 1) {
        const newCompetitors = competitors.filter((_, i) => i !== index);
        setCompetitors(newCompetitors);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ 
      name, 
      url, 
      competitors: competitors.filter(c => c.url.trim() !== '' || c.name.trim() !== '') 
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-4">
      <div>
        <label htmlFor="channelName" className="block text-sm font-medium text-gray-300 mb-1">Channel Name</label>
        <input id="channelName" type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
      </div>
      <div>
        <label htmlFor="channelUrl" className="block text-sm font-medium text-gray-300 mb-1">Channel URL</label>
        <input id="channelUrl" type="url" value={url} onChange={e => setUrl(e.target.value)} required className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Competitors</label>
        <div className="space-y-4">
        {competitors.map((comp, index) => (
          <div key={comp.id} className="p-4 border border-slate-700 rounded-lg space-y-4 relative">
             <div className="flex justify-between items-center">
                <h4 className="font-bold text-lg text-indigo-400">Competitor #{index+1}</h4>
                {competitors.length > 1 && (
                    <button type="button" onClick={() => removeCompetitorField(index)} className="p-1 bg-red-600 text-white rounded-full hover:bg-red-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                    </button>
                )}
             </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                    <input type="text" value={comp.name} onChange={e => handleCompetitorChange(index, 'name', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-md p-2" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">URL</label>
                    <input type="url" value={comp.url} onChange={e => handleCompetitorChange(index, 'url', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-md p-2" />
                 </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Subscribers</label>
                    <input type="text" value={comp.subscribers} onChange={e => handleCompetitorChange(index, 'subscribers', e.target.value)} placeholder="e.g., 1.2M" className="w-full bg-slate-700 border border-slate-600 rounded-md p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Avg. Views</label>
                    <input type="text" value={comp.avgViews} onChange={e => handleCompetitorChange(index, 'avgViews', e.target.value)} placeholder="e.g., 500k" className="w-full bg-slate-700 border border-slate-600 rounded-md p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
                    <input type="date" value={comp.startDate} onChange={e => handleCompetitorChange(index, 'startDate', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Posting Frequency</label>
                    <input type="text" value={comp.postingFrequency} onChange={e => handleCompetitorChange(index, 'postingFrequency', e.target.value)} placeholder="e.g., Daily, Weekly" className="w-full bg-slate-700 border border-slate-600 rounded-md p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Priority</label>
                    <select value={comp.priority} onChange={e => handleCompetitorChange(index, 'priority', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-md p-2">
                        <option value="">Select Priority</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Content Type</label>
                    <select value={comp.contentType} onChange={e => handleCompetitorChange(index, 'contentType', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-md p-2">
                        <option value="">Select Type</option>
                        <option value="Long Form">Long Form</option>
                        <option value="Short Form">Short Form</option>
                        <option value="Both">Both</option>
                    </select>
                </div>
            </div>
          </div>
        ))}
        </div>
        <button type="button" onClick={addCompetitorField} className="mt-2 flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
            Add Competitor
        </button>
      </div>
      <div className="flex justify-end gap-3 pt-4 sticky bottom-0 bg-slate-800 py-4 -mx-6 px-6">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-500 transition-colors">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">Save Channel</button>
      </div>
    </form>
  );
};

export default ChannelForm;
