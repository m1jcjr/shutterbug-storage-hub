
import React from 'react';
import { Heart, Trash } from 'lucide-react';
import { Photo, formatDate } from '@/utils/photoUtils';

interface PhotoCardProps {
  photo: Photo;
  onClick: (photo: Photo) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

const PhotoCard: React.FC<PhotoCardProps> = ({ 
  photo, 
  onClick, 
  onDelete, 
  onToggleFavorite 
}) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(photo.id);
  };
  
  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(photo.id);
  };

  return (
    <div 
      className="group relative rounded-md overflow-hidden bg-gray-100 cursor-pointer animate-fade-in transition-transform hover:scale-[1.02] hover:shadow-md"
      onClick={() => onClick(photo)}
    >
      <div className="aspect-square relative overflow-hidden">
        <img 
          src={photo.src}
          alt={photo.name}
          className="w-full h-full object-cover transition-opacity"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity"></div>
      </div>
      
      <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={handleFavoriteToggle}
          className={`p-1.5 rounded-full ${photo.favorite ? 'bg-red-500 text-white' : 'bg-white text-gray-700'} hover:scale-110 transition-all`}
          aria-label={photo.favorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className="w-4 h-4" fill={photo.favorite ? "currentColor" : "none"} />
        </button>
        <button 
          onClick={handleDelete}
          className="p-1.5 rounded-full bg-white text-gray-700 hover:bg-red-100 hover:text-red-500 hover:scale-110 transition-all"
          aria-label="Delete photo"
        >
          <Trash className="w-4 h-4" />
        </button>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-xs truncate">{photo.name}</p>
        <p className="text-xs opacity-80">{formatDate(photo.date)}</p>
      </div>
    </div>
  );
};

export default PhotoCard;
