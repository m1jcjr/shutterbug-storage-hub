
import React from 'react';
import PhotoCard from './PhotoCard';
import { Photo } from '@/utils/photoUtils';

interface PhotoGridProps {
  photos: Photo[];
  onPhotoClick: (photo: Photo) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  remainingUploads?: number;
  tierLimit?: number;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ 
  photos, 
  onPhotoClick, 
  onDelete, 
  onToggleFavorite,
  remainingUploads,
  tierLimit
}) => {
  if (photos.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg text-gray-500 mb-2">No photos yet</p>
        <p className="text-sm text-gray-400">Upload photos to see them here</p>
        {tierLimit && <p className="text-sm font-medium text-blue-600 mt-2">You can upload up to {tierLimit} photos</p>}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 p-4">
      {remainingUploads !== undefined && remainingUploads > 0 && (
        <div className="col-span-full mb-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <p className="text-sm text-blue-700">
            You can upload <span className="font-bold">{remainingUploads}</span> more photo{remainingUploads !== 1 ? 's' : ''}
          </p>
        </div>
      )}
      
      {remainingUploads !== undefined && remainingUploads <= 0 && (
        <div className="col-span-full mb-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-center">
          <p className="text-sm text-amber-700">
            You've reached your tier limit. Upgrade to upload more photos.
          </p>
        </div>
      )}
      
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

