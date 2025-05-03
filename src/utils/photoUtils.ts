
import { toast } from "sonner";

export interface Photo {
  id: string;
  src: string;
  name: string;
  date: Date;
  favorite: boolean;
}

// Local storage key
const STORAGE_KEY = 'shutterbug_photos';

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
