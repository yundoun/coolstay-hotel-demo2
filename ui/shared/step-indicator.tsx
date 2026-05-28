"use client";

import { Check } from "lucide-react";

const STEPS = [
  { label: "일정 선택", key: "dates" },
  { label: "객실 선택", key: "rooms" },
  { label: "예약자 정보", key: "guest" },
  { label: "예약 확인", key: "review" },
] as const;

interface StepIndicatorProps {
  current: number; // 1-based
  onStepClick?: (step: number) => void;
}

export function StepIndicator({ current, onStepClick }: StepIndicatorProps) {
  return (
    <div className="w-full bg-white border-b border-warm-200/50">
      <div className="max-w-3xl mx-auto px-5 md:px-8 py-4 md:py-5">
        <div className="flex items-center justify-between">
          {STEPS.map((step, i) => {
            const stepNum = i + 1;
            const isCompleted = stepNum < current;
            const isActive = stepNum === current;
            const canClick = isCompleted && onStepClick;

            return (
              <div key={step.key} className="flex items-center flex-1 last:flex-none">
                <button
                  type="button"
                  disabled={!canClick}
                  onClick={() => canClick && onStepClick(stepNum)}
                  className="flex flex-col items-center gap-1.5 disabled:cursor-default"
                >
                  <div
                    className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-semibold transition-all duration-300 ${
                      isCompleted
                        ? "bg-sig-500 text-warm-900 cursor-pointer hover:ring-2 hover:ring-sig-300"
                        : isActive
                        ? "bg-warm-900 text-white"
                        : "bg-warm-100 text-warm-400 border border-warm-200"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    ) : (
                      stepNum
                    )}
                  </div>
                  <span
                    className={`text-[10px] md:text-xs font-medium tracking-wide transition-colors duration-300 ${
                      isCompleted || isActive ? "text-warm-900" : "text-warm-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </button>

                {i < STEPS.length - 1 && (
                  <div className="flex-1 mx-2 md:mx-4 mt-[-18px] md:mt-[-20px]">
                    <div
                      className={`h-px transition-colors duration-300 ${
                        stepNum < current ? "bg-sig-500" : "bg-warm-200"
                      }`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default StepIndicator;
