
import React, { useState, useEffect } from 'react';
import { Video, Channel, Creator, TitleUrlPair, ProductionTask } from '../types';

interface VideoFormProps {
  video: Video | null;
  onSave: (video: Omit<Video, 'id'>) => void;
  onCancel: () => void;
  channels: Channel[];
  creators: Creator[];
}

const emptyTask: ProductionTask = { creatorId: '', estimatedTime: 0, actualTime: 0, deadline: ''};
const emptyTitleUrlPair = (): TitleUrlPair => ({ id: `temp-${Date.now()}-${Math.random()}`, title: '', url: ''});

const TaskInput: React.FC<{
    task: ProductionTask | undefined;
    onTaskChange: (task: ProductionTask) => void;
    title: string;
    creators: Creator[];
}> = ({ task, onTaskChange, title, creators }) => {
    
    const handleChange = (field: keyof ProductionTask, value: string | number) => {
        onTaskChange({ ...task, creatorId: task?.creatorId || '', estimatedTime: task?.estimatedTime || 0, actualTime: task?.actualTime || 0, deadline: task?.deadline || '', [field]: value });
    };

    return (
        <div className="p-3 border border-slate-700 rounded-lg">
            <h4 className="font-semibold text-lg text-indigo-400 mb-2">{title}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Creator</label>
                    <select value={task?.creatorId || ''} onChange={e => handleChange('creatorId', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-md p-2">
                        <option value="">Select Creator</option>
                        {creators.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Deadline</label>
                    <input type="date" value={task?.deadline || ''} onChange={e => handleChange('deadline', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-md p-2" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Estimated Time (min)</label>
                    <input type="number" value={task?.estimatedTime || ''} onChange={e => handleChange('estimatedTime', parseInt(e.target.value) || 0)} className="w-full bg-slate-700 border border-slate-600 rounded-md p-2" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Actual Time (min)</label>
                    <input type="number" value={task?.actualTime || ''} onChange={e => handleChange('actualTime', parseInt(e.target.value) || 0)} className="w-full bg-slate-700 border border-slate-600 rounded-md p-2" />
                </div>
            </div>
        </div>
    );
};


const VideoForm: React.FC<VideoFormProps> = ({ video, onSave, onCancel, channels, creators }) => {
  const [status, setStatus] = useState<Video['status']>('Idea');
  const [publishDate, setPublishDate] = useState('');
  const [notes, setNotes] = useState('');
  const [channelId, setChannelId] = useState<string>(channels[0]?.id || '');
  const [titleUrlPairs, setTitleUrlPairs] = useState<TitleUrlPair[]>([emptyTitleUrlPair()]);

  const [imageTask, setImageTask] = useState<ProductionTask | undefined>(undefined);
  const [audioTask, setAudioTask] = useState<ProductionTask | undefined>(undefined);
  const [videoTask, setVideoTask] = useState<ProductionTask | undefined>(undefined);
  const [editTask, setEditTask] = useState<ProductionTask | undefined>(undefined);

  useEffect(() => {
    if (video) {
      setStatus(video.status);
      setPublishDate(video.publishDate);
      setNotes(video.notes);
      setChannelId(video.channelId);
      setTitleUrlPairs(video.titleUrlPairs.length > 0 ? video.titleUrlPairs : [emptyTitleUrlPair()]);
      setImageTask(video.imageTask);
      setAudioTask(video.audioTask);
      setVideoTask(video.videoTask);
      setEditTask(video.editTask);
    } else {
      // Reset form
      setStatus('Idea');
      setPublishDate('');
      setNotes('');
      setChannelId(channels[0]?.id || '');
      setTitleUrlPairs([emptyTitleUrlPair()]);
      setImageTask(undefined);
      setAudioTask(undefined);
      setVideoTask(undefined);
      setEditTask(undefined);
    }
  }, [video, channels]);

  const handleTitleUrlChange = (index: number, field: 'title' | 'url', value: string) => {
      const newPairs = [...titleUrlPairs];
      newPairs[index][field] = value;
      setTitleUrlPairs(newPairs);
  };
  
  const addTitleUrlPair = () => setTitleUrlPairs([...titleUrlPairs, emptyTitleUrlPair()]);

  const removeTitleUrlPair = (index: number) => {
      if (titleUrlPairs.length > 1) {
          setTitleUrlPairs(titleUrlPairs.filter((_, i) => i !== index));
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelId) {
        alert("Please select a channel.");
        return;
    }
    if (titleUrlPairs.length === 0 || titleUrlPairs[0].title.trim() === '') {
        alert("Please provide at least one title.");
        return;
    }
    
    const cleanTask = (task: ProductionTask | undefined) => {
        return (task && task.creatorId) ? task : undefined;
    };

    onSave({ 
      status, 
      publishDate, 
      notes, 
      channelId, 
      titleUrlPairs: titleUrlPairs.filter(p => p.title.trim() !== ''),
      imageTask: cleanTask(imageTask),
      audioTask: cleanTask(audioTask),
      videoTask: cleanTask(videoTask),
      editTask: cleanTask(editTask),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-4">
      
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="channelId" className="block text-sm font-medium text-gray-300 mb-1">Channel</label>
          <select id="channelId" value={channelId} onChange={e => setChannelId(e.target.value)} required className="w-full bg-slate-700 border border-slate-600 rounded-md p-2">
            <option value="" disabled>Select a channel</option>
            {channels.map(channel => (
              <option key={channel.id} value={channel.id}>{channel.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">Status</label>
          <select id="status" value={status} onChange={e => setStatus(e.target.value as Video['status'])} required className="w-full bg-slate-700 border border-slate-600 rounded-md p-2">
              <option value="Idea">Idea</option>
              <option value="Scripting">Scripting</option>
              <option value="Shooting">Shooting</option>
              <option value="Editing">Editing</option>
              <option value="Published">Published</option>
          </select>
        </div>
         <div className="md:col-span-2">
          <label htmlFor="publishDate" className="block text-sm font-medium text-gray-300 mb-1">Publish Date</label>
          <input id="publishDate" type="date" value={publishDate} onChange={e => setPublishDate(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white" />
        </div>
      </div>

      {/* Title/URL Pairs */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Titles & URLs</label>
        <div className="space-y-3">
          {titleUrlPairs.map((pair, index) => (
            <div key={pair.id} className="flex items-end gap-2">
                <div className="flex-grow">
                    <label className="text-xs text-slate-400">Title</label>
                    <input type="text" value={pair.title} onChange={e => handleTitleUrlChange(index, 'title', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-sm" placeholder="Primary Video Title" />
                </div>
                 <div className="flex-grow">
                    <label className="text-xs text-slate-400">URL</label>
                    <input type="url" value={pair.url} onChange={e => handleTitleUrlChange(index, 'url', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-sm" placeholder="https://example.com" />
                </div>
                {titleUrlPairs.length > 1 && <button type="button" onClick={() => removeTitleUrlPair(index)} className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                </button>}
            </div>
          ))}
        </div>
        <button type="button" onClick={addTitleUrlPair} className="mt-2 flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
            Add Title/URL
        </button>
      </div>
      
      {/* Tasks */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-200 border-b border-slate-700 pb-2">Production Tasks</h3>
        <TaskInput task={imageTask} onTaskChange={setImageTask} title="Image Task" creators={creators} />
        <TaskInput task={audioTask} onTaskChange={setAudioTask} title="Audio Task" creators={creators} />
        <TaskInput task={videoTask} onTaskChange={setVideoTask} title="Video Task" creators={creators} />
        <TaskInput task={editTask} onTaskChange={setEditTask} title="Edit Task" creators={creators} />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-1">Notes</label>
        <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={4} className="w-full bg-slate-700 border border-slate-600 rounded-md p-2"></textarea>
      </div>

      <div className="flex justify-end gap-3 pt-2 sticky bottom-0 bg-slate-800 py-4 -mx-6 px-6">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-500 transition-colors">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">Save Video</button>
      </div>
    </form>
  );
};

export default VideoForm;