// Fix: Moved component logic from types.ts to this file and corrected imports.
import React, { useState, useMemo } from 'react';
import { Video, Channel, Creator, ProductionTask } from '../types';
import Modal from './Modal';
import VideoForm from './VideoForm';

interface VideoManagerProps {
  videos: Video[];
  setVideos: React.Dispatch<React.SetStateAction<Video[]>>;
  channels: Channel[];
  creators: Creator[];
}

const VideoCard: React.FC<{
  video: Video;
  channelName: string;
  creators: Creator[];
  onEdit: () => void;
  onDelete: () => void;
}> = ({ video, channelName, creators, onEdit, onDelete }) => {
    const [isTasksExpanded, setIsTasksExpanded] = useState(false);
    const primaryTitle = video.titleUrlPairs[0]?.title || "Untitled Video";

    const TaskDisplay: React.FC<{
      task: ProductionTask | undefined;
      title: string;
      creators: Creator[];
    }> = ({ task, title, creators }) => {
      if (!task || !task.creatorId) return null;
      
      const creatorName = creators.find(c => c.id === task.creatorId)?.name || 'Unknown';
    
      return (
        <div className="p-2 bg-slate-600/50 rounded-md">
          <h5 className="font-semibold text-slate-300">{title}</h5>
          <div className="text-xs grid grid-cols-2 gap-1 mt-1">
            <p><span className="font-medium text-slate-400">Creator:</span> {creatorName}</p>
            <p><span className="font-medium text-slate-400">Deadline:</span> {task.deadline || 'N/A'}</p>
            <p><span className="font-medium text-slate-400">Est. Time:</span> {task.estimatedTime > 0 ? `${task.estimatedTime} min` : 'N/A'}</p>
            <p><span className="font-medium text-slate-400">Actual Time:</span> {task.actualTime > 0 ? `${task.actualTime} min` : 'N/A'}</p>
          </div>
        </div>
      );
    };

    return (
      <div className="bg-slate-800 p-4 rounded-lg shadow-md space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-indigo-400">{primaryTitle}</h3>
            <p className="text-sm text-slate-400">Channel: {channelName}</p>
            <p className="text-sm text-slate-400">Status: <span className="font-semibold">{video.status}</span></p>
            <p className="text-sm text-slate-400">Publish Date: {video.publishDate || 'Not set'}</p>
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
        
        {video.notes && <p className="text-slate-300 whitespace-pre-wrap border-t border-slate-700 pt-3">{video.notes}</p>}

        <div className="border-t border-slate-700 pt-3">
             <button 
                onClick={() => setIsTasksExpanded(!isTasksExpanded)}
                className="w-full flex justify-between items-center text-left font-semibold text-slate-300"
                >
                Production Tasks:
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${isTasksExpanded ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>
             {isTasksExpanded && (
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <TaskDisplay task={video.imageTask} title="Image Task" creators={creators} />
                    <TaskDisplay task={video.audioTask} title="Audio Task" creators={creators} />
                    <TaskDisplay task={video.videoTask} title="Video Task" creators={creators} />
                    <TaskDisplay task={video.editTask} title="Edit Task" creators={creators} />
                </div>
            )}
        </div>
        
        {video.titleUrlPairs.length > 0 && (
            <div className="border-t border-slate-700 pt-3">
                <h4 className="font-semibold text-slate-300 mb-1">Titles & Links:</h4>
                <ul className="space-y-1">
                    {video.titleUrlPairs.map(pair => (
                        <li key={pair.id} className="text-sm">
                            <span className="font-medium text-slate-400">{pair.title}: </span>
                            <a href={pair.url} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline break-all">{pair.url}</a>
                        </li>
                    ))}
                </ul>
            </div>
        )}

      </div>
    );
}

const initialFilterState = {
    channelId: '',
    creatorId: '',
    status: '',
    taskType: '',
    publishDate: '',
    taskDeadline: '',
};

const VideoManager: React.FC<VideoManagerProps> = ({ videos, setVideos, channels, creators }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [filters, setFilters] = useState(initialFilterState);

  const handleOpenModal = (video: Video | null = null) => {
    setEditingVideo(video);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingVideo(null);
  };

  const handleSave = (videoData: Omit<Video, 'id'>) => {
    if (editingVideo) {
      setVideos(videos.map(v => v.id === editingVideo.id ? { id: v.id, ...videoData } : v));
    } else {
      const newVideo: Video = { id: Date.now().toString(), ...videoData };
      setVideos([...videos, newVideo]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this video entry?')) {
      setVideos(videos.filter(v => v.id !== id));
    }
  };
  
  const getChannelName = (channelId: string) => {
    return channels.find(c => c.id === channelId)?.name || 'Unknown Channel';
  }

  const handleFilterChange = (filterName: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };
  
  const resetFilters = () => setFilters(initialFilterState);

  const filteredVideos = useMemo(() => {
    return videos.filter(video => {
        if (filters.channelId && video.channelId !== filters.channelId) return false;
        if (filters.status && video.status !== filters.status) return false;
        if (filters.publishDate && video.publishDate !== filters.publishDate) return false;
        
        if (filters.creatorId) {
            const hasCreator = [video.imageTask, video.audioTask, video.videoTask, video.editTask]
                .some(task => task?.creatorId === filters.creatorId);
            if (!hasCreator) return false;
        }

        if (filters.taskType) {
            if (!video[filters.taskType as keyof Video]) return false;
        }

        if (filters.taskDeadline) {
            const hasDeadline = [video.imageTask, video.audioTask, video.videoTask, video.editTask]
                .some(task => task?.deadline === filters.taskDeadline);
            if (!hasDeadline) return false;
        }

        return true;
    });
  }, [videos, filters]);

  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Video Pipeline</h2>
            <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 transition-colors"
            disabled={channels.length === 0 || creators.length === 0}
            title={channels.length === 0 ? "Please add a channel first" : creators.length === 0 ? "Please add a creator first" : "Add Video"}
            >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
            Add Video
            </button>
        </div>

        {/* Filter Section */}
        <div className="p-4 bg-slate-800/70 rounded-lg mb-6 border border-slate-700">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* Channel Filter */}
                <select value={filters.channelId} onChange={e => handleFilterChange('channelId', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-sm">
                    <option value="">Filter by Channel</option>
                    {channels.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                {/* Creator Filter */}
                 <select value={filters.creatorId} onChange={e => handleFilterChange('creatorId', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-sm">
                    <option value="">Filter by Creator</option>
                    {creators.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                 {/* Status Filter */}
                 <select value={filters.status} onChange={e => handleFilterChange('status', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-sm">
                    <option value="">Filter by Status</option>
                    <option value="Idea">Idea</option>
                    <option value="Scripting">Scripting</option>
                    <option value="Shooting">Shooting</option>
                    <option value="Editing">Editing</option>
                    <option value="Published">Published</option>
                </select>
                 {/* Task Filter */}
                 <select value={filters.taskType} onChange={e => handleFilterChange('taskType', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-sm">
                    <option value="">Filter by Task</option>
                    <option value="imageTask">Has Image Task</option>
                    <option value="audioTask">Has Audio Task</option>
                    <option value="videoTask">Has Video Task</option>
                    <option value="editTask">Has Edit Task</option>
                </select>
                {/* Publish Date Filter */}
                <input type="date" value={filters.publishDate} onChange={e => handleFilterChange('publishDate', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-sm" placeholder="Filter by Publish Date" />
                {/* Task Deadline Filter */}
                <input type="date" value={filters.taskDeadline} onChange={e => handleFilterChange('taskDeadline', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-sm" />
                
                <button onClick={resetFilters} className="col-span-2 md:col-span-1 lg:col-span-2 justify-self-start px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-500 transition-colors text-sm">
                    Reset Filters
                </button>
            </div>
        </div>

      <div className="space-y-4">
        {filteredVideos.length > 0 ? (
          filteredVideos.map(video => (
            <VideoCard 
                key={video.id} 
                video={video} 
                channelName={getChannelName(video.channelId)}
                creators={creators}
                onEdit={() => handleOpenModal(video)}
                onDelete={() => handleDelete(video.id)}
            />
          ))
        ) : (
           <p className="text-slate-400 text-center py-10 text-lg">
             {videos.length > 0 ? "No videos match the current filters." : "No videos yet. Click 'Add Video' to get started."}
           </p>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingVideo ? 'Edit Video' : 'Add New Video'}
      >
        <VideoForm
          video={editingVideo}
          onSave={handleSave}
          onCancel={handleCloseModal}
          channels={channels}
          creators={creators}
        />
      </Modal>
    </div>
  );
};

export default VideoManager;
