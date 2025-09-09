import { useState } from "react";
import type { CarFormData } from "../../types/Cars";

interface Props {
  onNext: (data: Partial<CarFormData>) => void;
  onBack: () => void;
  defaultValues: CarFormData;
}

export default function Step2Registration({
  onNext,
  onBack,
  defaultValues,
}: Props) {
  const [ownerName, setOwnerName] = useState(defaultValues.ownerName || "");
  const [registrationNo, setRegistrationNo] = useState(
    defaultValues.registrationNo || ""
  );
  const [cityOfRegistration, setCityOfRegistration] = useState(
    defaultValues.cityOfRegistration || ""
  );
  const [rcValidTill, setRcValidTill] = useState(
    defaultValues.rcValidTill || ""
  );
  const [rcFile, setRcFile] = useState<File | undefined>(defaultValues.rcFile);

  return (
    <div>
      <label className="block mb-2">Owner Name (as in RC)</label>
      <input
        type="text"
        value={ownerName}
        onChange={(e) => setOwnerName(e.target.value)}
        className="w-full border p-2 rounded mb-4"
      />

      <label className="block mb-2">Registration No</label>
      <input
        type="text"
        value={registrationNo}
        onChange={(e) => setRegistrationNo(e.target.value)}
        className="w-full border p-2 rounded mb-4"
      />

      <label className="block mb-2">City of Registration</label>
      <select
        value={cityOfRegistration}
        onChange={(e) => setCityOfRegistration(e.target.value)}
        className="w-full border p-2 rounded mb-4"
      >
        <option value="">Select City</option>
        <option value="Delhi">Delhi</option>
        <option value="Agra">Agra</option>
        <option value="Mumbai">Mumbai</option>
      </select>

      <label className="block mb-2">RC Valid Till</label>
      <input
        type="date"
        value={rcValidTill}
        onChange={(e) => setRcValidTill(e.target.value)}
        className="w-full border p-2 rounded mb-4"
      />

      <label className="block mb-2">Upload RC</label>
      <input
        type="file"
        onChange={(e) => setRcFile(e.target.files?.[0])}
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
              ownerName,
              registrationNo,
              cityOfRegistration,
              rcValidTill,
              rcFile,
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
