
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Heart, Trash, X, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Photo, formatDate } from '@/utils/photoUtils';

interface PhotoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  photo: Photo | null;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  hasNext: boolean;
  hasPrevious: boolean;
}

const PhotoModal: React.FC<PhotoModalProps> = ({
  open,
  onOpenChange,
  photo,
  onDelete,
  onToggleFavorite,
  onNavigate,
  hasNext,
  hasPrevious
}) => {
  if (!photo) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[95vw] p-0 overflow-hidden bg-black text-white">
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-black/50 border-0 text-white hover:bg-black/80"
            onClick={() => onToggleFavorite(photo.id)}
          >
            <Heart className="h-5 w-5" fill={photo.favorite ? "currentColor" : "none"} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-black/50 border-0 text-white hover:bg-black/80 hover:text-red-400"
            onClick={() => {
              onDelete(photo.id);
              onOpenChange(false);
            }}
          >
            <Trash className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-black/50 border-0 text-white hover:bg-black/80"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        {hasPrevious && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => onNavigate('prev')}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 border-0 text-white hover:bg-black/80"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        
        {hasNext && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => onNavigate('next')}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 border-0 text-white hover:bg-black/80"
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
        )}
        
        <div className="flex flex-col h-[80vh]">
          <div className="flex-grow flex items-center justify-center p-4">
            <img
              src={photo.src}
              alt={photo.name}
              className="max-h-full max-w-full object-contain"
            />
          </div>
          
          <div className="p-4 bg-black/90">
            <h3 className="text-lg font-semibold">{photo.name}</h3>
            <p className="text-sm text-gray-300">{formatDate(photo.date)}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PhotoModal;
