import { useState } from 'react';
import { X, Calendar, Droplet, Palette, FileText, Camera } from 'lucide-react';
import type { Photo } from './PhotoGallery';

interface AddPhotoModalProps {
  onClose: () => void;
  onPhotoAdded?: () => void;
}

export function AddPhotoModal({ onClose, onPhotoAdded }: AddPhotoModalProps) {
  const [formData, setFormData] = useState({
    imageData: '',
    date: new Date().toISOString().split('T')[0],
    clayType: '',
    glazes: '',
    notes: ''
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageData: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPhoto = () => {
    if (!formData.imageData) {
      alert('Please select a photo first!');
      return;
    }

    const newPhoto: Photo = {
      id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...formData,
      timestamp: Date.now()
    };

    // Get existing photos from localStorage
    const saved = localStorage.getItem('pottery-studio-photos');
    const photos = saved ? JSON.parse(saved) : [];
    
    // Add new photo at the beginning
    const updatedPhotos = [newPhoto, ...photos];
    localStorage.setItem('pottery-studio-photos', JSON.stringify(updatedPhotos));

    // Trigger custom event so PhotoGallery component updates
    window.dispatchEvent(new Event('storage'));
    
    if (onPhotoAdded) onPhotoAdded();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white px-6 py-4 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center gap-3">
            <Camera className="w-6 h-6" />
            <h3>Add New Piece</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/90 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">
          {/* Image Upload */}
          <div>
            <label className="flex items-center gap-2 text-slate-700 mb-3">
              <Camera className="w-5 h-5 text-terracotta-500" />
              Photo *
            </label>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageUpload}
              className="w-full text-sm text-slate-600 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:bg-terracotta-500 file:text-white hover:file:bg-terracotta-600 file:cursor-pointer file:transition-colors"
            />
            {formData.imageData && (
              <div className="mt-4 relative">
                <img
                  src={formData.imageData}
                  alt="Preview"
                  className="w-full rounded-lg border-2 border-slate-200 shadow-md"
                />
              </div>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="flex items-center gap-2 text-slate-700 mb-2">
              <Calendar className="w-5 h-5 text-terracotta-500" />
              Date Created
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Clay Type */}
          <div>
            <label className="flex items-center gap-2 text-slate-700 mb-2">
              <Droplet className="w-5 h-5 text-terracotta-500" />
              Clay Type
            </label>
            <input
              type="text"
              value={formData.clayType}
              onChange={(e) => setFormData(prev => ({ ...prev, clayType: e.target.value }))}
              placeholder="e.g., B-Mix 5, Laguna WC-617, Stoneware"
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Glazes */}
          <div>
            <label className="flex items-center gap-2 text-slate-700 mb-2">
              <Palette className="w-5 h-5 text-terracotta-500" />
              Glazes Used
            </label>
            <input
              type="text"
              value={formData.glazes}
              onChange={(e) => setFormData(prev => ({ ...prev, glazes: e.target.value }))}
              placeholder="e.g., Celadon, Temmoku, Clear Gloss"
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="flex items-center gap-2 text-slate-700 mb-2">
              <FileText className="w-5 h-5 text-terracotta-500" />
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Firing temp, cone, special techniques, inspiration, etc."
              rows={4}
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddPhoto}
              className="flex-1 py-3 bg-terracotta-500 text-white rounded-lg hover:bg-terracotta-600 transition-colors shadow-md hover:shadow-lg"
            >
              Save Photo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
