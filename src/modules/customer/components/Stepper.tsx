import React from "react";
import { useNavigate } from "react-router-dom";

interface StepperProps {
  current: number;
  stepPaths?: string[];
  onStepClick?: (step: number) => void;
}

const titles = ["Cart", "Address", "Payment"];

const Stepper: React.FC<StepperProps> = ({
  current,
  stepPaths,
  onStepClick,
}) => {
  const navigate = useNavigate();
  const handleClick = (step: number) => {
    if (stepPaths && stepPaths[step - 1]) navigate(stepPaths[step - 1]);
    else onStepClick?.(step);
  };

  return (
    <div className="flex items-center gap-4 mb-6">
      {titles.map((t, i) => {
        const step = i + 1;
        const active = step === current;
        const done = step < current;
        return (
          <React.Fragment key={t}>
            <button
              onClick={() => handleClick(step)}
              className="flex flex-col items-center cursor-pointer"
            >
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-semibold ${
                  done || active
                    ? "bg-blue-600 text-white"
                    : "border border-gray-300 text-gray-600"
                }`}
              >
                {done ? (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  step
                )}
              </div>
              <span
                className={`mt-1 text-[12px] font-medium ${
                  active || done ? "text-black" : "text-gray-400"
                }`}
              >
                {t}
              </span>
            </button>
            {step < titles.length && (
              <div
                className={`flex-1 h-[1px] ${
                  step < current ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Stepper;
