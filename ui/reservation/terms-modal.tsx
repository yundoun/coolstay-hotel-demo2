"use client";

import { useEffect, useRef, useCallback } from "react";
import { X, Loader2 } from "lucide-react";
import { useState } from "react";

interface TermsModalProps {
  open: boolean;
  title: string;
  url: string;
  onClose: () => void;
}

export function TermsModal({ open, title, url, onClose }: TermsModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // ESC 키로 닫기
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  // 바디 스크롤 잠금
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // iframe 로딩 상태 리셋
  useEffect(() => {
    if (open) setIframeLoaded(false);
  }, [open, url]);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlayRef.current) onClose();
    },
    [onClose],
  );

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-fade-in"
      style={{ backgroundColor: "rgba(44, 40, 37, 0.5)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="relative bg-white w-full sm:max-w-2xl sm:rounded-sm rounded-t-2xl overflow-hidden flex flex-col animate-terms-slide-up"
        style={{ maxHeight: "85dvh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-warm-100 shrink-0">
          <h3 className="text-warm-900 font-medium text-[15px] leading-tight pr-4">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 -mr-1.5 rounded-sm text-warm-400 hover:text-warm-700 hover:bg-warm-50 transition-colors"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 relative">
          {!iframeLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-white">
              <Loader2 className="w-5 h-5 animate-spin text-warm-300" />
            </div>
          )}
          <iframe
            src={url}
            title={title}
            onLoad={() => setIframeLoaded(true)}
            className="w-full h-full border-0"
            style={{ minHeight: "60dvh" }}
            sandbox="allow-same-origin"
          />
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-warm-100 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-warm-50 text-warm-700 text-sm font-medium rounded-sm hover:bg-warm-100 transition-colors"
          >
            확인
          </button>
        </div>
      </div>

    </div>
  );
}
