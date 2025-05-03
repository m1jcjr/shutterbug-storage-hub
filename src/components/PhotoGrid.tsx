
import React from 'react';
import PhotoCard from './PhotoCard';
import { Photo } from '@/utils/photoUtils';

interface PhotoGridProps {
  photos: Photo[];
  onPhotoClick: (photo: Photo) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ 
  photos, 
  onPhotoClick, 
  onDelete, 
  onToggleFavorite 
}) => {
  if (photos.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg text-gray-500 mb-2">No photos yet</p>
        <p className="text-sm text-gray-400">Upload photos to see them here</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 p-4">
      {photos.map((photo) => (
        <PhotoCard
          key={photo.id}
          photo={photo}
          onClick={onPhotoClick}
          onDelete={onDelete}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
};

export default PhotoGrid;
