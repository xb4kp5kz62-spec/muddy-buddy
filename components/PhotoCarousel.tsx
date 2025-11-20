import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { Photo } from './PhotoGallery';

interface PhotoCarouselProps {
  onClose: () => void;
}

export function PhotoCarousel({ onClose }: PhotoCarouselProps) {
  const [photos, setPhotos] = useState<Photo[]>(() => {
    const saved = localStorage.getItem('pottery-studio-photos');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [currentIndex, setCurrentIndex] = useState(0);

  // Listen for changes to photos in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('pottery-studio-photos');
      setPhotos(saved ? JSON.parse(saved) : []);
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
    if (e.key === 'Escape') onClose();
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [photos.length]);

  if (photos.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-8 max-w-md text-center">
          <div className="text-6xl mb-4">📸</div>
          <h3 className="text-slate-800 mb-2">No Photos Yet</h3>
          <p className="text-slate-600 mb-6">Add your first pottery piece to start your gallery!</p>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-terracotta-500 text-white rounded-lg hover:bg-terracotta-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const currentPhoto = photos[currentIndex];

  return (
    <div 
      className="fixed inset-0 bg-black/95 flex items-center justify-center z-50"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-10"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Navigation Buttons */}
      {photos.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-4 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-10"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-4 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-10"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </>
      )}

      {/* Main Image */}
      <div 
        className="max-w-5xl max-h-[90vh] w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={currentPhoto.imageData}
          alt={`Pottery piece from ${currentPhoto.date}`}
          className="w-full h-full object-contain rounded-lg shadow-2xl"
        />
        
        {/* Image Info Overlay */}
        <div className="mt-4 bg-white/95 backdrop-blur rounded-lg p-4 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <div className="text-slate-800">
              {new Date(currentPhoto.date).toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </div>
            <div className="text-sm text-slate-500">
              {currentIndex + 1} / {photos.length}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {currentPhoto.clayType && (
              <div>
                <span className="text-slate-500">Clay:</span>{' '}
                <span className="text-slate-800">{currentPhoto.clayType}</span>
              </div>
            )}
            {currentPhoto.glazes && (
              <div>
                <span className="text-slate-500">Glazes:</span>{' '}
                <span className="text-slate-800">{currentPhoto.glazes}</span>
              </div>
            )}
          </div>
          
          {currentPhoto.notes && (
            <div className="mt-2 text-sm text-slate-600 border-t border-slate-200 pt-2">
              {currentPhoto.notes}
            </div>
          )}
        </div>

        {/* Thumbnail Navigation */}
        {photos.length > 1 && (
          <div className="mt-4 flex items-center justify-center gap-2 overflow-x-auto pb-2">
            {photos.map((photo, index) => (
              <button
                key={photo.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentIndex 
                    ? 'border-terracotta-500 scale-110 shadow-lg' 
                    : 'border-white/30 hover:border-white/60'
                }`}
              >
                <img
                  src={photo.imageData}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
