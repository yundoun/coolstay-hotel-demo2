"use client";

import { useState, useCallback } from "react";
import {
  Users,
  ArrowRight,
  ArrowLeft,
  Loader2,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useReservation } from "@/adapters/zustand/reservation-store";
import { useApiRooms } from "@/application/hooks/useApiRooms";
import { siteConfig } from "@/hotel-data";
import { nightsBetween } from "@/domain/shared/utils";
import type { ApiRoom } from "@/adapters/coolstay/types";

interface Props {
  onNext: () => void;
  onPrev: () => void;
}

/* ── 모달 컴포넌트 ── */

function RoomDetailModal({
  room,
  nights,
  onSelect,
  onClose,
}: {
  room: ApiRoom;
  nights: number;
  onSelect: () => void;
  onClose: () => void;
}) {
  const [imgIdx, setImgIdx] = useState(0);
  const images = room.images.length > 0 ? room.images : null;
  const total = images?.length ?? 0;

  const prev = useCallback(
    () => setImgIdx((i) => (i - 1 + total) % total),
    [total],
  );
  const next = useCallback(
    () => setImgIdx((i) => (i + 1) % total),
    [total],
  );

  return (
    /* backdrop */
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
      onClick={onClose}
    >
      {/* dim */}
      <div className="absolute inset-0 bg-black/50 animate-fade-in" />

      {/* panel */}
      <div
        className="relative z-10 w-full max-w-lg bg-white rounded-t-2xl md:rounded-2xl max-h-[90dvh] overflow-y-auto animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* close btn */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* image gallery */}
        {images ? (
          <div className="relative aspect-[4/3] bg-warm-100 overflow-hidden rounded-t-2xl md:rounded-t-2xl">
            <img
              src={images[imgIdx].url}
              alt={`${room.name} ${imgIdx + 1}`}
              className="w-full h-full object-cover transition-opacity duration-300"
            />

            {total > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* dots */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setImgIdx(i)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i === imgIdx
                          ? "bg-white scale-110"
                          : "bg-white/50 hover:bg-white/70"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="aspect-[4/3] bg-warm-200 flex items-center justify-center rounded-t-2xl">
            <span className="text-warm-400 text-sm">이미지 없음</span>
          </div>
        )}

        {/* info */}
        <div className="p-6">
          <h3 className="text-xl text-warm-900 font-semibold mb-3">
            {room.name}
          </h3>

          <div className="flex items-center gap-5 text-warm-500 text-sm mb-4">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>최대 {room.maxGuests}인</span>
            </div>
            {room.checkInTime && <span>체크인 {room.checkInTime}시</span>}
            {room.checkOutTime && <span>체크아웃 {room.checkOutTime}시</span>}
          </div>

          {/* daily prices */}
          {room.dailyPrices.length > 1 && (
            <div className="mb-5 p-3 bg-warm-50 rounded-lg">
              <p className="text-xs text-warm-400 mb-2">일별 요금</p>
              <div className="flex flex-wrap gap-2 text-sm text-warm-600">
                {room.dailyPrices.map((p, i) => (
                  <span key={i} className="bg-white px-2.5 py-1 rounded border border-warm-100">
                    {i + 1}박: {p.toLocaleString()}원
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* total + select btn */}
          <div className="flex items-end justify-between pt-4 border-t border-warm-100">
            <div>
              <p className="text-xs text-warm-400 mb-0.5">총 요금</p>
              <p className="text-warm-900 text-2xl font-bold">
                {room.price.toLocaleString()}
                <span className="text-sm text-warm-400 font-normal ml-1">
                  원{nights > 0 ? ` / ${nights}박` : ""}
                </span>
              </p>
            </div>
            <button
              onClick={onSelect}
              className="flex items-center gap-2 px-6 py-3 bg-sig-500 text-warm-900 font-semibold rounded-lg hover:bg-sig-400 transition-all duration-300 active:scale-[0.98] text-sm"
            >
              선택하기
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 그리드 카드 컴포넌트 ── */

function RoomCard({
  room,
  nights,
  onClick,
}: {
  room: ApiRoom;
  nights: number;
  onClick: () => void;
}) {
  const thumb = room.images[0]?.thumbUrl ?? room.image;
  const imageCount = room.images.length;

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-white border border-warm-200/50 rounded-lg overflow-hidden hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] transition-all duration-500"
    >
      {/* thumbnail */}
      <div className="relative aspect-[4/3] bg-warm-100 overflow-hidden">
        {thumb ? (
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
            style={{ backgroundImage: `url(${thumb})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-warm-200 flex items-center justify-center">
            <span className="text-warm-400 text-sm">이미지 없음</span>
          </div>
        )}

        {/* image count badge */}
        {imageCount > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
            +{imageCount}장
          </div>
        )}
      </div>

      {/* info */}
      <div className="p-4">
        <h3 className="text-base text-warm-900 font-medium mb-1.5 truncate">
          {room.name}
        </h3>
        <div className="flex items-center gap-3 text-warm-400 text-xs mb-3">
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>최대 {room.maxGuests}인</span>
          </div>
          {room.checkInTime && <span>IN {room.checkInTime}시</span>}
        </div>

        <div className="pt-3 border-t border-warm-100">
          <p className="text-warm-900 text-lg font-bold">
            {room.price.toLocaleString()}
            <span className="text-xs text-warm-400 font-normal ml-1">
              원{nights > 0 ? ` / ${nights}박` : ""}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── 메인 Step2 ── */

export function Step2Rooms({ onNext, onPrev }: Props) {
  const store = useReservation();
  const nights = nightsBetween(store.checkIn, store.checkOut);
  const { storeData, loading, error } = useApiRooms(
    store.checkIn,
    store.checkOut,
    nights,
  );
  const [selectedRoom, setSelectedRoom] = useState<ApiRoom | null>(null);

  const handleSelect = (room: ApiRoom) => {
    store.setHotel(siteConfig.id);
    store.setRoom(room.packageKey);
    store.setApiRoom({
      motelKey: storeData?.motelKey ?? "",
      storeName: storeData?.storeName ?? "",
      sitePayment: storeData?.sitePayment ?? true,
      packageKey: room.packageKey,
      roomName: room.name,
      roomImage: room.image,
      maxGuests: room.maxGuests,
      price: room.price,
      dailyPrices: room.dailyPrices,
      checkInTime: room.checkInTime,
      checkOutTime: room.checkOutTime,
    });
    setSelectedRoom(null);
    onNext();
  };

  return (
    <div>
      <div className="mb-8">
        <h3 className="text-xl md:text-2xl text-warm-900 font-medium mb-2">
          객실을 선택해 주세요
        </h3>
        <p className="text-warm-500 text-sm">
          {store.checkIn} ~ {store.checkOut} ({nights}박) · 성인{" "}
          {store.adults}명
        </p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 text-warm-400 animate-spin mr-3" />
          <span className="text-warm-500 text-sm">
            객실 정보를 조회 중입니다...
          </span>
        </div>
      )}

      {error && (
        <div className="text-center py-16">
          <p className="text-warm-500 text-sm">{error}</p>
        </div>
      )}

      {!loading && !error && (storeData?.rooms ?? []).length === 0 && (
        <div className="text-center py-16">
          <p className="text-warm-500 text-sm">
            선택하신 날짜에 예약 가능한 객실이 없습니다.
          </p>
        </div>
      )}

      {/* Grid */}
      {!loading && !error && (storeData?.rooms ?? []).length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {storeData!.rooms.map((room) => (
            <RoomCard
              key={room.packageKey}
              room={room}
              nights={nights}
              onClick={() => setSelectedRoom(room)}
            />
          ))}
        </div>
      )}

      {/* Back Button */}
      <div className="mt-8">
        <button
          onClick={onPrev}
          className="flex items-center gap-2 text-warm-500 text-sm hover:text-warm-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          일정 다시 선택
        </button>
      </div>

      {/* Detail Modal */}
      {selectedRoom && (
        <RoomDetailModal
          room={selectedRoom}
          nights={nights}
          onSelect={() => handleSelect(selectedRoom)}
          onClose={() => setSelectedRoom(null)}
        />
      )}
    </div>
  );
}
