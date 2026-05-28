"use client";

import { Users, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { useReservation } from "@/adapters/zustand/reservation-store";
import { useApiRooms } from "@/application/hooks/useApiRooms";
import { siteConfig } from "@/hotel-data";
import { nightsBetween } from "@/domain/shared/utils";
import type { ApiRoom } from "@/adapters/coolstay/types";

interface Props {
  onNext: () => void;
  onPrev: () => void;
}

export function Step2Rooms({ onNext, onPrev }: Props) {
  const store = useReservation();
  const nights = nightsBetween(store.checkIn, store.checkOut);
  const { storeData, loading, error } = useApiRooms(store.checkIn, store.checkOut, nights);

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
    onNext();
  };

  return (
    <div>
      <div className="mb-8">
        <h3 className="text-xl md:text-2xl text-warm-900 font-medium mb-2">
          객실을 선택해 주세요
        </h3>
        <p className="text-warm-500 text-sm">
          {store.checkIn} ~ {store.checkOut} ({nights}박) · 성인 {store.adults}명
        </p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 text-warm-400 animate-spin mr-3" />
          <span className="text-warm-500 text-sm">객실 정보를 조회 중입니다...</span>
        </div>
      )}

      {error && (
        <div className="text-center py-16">
          <p className="text-warm-500 text-sm">{error}</p>
        </div>
      )}

      {!loading && !error && (storeData?.rooms ?? []).length === 0 && (
        <div className="text-center py-16">
          <p className="text-warm-500 text-sm">선택하신 날짜에 예약 가능한 객실이 없습니다.</p>
        </div>
      )}

      {!loading && !error && (storeData?.rooms ?? []).length > 0 && (
        <div className="space-y-5">
          {storeData!.rooms.map((room) => (
            <div
              key={room.packageKey}
              className="flex flex-col md:flex-row bg-white border border-warm-200/50 rounded-sm overflow-hidden hover:shadow-[0_8px_40px_rgba(0,0,0,0.06)] transition-all duration-500 group"
            >
              {/* Image */}
              <div className="relative h-48 md:h-auto md:w-72 shrink-0 overflow-hidden">
                {room.image ? (
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                    style={{ backgroundImage: `url(${room.image})` }}
                  />
                ) : (
                  <div className="absolute inset-0 bg-warm-200 flex items-center justify-center">
                    <span className="text-warm-400 text-sm">이미지 없음</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 p-5 md:p-7 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg text-warm-900 font-medium mb-2">{room.name}</h3>
                  <div className="flex items-center gap-5 text-warm-500 text-sm mb-3">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      <span>최대 {room.maxGuests}인</span>
                    </div>
                    {room.checkInTime && (
                      <span>체크인 {room.checkInTime}시</span>
                    )}
                  </div>
                  {room.dailyPrices.length > 1 && (
                    <div className="flex flex-wrap gap-1.5 text-xs text-warm-400">
                      {room.dailyPrices.map((p, i) => (
                        <span key={i} className="bg-warm-50 px-2 py-0.5 rounded">
                          {i + 1}박: {p.toLocaleString()}원
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-end justify-between mt-5 pt-5 border-t border-warm-100">
                  <div>
                    <p className="text-warm-900 text-xl font-bold">
                      {room.price.toLocaleString()}
                      <span className="text-sm text-warm-400 font-sans ml-1">
                        원{nights > 0 ? ` / ${nights}박` : ""}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => handleSelect(room)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-sig-500 text-warm-900 font-semibold rounded-sm hover:bg-sig-400 transition-all duration-300 active:scale-[0.98] text-sm"
                  >
                    선택하기
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
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
    </div>
  );
}
