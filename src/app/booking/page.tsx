import Header from "@/components/layout/Header";
import SearchBar from "@/components/layout/SearchBar";
import Footer from "@/components/layout/Footer";
import StepIndicator from "@/components/booking/StepIndicator";
import { hotelRepository } from "@/providers/repositories";
import BookingSearchClient from "./BookingSearchClient";

interface Props {
  searchParams: {
    checkIn?: string;
    checkOut?: string;
    guests?: string;
    location?: string;
    region?: string;
    rooms?: string;
  };
}

export default async function BookingPage({ searchParams }: Props) {
  const hasSearched = !!(searchParams.checkIn || searchParams.region);

  const hotels = hasSearched
    ? await hotelRepository.search({
        checkIn: searchParams.checkIn || "",
        checkOut: searchParams.checkOut || "",
        guests: Number(searchParams.guests) || 2,
        location: searchParams.location,
      })
    : [];

  return (
    <main className="min-h-screen bg-[var(--warm-50)] flex flex-col">
      <Header
        navItems={[{ label: "호텔", href: "/hotels" }]}
      />

      <div className="pt-14 md:pt-16">
        <StepIndicator currentStep={1} />
      </div>

      {/* Hero Section with title + inline search */}
      <section>
        <div className="text-center py-8 md:py-10">
          <h1 className="text-3xl md:text-4xl font-medium text-warm-900 tracking-tight">
            객실 예약
          </h1>
        </div>

        <SearchBar variant="inline" />
      </section>

      {/* Results or Empty State */}
      {hasSearched ? (
        <section className="pt-4 pb-8 flex-1">
          <div className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-12">
            <div className="flex items-baseline justify-between mb-6 mt-4">
              <div>
                <h2 className="text-lg md:text-xl font-medium text-warm-900">
                  {searchParams.region ? `${searchParams.region} 지역` : "전체"} 호텔
                </h2>
                <p className="text-warm-400 text-sm mt-1">
                  {searchParams.checkIn && searchParams.checkOut
                    ? `${searchParams.checkIn} ~ ${searchParams.checkOut} · ${searchParams.guests || 2}명`
                    : ""}
                  {" · "}
                  {hotels.length}개 호텔
                </p>
              </div>
            </div>
          </div>
          <BookingSearchClient hotels={hotels} searchParams={searchParams} />
        </section>
      ) : (
        <section className="py-24 md:py-32 text-center flex-1 flex items-center justify-center">
          <p className="text-warm-400 text-base md:text-lg">
            예약을 원하시는 숙소, 날짜, 객실 수를 선택 후 검색 버튼을 눌러주세요
          </p>
        </section>
      )}

      <Footer />
    </main>
  );
}
