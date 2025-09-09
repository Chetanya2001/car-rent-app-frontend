import { useState } from "react";
import type { CarFormData } from "../../types/Cars";

interface Props {
  onNext: (data: Partial<CarFormData>) => void;
  onBack: () => void;
  defaultValues: CarFormData;
}

export default function Step3Insurance({
  onNext,
  onBack,
  defaultValues,
}: Props) {
  const [insuranceCompany, setInsuranceCompany] = useState(
    defaultValues.insuranceCompany || ""
  );
  const [insuranceIdv, setInsuranceIdv] = useState(
    defaultValues.insuranceIdv || 0
  );
  const [insuranceValidTill, setInsuranceValidTill] = useState(
    defaultValues.insuranceValidTill || ""
  );
  const [insuranceFile, setInsuranceFile] = useState<File | undefined>(
    defaultValues.insuranceFile
  );

  return (
    <div>
      <label className="block mb-2">Insurance Company</label>
      <select
        value={insuranceCompany}
        onChange={(e) => setInsuranceCompany(e.target.value)}
        className="w-full border p-2 rounded mb-4"
      >
        <option value="">Select Company</option>
        <option value="ICICI">ICICI</option>
        <option value="HDFC">HDFC</option>
        <option value="Bajaj">Bajaj</option>
      </select>

      <label className="block mb-2">Insurance IDV Value (Rs)</label>
      <input
        type="number"
        value={insuranceIdv}
        onChange={(e) => setInsuranceIdv(Number(e.target.value))}
        className="w-full border p-2 rounded mb-4"
      />

      <label className="block mb-2">Insurance Valid Till</label>
      <input
        type="date"
        value={insuranceValidTill}
        onChange={(e) => setInsuranceValidTill(e.target.value)}
        className="w-full border p-2 rounded mb-4"
      />

      <label className="block mb-2">Upload Insurance</label>
      <input
        type="file"
        onChange={(e) => setInsuranceFile(e.target.files?.[0])}
        className="w-full border p-2 rounded mb-4"
      />

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          ← Back
        </button>
        &nbsp;&nbsp;&nbsp;
        <button
          onClick={() =>
            onNext({
              insuranceCompany,
              insuranceIdv,
              insuranceValidTill,
              insuranceFile,
            })
          }
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Next Step →
        </button>
      </div>
    </div>
  );
}
