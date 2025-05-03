
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import PhotoGrid from '@/components/PhotoGrid';
import UploadButton from '@/components/UploadButton';
import PhotoModal from '@/components/PhotoModal';
import { Photo, loadPhotos, addPhoto, deletePhoto, toggleFavorite } from '@/utils/photoUtils';

const Index = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Load photos on component mount
  useEffect(() => {
    const savedPhotos = loadPhotos();
    setPhotos(savedPhotos);
  }, []);
  
  // Filter photos based on search query
  const filteredPhotos = photos.filter(photo =>
    photo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle file upload
  const handleFileUpload = async (files: FileList) => {
    let updatedPhotos = [...photos];
    
    for (let i = 0; i < files.length; i++) {
      updatedPhotos = await addPhoto(files[i], updatedPhotos);
    }
    
    setPhotos(updatedPhotos);
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
        <UploadButton onUpload={handleFileUpload} />
        <PhotoGrid 
          photos={filteredPhotos}
          onPhotoClick={handlePhotoClick}
          onDelete={handleDelete}
          onToggleFavorite={handleToggleFavorite}
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
