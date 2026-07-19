'use client';

import { useEffect, useState } from 'react';

export default function HomePage() {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const exchangeDate = new Date('2026-12-24T20:00:00-06:00'); // 8 PM MST on Dec 24, 2026
      const now = new Date();
      const difference = exchangeDate.getTime() - now.getTime();

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }

      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFBF5] via-[#FEF3C7] to-[#FFFBF5]">
      {/* Header with Jolidays wordmark */}
      <header className="py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-[#0891B2] via-[#059669] to-[#DC2626] bg-clip-text text-transparent mb-2 font-[family-name:var(--font-display)]">
            Jolidays
          </h1>
          <div className="flex items-center justify-center gap-2 text-[#0891B2] text-lg">
            <span className="inline-block">🌊</span>
            <span className="font-medium">Riviera Nayarit 2026</span>
            <span className="inline-block">🎄</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        {/* Countdown section */}
        <section className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1F2937] mb-4 font-[family-name:var(--font-display)]">
            Cuenta Regresiva al Vallartazo!!
          </h2>
          <p className="text-lg text-[#4B5563] mb-8">
            Nochebuena 2026 • 24 de diciembre, 8:00 PM
          </p>

          {timeLeft && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {[
                { value: timeLeft.days, label: 'Días' },
                { value: timeLeft.hours, label: 'Horas' },
                { value: timeLeft.minutes, label: 'Minutos' },
                { value: timeLeft.seconds, label: 'Segundos' },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg border-2 border-[#22D3EE]/20"
                >
                  <div className="text-5xl md:text-6xl font-bold text-[#0891B2] font-[family-name:var(--font-display)]">
                    {String(item.value).padStart(2, '0')}
                  </div>
                  <div className="text-sm md:text-base text-[#6B7280] mt-2 font-medium">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Trip itinerary */}
        <section className="bg-white/60 backdrop-blur rounded-3xl p-8 md:p-12 shadow-xl border-2 border-[#0891B2]/10">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1F2937] mb-6 text-center font-[family-name:var(--font-display)]">
            Itinerario del Viaje
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-[#374151]">
            <div className="flex items-start gap-4">
              <span className="text-3xl">📅</span>
              <div>
                <h3 className="font-semibold text-lg mb-1">Fechas</h3>
                <p className="text-[#6B7280]">22 - 29 de diciembre, 2026</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-3xl">📍</span>
              <div>
                <h3 className="font-semibold text-lg mb-1">Destino</h3>
                <p className="text-[#6B7280]">Riviera Nayarit, México</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-3xl">🎁</span>
              <div>
                <h3 className="font-semibold text-lg mb-1">Intercambio</h3>
                <p className="text-[#6B7280]">24 de diciembre (Nochebuena)</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-3xl">👨‍👩‍👧‍👦</span>
              <div>
                <h3 className="font-semibold text-lg mb-1">Familia</h3>
                <p className="text-[#6B7280]">9 participantes</p>
              </div>
            </div>
          </div>
        </section>

        {/* Photo gallery */}
        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1F2937] mb-8 text-center font-[family-name:var(--font-display)]">
            Recuerdos Familiares
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="aspect-square bg-gradient-to-br from-[#22D3EE]/20 to-[#059669]/20 rounded-2xl overflow-hidden shadow-md border-2 border-white/50 flex items-center justify-center"
              >
                <div className="text-center text-[#6B7280]">
                  <div className="text-4xl mb-2">📸</div>
                  <div className="text-sm">Foto {i}</div>
                  <div className="text-xs opacity-60 mt-1">Placeholder</div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-[#6B7280] mt-6 text-sm">
            Las fotos familiares se agregarán próximamente
          </p>
        </section>

        {/* Footer note */}
        <section className="text-center py-8">
          <div className="inline-block bg-gradient-to-r from-[#DC2626] to-[#F59E0B] text-white px-6 py-3 rounded-full shadow-lg">
            <p className="font-semibold">
              🎄 ¡Nos vemos en la playa esta Navidad! 🌴
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
