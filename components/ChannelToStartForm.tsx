import React, { useState, useEffect } from 'react';
import { ChannelToStart, Competitor } from '../types';

interface ChannelToStartFormProps {
  channel: ChannelToStart | null;
  onSave: (channel: Omit<ChannelToStart, 'id'>) => void;
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


const ChannelToStartForm: React.FC<ChannelToStartFormProps> = ({ channel, onSave, onCancel }) => {
  const [niche, setNiche] = useState('');
  const [category, setCategory] = useState('');
  const [priorityNumber, setPriorityNumber] = useState<number>(0);
  const [difficulty, setDifficulty] = useState<ChannelToStart['difficulty']>('Medium');
  const [monetizationPotential, setMonetizationPotential] = useState<ChannelToStart['monetizationPotential']>('Medium');
  const [competitionLevel, setCompetitionLevel] = useState<ChannelToStart['competitionLevel']>('Medium');
  const [notes, setNotes] = useState('');
  const [competitors, setCompetitors] = useState<Competitor[]>([defaultCompetitor()]);


  useEffect(() => {
    if (channel) {
      setNiche(channel.niche);
      setCategory(channel.category || '');
      setPriorityNumber(channel.priorityNumber || 0);
      setDifficulty(channel.difficulty || 'Medium');
      setMonetizationPotential(channel.monetizationPotential);
      setCompetitionLevel(channel.competitionLevel);
      setNotes(channel.notes);
      setCompetitors(channel.competitors && channel.competitors.length > 0 ? channel.competitors.map(c => ({...c})) : [defaultCompetitor()]);
    } else {
      setNiche('');
      setCategory('');
      setPriorityNumber(0);
      setDifficulty('Medium');
      setMonetizationPotential('Medium');
      setCompetitionLevel('Medium');
      setNotes('');
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
        niche,
        category,
        priorityNumber,
        difficulty,
        monetizationPotential, 
        competitionLevel, 
        notes,
        competitors: competitors.filter(c => c.url.trim() !== '' || c.name.trim() !== '') 
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="niche" className="block text-sm font-medium text-gray-300 mb-1">Niche</label>
          <input id="niche" type="text" value={niche} onChange={e => setNiche(e.target.value)} required className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white" />
        </div>
         <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">Category</label>
          <input id="category" type="text" value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white" />
        </div>
        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-gray-300 mb-1">Difficulty</label>
          <select id="difficulty" value={difficulty} onChange={e => setDifficulty(e.target.value as ChannelToStart['difficulty'])} required className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white">
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div>
          <label htmlFor="priorityNumber" className="block text-sm font-medium text-gray-300 mb-1">Priority Number</label>
          <input id="priorityNumber" type="number" value={priorityNumber} onChange={e => setPriorityNumber(Number(e.target.value))} required className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white" />
        </div>
        <div>
          <label htmlFor="monetizationPotential" className="block text-sm font-medium text-gray-300 mb-1">Monetization Potential</label>
          <select id="monetizationPotential" value={monetizationPotential} onChange={e => setMonetizationPotential(e.target.value as ChannelToStart['monetizationPotential'])} required className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white">
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div>
          <label htmlFor="competitionLevel" className="block text-sm font-medium text-gray-300 mb-1">Competition Level</label>
          <select id="competitionLevel" value={competitionLevel} onChange={e => setCompetitionLevel(e.target.value as ChannelToStart['competitionLevel'])} required className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white">
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-1">Notes</label>
        <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white"></textarea>
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
                    <select value={comp.contentType} onChange={e => handleCompetitorChange(index, 'contentType', e.target.value as Competitor['contentType'])} className="w-full bg-slate-700 border border-slate-600 rounded-md p-2">
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
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">Save Idea</button>
      </div>
    </form>
  );
};

export default ChannelToStartForm;
