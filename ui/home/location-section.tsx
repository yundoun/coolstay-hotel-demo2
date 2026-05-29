import { MapPin } from "lucide-react";

interface Props {
  location: {
    address: string;
    infoItems: { label: string; value: string }[];
  };
  hotelName: string;
}

export default function LocationSection({ location, hotelName }: Props) {
  const query = encodeURIComponent(location.address);
  const mapSrc = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${query}&language=ko`;

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
            <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-white/50" />
              </div>
              <div>
                <p className="text-white font-medium text-lg mb-1">{location.address}</p>
              </div>
            </div>

            {/* Info Items */}
            {location.infoItems.length > 0 && (
              <div className="space-y-0">
                {location.infoItems.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-baseline gap-4 py-3 border-b border-white/[0.06] last:border-b-0"
                  >
                    <span className="text-white/40 text-sm shrink-0 w-28">
                      {item.label}
                    </span>
                    <span className="text-white/70 text-sm leading-relaxed">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
