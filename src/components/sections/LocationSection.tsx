import { MapPin, Car, Bus, Clock } from "lucide-react";

const METHOD_ICONS: Record<string, React.FC<{ className?: string }>> = {
  "자가용": Car,
  "대중교통": Bus,
  "셔틀버스": Clock,
};

interface Props {
  location: {
    address: string;
    addressDetail?: string;
    lat: number;
    lng: number;
    directions: { method: string; description: string }[];
  };
  hotelName: string;
}

export default function LocationSection({ location, hotelName }: Props) {
  const mapSrc = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d${location.lng}!3d${location.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z!5e0!3m2!1sko!2skr!4v1700000000000!5m2!1sko!2skr`;

  return (
    <section
      id="location"
      className="relative py-24 md:py-32 lg:py-40 bg-warm-900 text-white overflow-hidden"
    >
      <div className="relative max-w-[1400px] mx-auto px-5 md:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
            <div className="w-8 md:w-10 h-px bg-white/30" />
            <p className="text-white/50 text-[10px] md:text-[11px] tracking-[0.35em] uppercase font-medium">
              Location
            </p>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-[2.25rem] font-light leading-snug tracking-tight">
            찾아오시는 길
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Map */}
          <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[420px] rounded-sm overflow-hidden">
            <iframe
              src={mapSrc}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`${hotelName} 위치`}
              className="absolute inset-0 w-full h-full"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            {/* Address */}
            <div className="flex items-start gap-4 mb-10">
              <div className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="w-5 h-5 text-white/50" />
              </div>
              <div>
                <p className="text-white font-medium text-lg mb-1">{location.address}</p>
                {location.addressDetail && (
                  <p className="text-white/40 text-sm">{location.addressDetail}</p>
                )}
              </div>
            </div>

            {/* Directions */}
            <div className="space-y-6">
              <p className="text-white/50 text-[10px] tracking-[0.25em] uppercase font-medium">
                교통 안내
              </p>
              {location.directions.map((dir, i) => {
                const IconComp = METHOD_ICONS[dir.method] || Car;
                return (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-4 rounded-sm bg-white/[0.03] border border-white/[0.06]"
                  >
                    <IconComp className="w-5 h-5 text-white/50 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white font-medium text-sm mb-1">{dir.method}</p>
                      <p className="text-white/40 text-sm leading-relaxed">{dir.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
