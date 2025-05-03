
import { toast } from "sonner";

export interface Photo {
  id: string;
  src: string;
  name: string;
  date: Date;
  favorite: boolean;
}

export type TierType = "free" | "pro" | "pro-plus";

export interface Tier {
  name: string;
  type: TierType;
  maxPhotos: number;
  description: string;
}

// Tier definitions
export const tiers: Record<TierType, Tier> = {
  "free": {
    name: "Free",
    type: "free",
    maxPhotos: 2,
    description: "Basic tier with up to 2 photos"
  },
  "pro": {
    name: "Pro",
    type: "pro",
    maxPhotos: 4,
    description: "Professional tier with up to 4 photos"
  },
  "pro-plus": {
    name: "Pro Plus",
    type: "pro-plus",
    maxPhotos: 10,
    description: "Premium tier with up to 10 photos"
  }
};

// Local storage keys
const STORAGE_KEY = 'shutterbug_photos';
const TIER_STORAGE_KEY = 'shutterbug_tier';

// Load photos from localStorage
export const loadPhotos = (): Photo[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Convert string dates back to Date objects
      return parsed.map((photo: any) => ({
        ...photo,
        date: new Date(photo.date)
      }));
    }
  } catch (error) {
    console.error('Error loading photos from storage:', error);
    toast.error('Failed to load photos');
  }
  return [];
};

// Save photos to localStorage
export const savePhotos = (photos: Photo[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
  } catch (error) {
    console.error('Error saving photos to storage:', error);
    toast.error('Failed to save photos');
  }
};

// Load user tier from localStorage
export const loadUserTier = (): TierType => {
  try {
    const savedTier = localStorage.getItem(TIER_STORAGE_KEY);
    if (savedTier && Object.keys(tiers).includes(savedTier)) {
      return savedTier as TierType;
    }
  } catch (error) {
    console.error('Error loading tier from storage:', error);
  }
  return "free"; // Default to free tier
};

// Save user tier to localStorage
export const saveUserTier = (tier: TierType): void => {
  try {
    localStorage.setItem(TIER_STORAGE_KEY, tier);
    toast.success(`Switched to ${tiers[tier].name} tier`);
  } catch (error) {
    console.error('Error saving tier to storage:', error);
    toast.error('Failed to update tier');
  }
};

// Generate a unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Convert a File to a data URL
export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to data URL'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Add a new photo
export const addPhoto = async (file: File, currentPhotos: Photo[]): Promise<Photo[]> => {
  try {
    const dataUrl = await fileToDataUrl(file);
    
    const newPhoto: Photo = {
      id: generateId(),
      src: dataUrl,
      name: file.name,
      date: new Date(),
      favorite: false
    };
    
    const updatedPhotos = [newPhoto, ...currentPhotos];
    savePhotos(updatedPhotos);
    toast.success('Photo added successfully');
    return updatedPhotos;
  } catch (error) {
    console.error('Error adding photo:', error);
    toast.error('Failed to add photo');
    return currentPhotos;
  }
};

// Delete a photo
export const deletePhoto = (id: string, photos: Photo[]): Photo[] => {
  const updatedPhotos = photos.filter(photo => photo.id !== id);
  savePhotos(updatedPhotos);
  toast.success('Photo deleted successfully');
  return updatedPhotos;
};

// Toggle favorite status
export const toggleFavorite = (id: string, photos: Photo[]): Photo[] => {
  const updatedPhotos = photos.map(photo => 
    photo.id === id ? { ...photo, favorite: !photo.favorite } : photo
  );
  savePhotos(updatedPhotos);
  return updatedPhotos;
};

// Format date for display
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

