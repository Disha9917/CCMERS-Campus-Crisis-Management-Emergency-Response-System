import React from 'react';
import { Check } from 'lucide-react';

const steps = ['Reported', 'Assigned', 'In Progress', 'Resolved', 'Closed'];

const Stepper = ({ currentStatus }) => {
  const currentIndex = steps.indexOf(currentStatus) === -1 ? 0 : steps.indexOf(currentStatus);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center w-full my-8 relative">
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        
        return (
          <div key={step} className="flex-1 flex sm:flex-row flex-col items-center relative group w-full">
            {/* Connecting line (horizontal for sm+) */}
            {index !== steps.length - 1 && (
              <div className="hidden sm:block absolute top-4 left-1/2 w-full h-[2px] -z-10 bg-slate-200">
                <div 
                  className={`h-full bg-primary transition-all duration-300 ${isCompleted ? 'w-full' : 'w-0'}`}
                />
              </div>
            )}

            {/* Connecting line (vertical for mobile) */}
            {index !== steps.length - 1 && (
              <div className="sm:hidden absolute top-8 left-4 w-[2px] h-full -z-10 bg-slate-200">
                 <div 
                  className={`w-full bg-primary transition-all duration-300 ${isCompleted ? 'h-full' : 'h-0'}`}
                />
              </div>
            )}

            {/* Step Node */}
            <div className="flex flex-row sm:flex-col items-center sm:w-full sm:justify-center mb-6 sm:mb-0 w-full gap-3 sm:gap-0">
              <div 
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors z-10 ${
                  isCompleted 
                    ? 'bg-primary border-primary text-white' 
                    : isCurrent 
                      ? 'bg-white border-primary text-primary' 
                      : 'bg-white border-slate-300 text-slate-400'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : <span className="text-sm font-medium">{index + 1}</span>}
              </div>
              <div className="sm:mt-2 text-center">
                <p className={`text-sm font-medium ${isCompleted || isCurrent ? 'text-slate-900' : 'text-slate-500'}`}>
                  {step}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;
