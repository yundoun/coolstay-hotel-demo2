"use client";

import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  isSameMonth,
  isSameDay,
  isBefore,
  isAfter,
  isWithinInterval,
  startOfDay,
} from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MAX_NIGHTS } from "@/domain/shared/constants";

interface Props {
  checkIn: Date | undefined;
  checkOut: Date | undefined;
  onSelect: (checkIn: Date | undefined, checkOut: Date | undefined) => void;
  months?: number;
  /** 체크아웃 선택 모드에서 이 날짜 이후를 비활성화 */
  maxCheckOut?: Date;
}

export default function BookingCalendar({
  checkIn,
  checkOut,
  onSelect,
  months = 2,
  maxCheckOut,
}: Props) {
  const [baseMonth, setBaseMonth] = useState(startOfMonth(new Date()));
  const today = startOfDay(new Date());

  /* 체크아웃 선택 모드: checkIn은 있고 checkOut은 없는 상태 */
  const isSelectingCheckOut = !!checkIn && !checkOut;

  const handleDayClick = (day: Date) => {
    if (isBefore(day, today)) return;

    if (!checkIn || (checkIn && checkOut)) {
      // Start new selection
      onSelect(day, undefined);
    } else {
      // Complete selection
      if (isBefore(day, checkIn)) {
        onSelect(day, undefined);
      } else if (isSameDay(day, checkIn)) {
        return;
      } else if (maxCheckOut && isAfter(day, maxCheckOut)) {
        return;
      } else {
        onSelect(checkIn, day);
      }
    }
  };

  const isInRange = (day: Date) => {
    if (!checkIn || !checkOut) return false;
    return isWithinInterval(day, { start: checkIn, end: checkOut });
  };

  const isRangeStart = (day: Date) => checkIn && isSameDay(day, checkIn);
  const isRangeEnd = (day: Date) => checkOut && isSameDay(day, checkOut);
  const isPast = (day: Date) => isBefore(day, today);
  const isToday = (day: Date) => isSameDay(day, today);

  const renderMonth = (monthDate: Date) => {
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);
    const calStart = startOfWeek(monthStart, { locale: ko });
    const calEnd = endOfWeek(monthEnd, { locale: ko });

    const weeks: Date[][] = [];
    let current = calStart;
    while (isBefore(current, calEnd) || isSameDay(current, calEnd)) {
      const week: Date[] = [];
      for (let i = 0; i < 7; i++) {
        week.push(current);
        current = addDays(current, 1);
      }
      weeks.push(week);
    }

    return (
      <div className="w-[280px]">
        {/* Month Header */}
        <div className="text-center mb-4">
          <p className="text-warm-900 text-sm font-semibold">
            {format(monthDate, "yyyy년 M월", { locale: ko })}
          </p>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 mb-1">
          {["일", "월", "화", "수", "목", "금", "토"].map((d, i) => (
            <div
              key={d}
              className={`text-center text-[11px] py-2 ${
                i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-warm-400"
              }`}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Days */}
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7">
            {week.map((day, di) => {
              const outside = !isSameMonth(day, monthDate);
              const past = isPast(day);
              const beyondMax = isSelectingCheckOut && !!maxCheckOut && isAfter(day, maxCheckOut);
              const disabled = outside || past || beyondMax;
              const rangeStart = isRangeStart(day);
              const rangeEnd = isRangeEnd(day);
              const inRange = isInRange(day);
              const todayMark = isToday(day);

              return (
                <div
                  key={di}
                  className={`relative ${
                    !outside && inRange && !rangeStart && !rangeEnd
                      ? "bg-sig-500/10"
                      : ""
                  } ${!outside && rangeStart ? "rounded-l-full bg-sig-500/10" : ""} ${
                    !outside && rangeEnd ? "rounded-r-full bg-sig-500/10" : ""
                  }`}
                >
                  <button
                    onClick={() => !disabled && handleDayClick(day)}
                    disabled={disabled}
                    className={`
                      w-full aspect-square flex flex-col items-center justify-center text-sm rounded-full transition-all
                      ${disabled ? "text-warm-200 cursor-default" : "cursor-pointer hover:bg-warm-100"}
                      ${!outside && (rangeStart || rangeEnd) ? "bg-sig-500 text-warm-900 font-semibold hover:bg-sig-400" : ""}
                      ${inRange && !rangeStart && !rangeEnd ? "text-warm-700" : ""}
                      ${!disabled && !inRange && !rangeStart && !rangeEnd ? "text-warm-700" : ""}
                      ${todayMark && !rangeStart && !rangeEnd ? "ring-2 ring-sig-500 ring-inset font-bold text-warm-900" : ""}
                      ${di === 0 && !disabled && !rangeStart && !rangeEnd && !inRange ? "text-red-400" : ""}
                      ${di === 6 && !disabled && !rangeStart && !rangeEnd && !inRange ? "text-blue-400" : ""}
                    `}
                  >
                    {outside ? "" : (
                      <>
                        <span>{format(day, "d")}</span>
                        {todayMark && !rangeStart && !rangeEnd && (
                          <span className="text-[8px] text-sig-600 leading-none -mt-0.5">오늘</span>
                        )}
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  const monthsArray = Array.from({ length: months }, (_, i) =>
    addMonths(baseMonth, i)
  );

  return (
    <div className="p-6">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => setBaseMonth(addMonths(baseMonth, -1))}
          disabled={isSameMonth(baseMonth, new Date())}
          className="w-8 h-8 rounded-full flex items-center justify-center text-warm-400 hover:bg-warm-100 hover:text-warm-700 transition-colors disabled:opacity-20"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => setBaseMonth(addMonths(baseMonth, 1))}
          className="w-8 h-8 rounded-full flex items-center justify-center text-warm-400 hover:bg-warm-100 hover:text-warm-700 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Calendars */}
      <div className="flex gap-10">
        {monthsArray.map((m) => (
          <div key={m.toISOString()}>{renderMonth(m)}</div>
        ))}
      </div>

      {/* Selection summary */}
      {checkIn && (
        <div className="mt-4 pt-4 border-t border-warm-100 text-center text-sm text-warm-500">
          {checkIn && !checkOut && (
            <span>체크아웃 날짜를 선택해주세요</span>
          )}
          {checkIn && checkOut && (
            <span>
              {format(checkIn, "M월 d일 (EEE)", { locale: ko })} ~{" "}
              {format(checkOut, "M월 d일 (EEE)", { locale: ko })}
            </span>
          )}
          {maxCheckOut && (
            <span className="text-warm-400 text-xs ml-2">/ 최대 {MAX_NIGHTS}박</span>
          )}
        </div>
      )}
    </div>
  );
}
