import { useState } from "react";
import type { CarFormData } from "../../types/Cars";

interface Props {
  onNext: (data: Partial<CarFormData>) => void;
  onBack: () => void;
  defaultValues: CarFormData;
}

export default function Step5Images({ onNext, onBack, defaultValues }: Props) {
  const [images, setImages] = useState<File[]>(defaultValues.images || []);

  const handleFileChange = (files: FileList | null) => {
    if (files) {
      setImages(Array.from(files));
    }
  };

  return (
    <div>
      <label className="block mb-2">Upload Images (min 5)</label>
      <input
        type="file"
        multiple
        onChange={(e) => handleFileChange(e.target.files)}
        className="w-full border p-2 rounded mb-4"
      />

      {images.length > 0 && (
        <p className="text-sm text-gray-600 mb-4">
          {images.length} files selected
        </p>
      )}

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          ← Back
        </button>
        &nbsp;&nbsp;&nbsp;
        <button
          onClick={() => onNext({ images })}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Next Step →
        </button>
      </div>
    </div>
  );
}
