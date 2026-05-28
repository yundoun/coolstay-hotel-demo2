"use client";

import { useCallback, useState } from "react";
import { useReservation } from "@/adapters/zustand/reservation-store";
import { StepIndicator } from "@/ui/shared/step-indicator";
import { Step1Dates } from "./step-1-dates";
import { Step2Rooms } from "./step-2-rooms";
import { Step3Guest } from "./step-3-guest";
import { Step4Review } from "./step-4-review";

type Step = 1 | 2 | 3 | 4;

/**
 * Self-contained 4-step reservation flow for embedding in a single page.
 * Uses local state for step navigation, Zustand for reservation data.
 */
export function InlineReservation() {
  const [step, setStep] = useState<Step>(1);
  const store = useReservation();

  const scrollToTop = useCallback(() => {
    setTimeout(() => {
      const anchor = document.getElementById("step-scroll-anchor");
      if (anchor) {
        const top = anchor.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top, behavior: "instant" });
      }
    }, 50);
  }, []);

  const goTo = useCallback((next: Step) => {
    setStep(next);
    scrollToTop();
  }, [scrollToTop]);

  const goToWithReset = useCallback((target: number) => {
    if (target >= step) return;
    // 이동하는 단계 이후의 데이터를 모두 초기화
    if (target <= 1) {
      store.setRoom(null);
      store.clearApiRoom();
      store.setGuestInfo({ name: "", phone: "" });
      store.setPhoneVerified(false);
    } else if (target <= 2) {
      store.setGuestInfo({ name: "", phone: "" });
      store.setPhoneVerified(false);
    }
    // target === 3: 4단계 동의 상태는 로컬 state라 자동 초기화
    setStep(target as Step);
    scrollToTop();
  }, [step, store, scrollToTop]);

  const content = (() => {
    switch (step) {
      case 1:
        return <Step1Dates onNext={() => goTo(2)} />;
      case 2:
        return <Step2Rooms onNext={() => goTo(3)} onPrev={() => goTo(1)} />;
      case 3:
        return <Step3Guest onNext={() => goTo(4)} onPrev={() => goTo(2)} />;
      case 4:
        return <Step4Review onPrev={() => goTo(3)} />;
    }
  })();

  return (
    <div>
      <div id="step-scroll-anchor" aria-hidden />
      <StepIndicator current={step} onStepClick={goToWithReset} />
      <div className="pt-10">
        {content}
      </div>
    </div>
  );
}
