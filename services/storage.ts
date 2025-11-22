
import { supabase } from './supabase';

// Types
export interface RequestItem {
  id?: string;
  lineName: string;
  quantity: number; 
  description: string;
  imageUrls: string[];
  createdAt?: string;
  user_id?: string;
}

export interface Prompt {
  id: string;
  title: string;
  description: string;
  fullPrompt: string; // Mapped from 'full_prompt' in DB
  tags: string[];
  imageUrl: string; // Mapped from 'image_url' in DB
}

// Mock Data for Fallback (used ONLY when connection fails)
const MOCK_LIBRARY: Prompt[] = [
  {
    id: '1',
    title: 'Ethereal Product Photography',
    description: 'Soft lighting setup for luxury cosmetics with water ripples.',
    fullPrompt: 'High-end cosmetic product photography, bottle submerged in shallow water, soft ripples, caustics, pastel peach lighting, ethereal vibe, 8k resolution.',
    tags: ['AI Image', 'Business', 'Vibe'],
    imageUrl: 'https://picsum.photos/400/500?random=1'
  },
  {
    id: '2',
    title: 'Neon Cyberpunk Portrait',
    description: 'Futuristic character design with glowing accents.',
    fullPrompt: 'Cyberpunk street samurai, neon rain, wet pavement, glowing katana, volumetric fog, cyan and magenta color palette, cinematic composition.',
    tags: ['AI Image', 'Social'],
    imageUrl: 'https://picsum.photos/400/500?random=2'
  },
  {
    id: '3',
    title: 'Corporate LinkedIn Bio',
    description: 'Professional yet approachable bio for tech executives.',
    fullPrompt: 'Write a LinkedIn summary for a CTO focusing on innovation, leadership, and empathy. Tone: Professional, inspiring, concise.',
    tags: ['Writing', 'Business'],
    imageUrl: 'https://picsum.photos/400/500?random=3'
  },
  {
    id: '4',
    title: 'Lo-Fi Study Animation',
    description: 'Cozy room atmosphere for video generation.',
    fullPrompt: 'Anime style lo-fi hip hop study girl, rainy window, cozy bedroom, cat sleeping on desk, warm lamp light, slight movement of rain.',
    tags: ['AI Video', 'Vibe'],
    imageUrl: 'https://picsum.photos/400/500?random=4'
  },
  {
    id: '5',
    title: 'Minimalist Logo Design',
    description: 'Clean vector lines for a coffee shop brand.',
    fullPrompt: 'Vector logo for a coffee shop named "Bean & Leaf", minimalist, thick lines, black on white, negative space usage, paul rand style.',
    tags: ['AI Image', 'Business'],
    imageUrl: 'https://picsum.photos/400/500?random=5'
  },
  {
    id: '6',
    title: 'Instagram Caption Generator',
    description: 'Engaging captions for travel influencers.',
    fullPrompt: 'Create 5 engaging Instagram captions for a photo of a sunset in Santorini. Include emojis and hashtags. Tone: Dreamy, wanderlust.',
    tags: ['Writing', 'Social'],
    imageUrl: 'https://picsum.photos/400/500?random=6'
  },
];

const STORAGE_KEY = 'prompt_club_requests';

// Helpers
const getWeek = (date: Date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};

// Robust Tag Parser
const parseTags = (tagsInput: any): string[] => {
  if (Array.isArray(tagsInput)) {
    return tagsInput; 
  }
  
  if (typeof tagsInput === 'string') {
    // Try JSON parse first (e.g. '["tag1", "tag2"]')
    try {
      const parsed = JSON.parse(tagsInput);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      // Not JSON
    }

    // Clean up Postgres array format "{tag1,tag2}"
    let clean = tagsInput.trim();
    if (clean.startsWith('{') && clean.endsWith('}')) {
      clean = clean.substring(1, clean.length - 1);
    }
    
    // Split by comma and clean quotes
    if (clean.includes(',') || clean) {
      return clean.split(',').map((t: string) => t.trim().replace(/^"|"$/g, '').replace(/^'|'$/g, '')).filter((t: string) => t);
    }
    
    return [clean];
  }

  return [];
};

export const StorageService = {
  // Fetch all prompts from Supabase
  getLibrary: async (): Promise<Prompt[]> => {
    try {
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        if (error.message && (error.message.includes('fetch') || error.message.includes('connection'))) {
          console.warn("Supabase unreachable. Switching to Mock Data.");
          return MOCK_LIBRARY;
        }
        throw error;
      }

      if (!data || data.length === 0) {
        return []; 
      }

      // Map DB columns to App Interface with safe tag parsing
      return data.map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        fullPrompt: item.full_prompt,
        tags: parseTags(item.tags),
        imageUrl: item.image_url || 'https://picsum.photos/400/500?random=99'
      }));

    } catch (e) {
      return MOCK_LIBRARY;
    }
  },

  getPromptById: async (id: string): Promise<Prompt | undefined> => {
    try {
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code !== 'PGRST116') { 
           if (error.message && (error.message.includes('fetch') || error.message.includes('connection'))) {
             return MOCK_LIBRARY.find(p => p.id === id);
           }
        }
        return undefined;
      }

      return {
        id: data.id,
        title: data.title,
        description: data.description,
        fullPrompt: data.full_prompt,
        tags: parseTags(data.tags),
        imageUrl: data.image_url || 'https://picsum.photos/400/500?random=99'
      };
    } catch (e) {
      return MOCK_LIBRARY.find(p => p.id === id);
    }
  },

  saveRequest: async (request: Omit<RequestItem, 'id' | 'createdAt'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase.from('requests').insert({
        line_name: request.lineName,
        quantity: request.quantity,
        description: request.description,
        image_urls: request.imageUrls,
        user_id: user?.id || null,
      });

      if (error) {
        console.error("Supabase Insert Error:", JSON.stringify(error, null, 2));
        throw new Error(error.message || "Unknown Supabase Error");
      }

      console.log("Request saved to Supabase successfully.");
    } catch (e: any) {
      console.warn("Primary DB Save Failed:", e.message || e);
      const existing = StorageService.getLocalRequests();
      const newRequest: RequestItem = {
        ...request,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString()
      };
      existing.push(newRequest);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
      throw e;
    }
  },

  getLocalRequests: (): RequestItem[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  getUserStats: (lineName: string) => {
    if (!lineName) return { weeklyUsage: 0, monthlyUsage: 0, remainingWeeklySubmissions: 2, limitReached: false };

    const allRequests = StorageService.getLocalRequests();
    const now = new Date();
    const currentWeek = getWeek(now);
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const userRequests = allRequests.filter(r => r.lineName.toLowerCase() === lineName.toLowerCase());

    let monthlyCount = 0;
    
    userRequests.forEach(req => {
        const reqDate = req.createdAt ? new Date(req.createdAt) : new Date(); 
        if (reqDate.getFullYear() === currentYear) {
          if (reqDate.getMonth() === currentMonth) {
            monthlyCount += req.quantity;
          }
        }
    });

    const weeklySubmissions = userRequests.filter(req => {
        const reqDate = req.createdAt ? new Date(req.createdAt) : new Date();
        return reqDate.getFullYear() === currentYear && getWeek(reqDate) === currentWeek;
    }).length;

    return {
      weeklyUsage: weeklySubmissions,
      monthlyUsage: monthlyCount,
      remainingWeeklySubmissions: Math.max(0, 2 - weeklySubmissions),
      limitReached: weeklySubmissions >= 2
    };
  }
};
