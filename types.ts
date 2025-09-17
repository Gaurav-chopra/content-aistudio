// Fix: Define all application types in this file.
export interface Creator {
  id: string;
  name: string;
}

export interface Competitor {
  id: string;
  name: string;
  url: string;
  subscribers: string;
  avgViews: string;
  startDate: string;
  postingFrequency: string;
  priority: string;
  contentType: 'Long Form' | 'Short Form' | 'Both' | '';
}

export interface Channel {
  id: string;
  name: string;
  url: string;
  competitors: Competitor[];
}

export interface ProductionTask {
  creatorId: string;
  estimatedTime: number;
  actualTime: number;
  deadline: string;
}

export interface TitleUrlPair {
  id: string;
  title: string;
  url: string;
}

export interface Video {
  id: string;
  channelId: string;
  status: 'Idea' | 'Scripting' | 'Shooting' | 'Editing' | 'Published';
  publishDate: string;
  notes: string;
  titleUrlPairs: TitleUrlPair[];
  imageTask?: ProductionTask;
  audioTask?: ProductionTask;
  videoTask?: ProductionTask;
  editTask?: ProductionTask;
}

export interface ChannelToStart {
    id: string;
    niche: string;
    category?: string;
    difficulty?: 'Low' | 'Medium' | 'High';
    priorityNumber?: number;
    monetizationPotential: 'Low' | 'Medium' | 'High';
    competitionLevel: 'Low' | 'Medium' | 'High';
    notes: string;
    competitors: Competitor[];
}

export interface Idea {
    id: string;
    title: string;
    description: string;
    status: 'New' | 'Considering' | 'Approved' | 'Rejected';
    potential: 'Low' | 'Medium' | 'High';
}
