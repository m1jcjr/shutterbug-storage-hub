
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import PhotoGrid from '@/components/PhotoGrid';
import UploadButton from '@/components/UploadButton';
import PhotoModal from '@/components/PhotoModal';
import TierDialog from '@/components/TierDialog';
import { Photo, loadPhotos, addPhoto, deletePhoto, toggleFavorite, loadUserTier, tiers, TierType } from '@/utils/photoUtils';
import { toast } from 'sonner';

const Index = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userTier, setUserTier] = useState<TierType>('free');
  
  // Load photos and user tier on component mount
  useEffect(() => {
    const savedPhotos = loadPhotos();
    setPhotos(savedPhotos);
    
    const savedTier = loadUserTier();
    setUserTier(savedTier);
  }, []);
  
  // Filter photos based on search query
  const filteredPhotos = photos.filter(photo =>
    photo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Calculate remaining uploads based on tier
  const maxPhotos = tiers[userTier].maxPhotos;
  const remainingUploads = maxPhotos - photos.length;
  
  // Handle file upload
  const handleFileUpload = async (files: FileList) => {
    if (remainingUploads <= 0) {
      toast.error(`You've reached your upload limit (${maxPhotos} photos). Upgrade your tier to upload more.`);
      return;
    }
    
    // Calculate how many files we can actually upload
    const numToUpload = Math.min(remainingUploads, files.length);
    
    if (numToUpload < files.length) {
      toast.warning(`Only uploading ${numToUpload} out of ${files.length} photos due to tier limits.`);
    }
    
    let updatedPhotos = [...photos];
    
    // Only process the allowable number of uploads
    for (let i = 0; i < numToUpload; i++) {
      updatedPhotos = await addPhoto(files[i], updatedPhotos);
    }
    
    setPhotos(updatedPhotos);
  };
  
  // Handle tier change
  const handleTierChange = (newTier: TierType) => {
    setUserTier(newTier);
  };
  
  // Handle photo deletion
  const handleDelete = (id: string) => {
    const updatedPhotos = deletePhoto(id, photos);
    setPhotos(updatedPhotos);
    
    if (selectedPhoto && selectedPhoto.id === id) {
      setSelectedPhoto(null);
      setIsModalOpen(false);
    }
  };
  
  // Handle favorite toggle
  const handleToggleFavorite = (id: string) => {
    const updatedPhotos = toggleFavorite(id, photos);
    setPhotos(updatedPhotos);
    
    // Update selected photo if it's the one being favorited
    if (selectedPhoto && selectedPhoto.id === id) {
      const updatedPhoto = updatedPhotos.find(p => p.id === id);
      if (updatedPhoto) {
        setSelectedPhoto(updatedPhoto);
      }
    }
  };
  
  // Handle photo selection
  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
    setIsModalOpen(true);
  };
  
  // Navigate between photos in modal
  const handleNavigate = (direction: 'prev' | 'next') => {
    if (!selectedPhoto) return;
    
    const currentIndex = filteredPhotos.findIndex(p => p.id === selectedPhoto.id);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'next' 
      ? currentIndex + 1 
      : currentIndex - 1;
    
    if (newIndex >= 0 && newIndex < filteredPhotos.length) {
      setSelectedPhoto(filteredPhotos[newIndex]);
    }
  };
  
  // Check if navigation is possible
  const selectedPhotoIndex = selectedPhoto 
    ? filteredPhotos.findIndex(p => p.id === selectedPhoto.id)
    : -1;
    
  const hasNext = selectedPhotoIndex < filteredPhotos.length - 1 && selectedPhotoIndex !== -1;
  const hasPrevious = selectedPhotoIndex > 0;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <main className="flex-grow flex flex-col">
        <div className="bg-white p-4 flex justify-between items-center border-b">
          <TierDialog currentTier={userTier} onTierChange={handleTierChange} />
          <UploadButton onUpload={handleFileUpload} disabled={remainingUploads <= 0} />
        </div>
        
        <PhotoGrid 
          photos={filteredPhotos}
          onPhotoClick={handlePhotoClick}
          onDelete={handleDelete}
          onToggleFavorite={handleToggleFavorite}
          remainingUploads={remainingUploads}
          tierLimit={maxPhotos}
        />
      </main>
      
      <PhotoModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        photo={selectedPhoto}
        onDelete={handleDelete}
        onToggleFavorite={handleToggleFavorite}
        onNavigate={handleNavigate}
        hasNext={hasNext}
        hasPrevious={hasPrevious}
      />
    </div>
  );
};

export default Index;

