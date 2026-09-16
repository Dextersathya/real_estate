import React, { useState, useRef, useEffect } from 'react';
import { Upload, Image as ImageIcon, Trash2, Plus, Clipboard, Check, Star, RefreshCw } from 'lucide-react';

interface ImageUploadDropzoneProps {
  images: string[];
  onChange: (newImages: string[]) => void;
  maxImages?: number;
  label?: string;
  description?: string;
}

const PRESET_PROPERTY_PHOTOS = [
  { name: 'Luxury Villa Exterior', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200' },
  { name: 'Modern Living Room', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200' },
  { name: 'Grade-A Commercial Office', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200' },
  { name: 'Contemporary Penthouse', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200' },
  { name: 'Gated Farmland & Plot', url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200' },
];

export const ImageUploadDropzone: React.FC<ImageUploadDropzoneProps> = ({
  images,
  onChange,
  maxImages = 8,
  label = 'Property Photography Dossier',
  description = 'Upload local files, drag & drop images, or paste directly from your clipboard (Ctrl+V / Cmd+V).',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [pasteNotification, setPasteNotification] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Auto-focus container or setup window paste listener
  useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      // If active element is a text input unrelated to images, skip
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'textarea' || (activeTag === 'input' && (document.activeElement as HTMLInputElement).type !== 'url')) {
        return;
      }
      processClipboardData(e.clipboardData);
    };

    window.addEventListener('paste', handleGlobalPaste);
    return () => {
      window.removeEventListener('paste', handleGlobalPaste);
    };
  }, [images]);

  const processClipboardData = (clipboardData: DataTransfer | null) => {
    if (!clipboardData) return;

    // 1. Check for image files in clipboard
    const items = clipboardData.items;
    let foundImage = false;

    if (items) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf('image') !== -1) {
          foundImage = true;
          const file = item.getAsFile();
          if (file) {
            readAndAddFile(file);
          }
        }
      }
    }

    // 2. If no file, check for text (URL) in clipboard
    if (!foundImage) {
      const text = clipboardData.getData('text');
      if (text && (text.startsWith('http://') || text.startsWith('https://') || text.startsWith('data:image/'))) {
        addSingleImage(text.trim());
        showNotice('Pasted image URL from clipboard!');
      }
    }
  };

  const readAndAddFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, WEBP, etc.).');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      alert('Image file size exceeds 15MB. Please choose a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        addSingleImage(e.target.result as string);
        showNotice(`Uploaded image "${file.name}"!`);
      }
    };
    reader.readAsDataURL(file);
  };

  const showNotice = (msg: string) => {
    setPasteNotification(msg);
    setTimeout(() => {
      setPasteNotification(null);
    }, 3000);
  };

  const addSingleImage = (imgUrl: string) => {
    if (images.length >= maxImages) {
      alert(`Maximum ${maxImages} images allowed.`);
      return;
    }
    if (images.includes(imgUrl)) return;
    onChange([...images, imgUrl]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach((file: File) => readAndAddFile(file));
      e.target.value = ''; // reset
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      Array.from(e.dataTransfer.files).forEach((file: File) => readAndAddFile(file));
    } else {
      processClipboardData(e.dataTransfer);
    }
  };

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    addSingleImage(urlInput.trim());
    setUrlInput('');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    onChange(images.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSetPrimary = (indexToMakePrimary: number) => {
    if (indexToMakePrimary === 0) return;
    const item = images[indexToMakePrimary];
    const rest = images.filter((_, idx) => idx !== indexToMakePrimary);
    onChange([item, ...rest]);
  };

  return (
    <div className="space-y-4" ref={containerRef} tabIndex={0}>
      <div>
        <label className="block text-sm font-semibold text-[#0F172A]">{label}</label>
        <p className="text-slate-500 text-xs mt-0.5">{description}</p>
      </div>

      {/* Paste notification badge */}
      {pasteNotification && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">{pasteNotification}</span>
        </div>
      )}

      {/* Dropzone Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-[#C5A059] bg-[#FDFBF7] scale-[1.01]'
            : 'border-slate-300 hover:border-[#0F172A] bg-slate-50/60 hover:bg-white'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#0F172A] text-[#C5A059] flex items-center justify-center shadow-md">
            <Upload className="w-6 h-6 stroke-[2]" />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-bold text-[#0F172A]">
              Click to browse, drag & drop, or paste image
            </p>
            <p className="text-xs text-slate-500">
              Supports PNG, JPG, WEBP, GIF (up to 15MB)
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F2F0EB] text-[#0F172A] rounded-full text-[11px] font-semibold border border-[#EADFC9]">
            <Clipboard className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Shortcut: Press <kbd className="px-1 py-0.5 bg-white rounded border border-slate-300 text-[10px]">Ctrl+V</kbd> or <kbd className="px-1 py-0.5 bg-white rounded border border-slate-300 text-[10px]">Cmd+V</kbd> to paste</span>
          </div>
        </div>
      </div>

      {/* Manual URL input fallback */}
      <div className="space-y-1">
        <label className="block text-xs font-semibold text-slate-700">Or Paste Image URL directly:</label>
        <form onSubmit={handleAddUrl} className="flex gap-2">
          <input
            type="url"
            placeholder="https://images.unsplash.com/photo-... or Data URL"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:outline-hidden focus:ring-2 focus:ring-[#C5A059]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#0F172A] text-white text-xs font-semibold rounded-xl hover:bg-[#1E293B] flex items-center gap-1 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </form>
      </div>

      {/* Preset Luxury Photos */}
      <div className="space-y-1.5 pt-1">
        <label className="block text-xs font-semibold text-slate-600">Quick Select Sample Photography:</label>
        <div className="flex flex-wrap gap-2">
          {PRESET_PROPERTY_PHOTOS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => addSingleImage(preset.url)}
              className="text-[11px] px-2.5 py-1 bg-white hover:bg-[#F2F0EB] border border-[#EADFC9] rounded-lg text-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <ImageIcon className="w-3 h-3 text-[#C5A059]" />
              <span>{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Preview Gallery Grid */}
      {images.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-slate-200">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-[#0F172A]">Uploaded Gallery ({images.length} / {maxImages})</span>
            <span className="text-slate-500">First image will be the primary listing banner</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((imgSrc, idx) => (
              <div
                key={idx}
                className="relative group rounded-xl overflow-hidden border border-slate-200 bg-black/5 aspect-4/3 shadow-2xs hover:shadow-md transition-shadow"
              >
                <img
                  src={imgSrc}
                  alt={`Upload ${idx + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Primary Badge */}
                {idx === 0 ? (
                  <span className="absolute top-1.5 left-1.5 bg-[#0F172A] text-[#C5A059] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                    <Star className="w-2.5 h-2.5 fill-[#C5A059]" />
                    Primary
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(idx)}
                    title="Set as primary image"
                    className="absolute top-1.5 left-1.5 bg-black/60 hover:bg-black text-white text-[10px] font-medium px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Make Primary
                  </button>
                )}

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  title="Remove image"
                  className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity shadow-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
