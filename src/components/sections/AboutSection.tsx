import type { HotelConfig } from "@/config/hotel";

interface Props {
  about: HotelConfig["about"];
}

export default function AboutSection({ about }: Props) {
  return (
    <section
      id="about"
      className="relative py-24 md:py-32 lg:py-40 bg-warm-900 text-white overflow-hidden"
    >
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-15"
        style={{ backgroundImage: `url(${about.images[0]})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-warm-900 via-warm-900/95 to-warm-900" />

      <div className="relative max-w-[1400px] mx-auto px-5 md:px-8 lg:px-12">
        {/* Header */}
        <div className="max-w-2xl mb-16 md:mb-20">
          <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
            <div className="w-8 md:w-10 h-px bg-white/30" />
            <p className="text-white/50 text-[10px] md:text-[11px] tracking-[0.35em] uppercase font-medium">
              About
            </p>
          </div>

          <h2 className="text-2xl md:text-3xl lg:text-[2.25rem] font-light leading-snug mb-6 md:mb-8 tracking-tight">
            {about.headline}
          </h2>

          <p className="text-white/50 text-[15px] leading-[1.85]">
            {about.description}
          </p>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {about.images.map((img, i) => (
            <div
              key={i}
              className={`relative overflow-hidden rounded-sm ${
                i === 0 ? "col-span-2 row-span-2 aspect-[4/3]" : "aspect-square"
              }`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${img})` }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
