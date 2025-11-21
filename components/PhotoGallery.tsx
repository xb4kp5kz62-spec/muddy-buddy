import { useState, useEffect } from 'react';
import { Camera, X, Calendar, Droplet, Palette, FileText, Plus, Edit2, Trash2 } from 'lucide-react';

export interface Photo {
  id: string;
  imageData: string; // base64
  date: string;
  clayType: string;
  glazes: string;
  notes: string;
  timestamp: number;
}

interface PhotoGalleryProps {
  onAddPhotoClick?: () => void;
}

export function PhotoGallery({ onAddPhotoClick }: PhotoGalleryProps) {
  const [photos, setPhotos] = useState<Photo[]>(() => {
    const saved = localStorage.getItem('pottery-studio-photos');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    date: '',
    clayType: '',
    glazes: '',
    notes: ''
  });
  const [formData, setFormData] = useState({
    imageData: '',
    date: new Date().toISOString().split('T')[0],
    clayType: '',
    glazes: '',
    notes: ''
  });

  useEffect(() => {
    localStorage.setItem('pottery-studio-photos', JSON.stringify(photos));
  }, [photos]);

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

    setPhotos(prev => [newPhoto, ...prev]);
    setFormData({
      imageData: '',
      date: new Date().toISOString().split('T')[0],
      clayType: '',
      glazes: '',
      notes: ''
    });
    setShowAddForm(false);
    if (onAddPhotoClick) onAddPhotoClick();
  };

  const handleDeletePhoto = (id: string) => {
    if (confirm('Delete this photo?')) {
      setPhotos(prev => prev.filter(p => p.id !== id));
      setSelectedPhoto(null);
    }
  };

  const startEditing = (photo: Photo) => {
    setEditData({
      date: photo.date,
      clayType: photo.clayType,
      glazes: photo.glazes,
      notes: photo.notes
    });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditData({
      date: '',
      clayType: '',
      glazes: '',
      notes: ''
    });
  };

  const saveEdits = () => {
    if (selectedPhoto) {
      setPhotos(prev =>
        prev.map(p =>
          p.id === selectedPhoto.id
            ? { ...p, ...editData }
            : p
        )
      );
      setSelectedPhoto({ ...selectedPhoto, ...editData });
      setIsEditing(false);
    }
  };

  const openAddForm = () => {
    setShowAddForm(true);
    if (onAddPhotoClick) onAddPhotoClick();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mt-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-terracotta-500" />
          <h2 className="text-slate-800">My Pottery Gallery</h2>
          <span className="text-sm text-slate-500">({photos.length} pieces)</span>
        </div>
        <button
          onClick={openAddForm}
          className="flex items-center gap-2 px-4 py-2 bg-terracotta-500 text-white rounded-lg hover:bg-terracotta-600 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Photo</span>
        </button>
      </div>

      {/* Add Photo Form */}
      {showAddForm && (
        <div className="mb-6 p-4 bg-ochre-50 rounded-lg border-2 border-ochre-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-800">Add New Piece</h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-slate-500 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Image Upload */}
            <div>
              <label className="block text-sm text-slate-700 mb-2">Photo *</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-terracotta-500 file:text-white hover:file:bg-terracotta-600 file:cursor-pointer"
              />
              {formData.imageData && (
                <img
                  src={formData.imageData}
                  alt="Preview"
                  className="mt-2 w-full max-w-xs rounded-lg border-2 border-slate-200"
                />
              )}
            </div>

            {/* Date */}
            <div>
              <label className="flex items-center gap-2 text-sm text-slate-700 mb-2">
                <Calendar className="w-4 h-4" />
                Date Created
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              />
            </div>

            {/* Clay Type */}
            <div>
              <label className="flex items-center gap-2 text-sm text-slate-700 mb-2">
                <Droplet className="w-4 h-4" />
                Clay Type
              </label>
              <input
                type="text"
                value={formData.clayType}
                onChange={(e) => setFormData(prev => ({ ...prev, clayType: e.target.value }))}
                placeholder="e.g., B-Mix 5, Laguna WC-617"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              />
            </div>

            {/* Glazes */}
            <div>
              <label className="flex items-center gap-2 text-sm text-slate-700 mb-2">
                <Palette className="w-4 h-4" />
                Glazes Used
              </label>
              <input
                type="text"
                value={formData.glazes}
                onChange={(e) => setFormData(prev => ({ ...prev, glazes: e.target.value }))}
                placeholder="e.g., Celadon, Temmoku, Clear"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="flex items-center gap-2 text-sm text-slate-700 mb-2">
                <FileText className="w-4 h-4" />
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Firing temp, cone, special techniques, etc."
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleAddPhoto}
              className="w-full py-3 bg-terracotta-500 text-white rounded-lg hover:bg-terracotta-600 transition-colors shadow-sm"
            >
              Save Photo
            </button>
          </div>
        </div>
      )}

      {/* Photo Grid */}
      {photos.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <Camera className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p>No photos yet. Start documenting your pottery journey! 🏺</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className="group relative bg-white rounded-lg border-2 border-slate-200 overflow-hidden hover:border-terracotta-400 hover:shadow-lg transition-all cursor-pointer"
            >
              <img
                src={photo.imageData}
                alt={`Pottery piece from ${photo.date}`}
                className="w-full h-48 object-cover"
              />
              <div className="p-3">
                <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(photo.date).toLocaleDateString()}</span>
                </div>
                {photo.clayType && (
                  <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                    <Droplet className="w-3 h-3" />
                    <span className="truncate">{photo.clayType}</span>
                  </div>
                )}
                {photo.glazes && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Palette className="w-3 h-3" />
                    <span className="truncate">{photo.glazes}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Photo Detail Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
              <h3 className="text-slate-800">{isEditing ? 'Edit Details' : 'Piece Details'}</h3>
              <div className="flex items-center gap-2">
                {!isEditing && (
                  <button
                    onClick={() => startEditing(selectedPhoto)}
                    className="flex items-center gap-1 px-3 py-1 text-sm text-terracotta-600 hover:bg-terracotta-50 rounded transition-colors"
                  >
                    <Edit2 className="w-3 h-3" />
                    Edit
                  </button>
                )}
                <button
                  onClick={() => handleDeletePhoto(selectedPhoto.id)}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </button>
                <button
                  onClick={() => {
                    setSelectedPhoto(null);
                    setIsEditing(false);
                  }}
                  className="text-slate-500 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <img
                src={selectedPhoto.imageData}
                alt="Pottery piece"
                className="w-full rounded-lg mb-4"
              />
              
              {isEditing ? (
                // Edit Mode
                <div className="space-y-4">
                  {/* Date */}
                  <div>
                    <label className="flex items-center gap-2 text-sm text-slate-700 mb-2">
                      <Calendar className="w-4 h-4" />
                      Date Created
                    </label>
                    <input
                      type="date"
                      value={editData.date}
                      onChange={(e) => setEditData(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                    />
                  </div>

                  {/* Clay Type */}
                  <div>
                    <label className="flex items-center gap-2 text-sm text-slate-700 mb-2">
                      <Droplet className="w-4 h-4" />
                      Clay Type
                    </label>
                    <input
                      type="text"
                      value={editData.clayType}
                      onChange={(e) => setEditData(prev => ({ ...prev, clayType: e.target.value }))}
                      placeholder="e.g., B-Mix 5, Laguna WC-617"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                    />
                  </div>

                  {/* Glazes */}
                  <div>
                    <label className="flex items-center gap-2 text-sm text-slate-700 mb-2">
                      <Palette className="w-4 h-4" />
                      Glazes Used
                    </label>
                    <input
                      type="text"
                      value={editData.glazes}
                      onChange={(e) => setEditData(prev => ({ ...prev, glazes: e.target.value }))}
                      placeholder="e.g., Celadon, Temmoku, Clear"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="flex items-center gap-2 text-sm text-slate-700 mb-2">
                      <FileText className="w-4 h-4" />
                      Notes
                    </label>
                    <textarea
                      value={editData.notes}
                      onChange={(e) => setEditData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Firing temp, cone, special techniques, etc."
                      rows={4}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={saveEdits}
                      className="flex-1 py-2 bg-terracotta-500 text-white rounded-lg hover:bg-terracotta-600 transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="flex-1 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-terracotta-500 mt-0.5" />
                    <div>
                      <div className="text-sm text-slate-500">Date Created</div>
                      <div className="text-slate-800">{new Date(selectedPhoto.date).toLocaleDateString()}</div>
                    </div>
                  </div>

                  {selectedPhoto.clayType && (
                    <div className="flex items-start gap-3">
                      <Droplet className="w-5 h-5 text-terracotta-500 mt-0.5" />
                      <div>
                        <div className="text-sm text-slate-500">Clay Type</div>
                        <div className="text-slate-800">{selectedPhoto.clayType}</div>
                      </div>
                    </div>
                  )}

                  {selectedPhoto.glazes && (
                    <div className="flex items-start gap-3">
                      <Palette className="w-5 h-5 text-terracotta-500 mt-0.5" />
                      <div>
                        <div className="text-sm text-slate-500">Glazes Used</div>
                        <div className="text-slate-800">{selectedPhoto.glazes}</div>
                      </div>
                    </div>
                  )}

                  {selectedPhoto.notes && (
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-terracotta-500 mt-0.5" />
                      <div>
                        <div className="text-sm text-slate-500">Notes</div>
                        <div className="text-slate-800 whitespace-pre-wrap">{selectedPhoto.notes}</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
