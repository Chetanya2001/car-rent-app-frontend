import { useState } from "react";
import Step1CarDetails from "./Step1CarDetails";
import Step2Registration from "./Step2Registration";
import Step3Insurance from "./Step3Insurance";
import Step4Features from "./Step4Features";
import Step5Images from "./Step5Images";
import Step6Availability from "./Step6Availability";
import Navbar from "../Navbar/Navbar";
import "./AddCarWizard.css";
import type { CarFormData } from "../../types/Cars";
interface AddCarWizardProps {
  onClose?: () => void; // optional since Navbar may handle navigation
}

const steps = [
  "Car Details",
  "Registration Details",
  "Insurance Details",
  "Features",
  "Images",
  "Availability & Rent",
];

export default function AddCarWizard({ onClose }: AddCarWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<CarFormData>({});

  const handleNext = (data: Partial<CarFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = () => {
    console.log("Final Data:", formData);
    alert("Car Added Successfully ✅");
    if (onClose) onClose();
  };

  return (
    <>
      <Navbar />
      <div className="add-car-wizard">
        {/* ✅ Navbar */}

        <div className="wizard-card">
          {/* Progress Bar */}
          <div className="progress-container">
            <p className="progress-text">
              Step {currentStep + 1} of {steps.length}
            </p>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${((currentStep + 1) / steps.length) * 100}%`,
                }}
              />
            </div>
            <p className="step-title">{steps[currentStep]}</p>
          </div>

          {/* Step Forms */}
          {currentStep === 0 && (
            <Step1CarDetails onNext={handleNext} defaultValues={formData} />
          )}
          {currentStep === 1 && (
            <Step2Registration
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}
          {currentStep === 2 && (
            <Step3Insurance
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}
          {currentStep === 3 && (
            <Step4Features
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}
          {currentStep === 4 && (
            <Step5Images
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}
          {currentStep === 5 && (
            <Step6Availability
              onNext={handleSubmit}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}
        </div>
      </div>
    </>
  );
}
