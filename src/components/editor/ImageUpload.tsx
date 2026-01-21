import { useRef } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface ImageUploadProps {
  value?: string;
  onChange: (image: string | undefined) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 500KB to keep localStorage reasonable)
    if (file.size > 500 * 1024) {
      alert('Image must be less than 500KB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      // Resize image to keep it small
      resizeImage(result, 128, 128, (resized) => {
        onChange(resized);
      });
    };
    reader.readAsDataURL(file);

    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const resizeImage = (
    dataUrl: string,
    maxWidth: number,
    maxHeight: number,
    callback: (resized: string) => void
  ) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;

      // Calculate new dimensions maintaining aspect ratio
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        callback(canvas.toDataURL('image/png', 0.8));
      }
    };
    img.src = dataUrl;
  };

  return (
    <div className="space-y-2">
      <Label>Image</Label>
      <div className="flex items-center gap-3">
        {value ? (
          <div className="relative">
            <img
              src={value}
              alt="Segment image"
              className="h-16 w-16 rounded-lg object-cover border"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6"
              onClick={() => onChange(undefined)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            className="h-16 w-16 flex-col gap-1"
            onClick={() => inputRef.current?.click()}
          >
            <ImagePlus className="h-5 w-5" />
            <span className="text-xs">Upload</span>
          </Button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <p className="text-xs text-muted-foreground">
          PNG, JPG up to 500KB
        </p>
      </div>
    </div>
  );
}
