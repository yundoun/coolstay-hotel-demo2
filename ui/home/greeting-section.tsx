import Image from "next/image";

interface Props {
  greeting: {
    ownerName: string;
    title: string;
    message: string;
    signature: string;
    image?: string;
  };
}

export default function GreetingSection({ greeting }: Props) {
  return (
    <section
      id="greeting"
      className="relative py-24 md:py-32 lg:py-40 overflow-hidden"
    >
      <div className="absolute inset-0 bg-white" />

      <div className="relative max-w-[1400px] mx-auto px-5 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Text */}
          <div>
            <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
              <div className="w-8 md:w-10 h-px bg-warm-400" />
              <p className="text-warm-500 text-[10px] md:text-[11px] tracking-[0.35em] uppercase font-medium">
                Greeting
              </p>
            </div>

            <h2 className="text-2xl md:text-3xl lg:text-[2.25rem] text-warm-900 font-light leading-snug mb-8 md:mb-10 whitespace-pre-line tracking-tight">
              {greeting.title}
            </h2>

            <div className="space-y-4 mb-10 md:mb-12">
              {greeting.message.split("\n\n").map((paragraph, i) => (
                <p key={i} className="text-warm-500 text-[15px] leading-[1.85] whitespace-pre-line">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="pt-8 border-t border-warm-200/60">
              <p className="text-warm-600 text-sm font-medium">
                {greeting.signature}
              </p>
            </div>
          </div>

          {/* Image */}
          {greeting.image && (
            <div className="relative">
              <div className="relative aspect-[4/5] rounded-sm overflow-hidden">
                <Image
                  src={greeting.image!}
                  alt={greeting.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-warm-900/10 to-transparent" />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
