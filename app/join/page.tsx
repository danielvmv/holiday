'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { participants } from '@/lib/participants';

interface CheckinStatus {
  participantId: string;
  name: string;
  checkedIn: boolean;
  timestamp?: number;
}

export default function JoinPage() {
  const [statuses, setStatuses] = useState<CheckinStatus[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fetch current status
  const fetchStatuses = async () => {
    try {
      const res = await fetch('/api/checkin');
      const data = await res.json();
      if (data.statuses) {
        setStatuses(data.statuses);
      }
    } catch (err) {
      console.error('Error fetching statuses:', err);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchStatuses();
  }, []);

  // Poll every 5 seconds for updates
  useEffect(() => {
    const interval = setInterval(fetchStatuses, 5000);
    return () => clearInterval(interval);
  }, []);

  // Check if user already checked in (localStorage)
  useEffect(() => {
    const checkedInId = localStorage.getItem('jolidays_checkin');
    if (checkedInId) {
      setSelectedId(checkedInId);
      setSuccess(true);
    }
  }, []);

  const handleCheckin = async () => {
    if (!selectedId) {
      setError('Por favor selecciona tu nombre');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantId: selectedId }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        localStorage.setItem('jolidays_checkin', selectedId);
        await fetchStatuses(); // Refresh immediately
      } else {
        setError(data.error || 'Error al registrarte');
      }
    } catch (err) {
      setError('Error de conexión. Intenta de nuevo.');
      console.error('Error checking in:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp?: number) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = Date.now();
    const diffMs = now - timestamp;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'ahora mismo';
    if (diffMins < 60) return `hace ${diffMins} min`;
    if (diffHours < 24) return `hace ${diffHours}h`;
    if (diffDays < 7) return `hace ${diffDays}d`;
    return date.toLocaleDateString('es-MX', { month: 'short', day: 'numeric' });
  };

  const checkedInCount = statuses.filter(s => s.checkedIn).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFBF5] via-[#FEF3C7] to-[#FFFBF5]">
      {/* Header */}
      <header className="py-6 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Link href="/">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-[#0891B2] via-[#059669] to-[#DC2626] bg-clip-text text-transparent mb-2 font-[family-name:var(--font-display)] cursor-pointer hover:opacity-80 transition-opacity">
              Jolidays
            </h1>
          </Link>
          <div className="flex items-center justify-center gap-2 text-[#0891B2] text-base">
            <span className="inline-block">🌊</span>
            <span className="font-medium">Ritual de Participación</span>
            <span className="inline-block">🎄</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Important notice */}
        <div className="bg-[#22D3EE]/10 border-2 border-[#0891B2]/30 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <span className="text-2xl">ℹ️</span>
            <div>
              <p className="text-[#1F2937] font-medium mb-2">
                Esto NO revela tu asignación
              </p>
              <p className="text-[#4B5563] text-sm">
                Solo confirma que ya estás listo(a) para el intercambio.
                Te mandaré tu link personal por WhatsApp después de que todos se apunten.
              </p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white/60 backdrop-blur rounded-3xl p-6 md:p-8 shadow-xl border-2 border-[#0891B2]/10 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1F2937] mb-4 text-center font-[family-name:var(--font-display)]">
            Progreso del Grupo
          </h2>
          <div className="text-center mb-6">
            <div className="text-5xl font-bold text-[#0891B2] font-[family-name:var(--font-display)]">
              {checkedInCount} / {participants.length}
            </div>
            <p className="text-[#6B7280] mt-2">
              {checkedInCount === participants.length
                ? '¡Todos listos! 🎉'
                : 'personas confirmadas'}
            </p>
          </div>

          {/* Status list */}
          <div className="space-y-2">
            {statuses.map((status) => (
              <div
                key={status.participantId}
                className={`flex items-center justify-between p-4 rounded-xl ${
                  status.checkedIn
                    ? 'bg-[#059669]/10 border border-[#059669]/20'
                    : 'bg-[#FEF3C7]/30 border border-[#FDE68A]/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {status.checkedIn ? '✅' : '⏳'}
                  </span>
                  <span className="font-medium text-[#1F2937]">
                    {status.name}
                  </span>
                </div>
                {status.checkedIn && status.timestamp && (
                  <span className="text-sm text-[#6B7280]">
                    {formatTimestamp(status.timestamp)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Check-in form */}
        {!success ? (
          <div className="bg-white/60 backdrop-blur rounded-3xl p-6 md:p-8 shadow-xl border-2 border-[#0891B2]/10">
            <h3 className="text-xl md:text-2xl font-bold text-[#1F2937] mb-4 text-center font-[family-name:var(--font-display)]">
              ¡Apúntate Aquí!
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-[#4B5563] font-medium mb-2">
                  Selecciona tu nombre:
                </label>
                <select
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                  className="w-full p-3 rounded-xl border-2 border-[#0891B2]/20 bg-white focus:border-[#0891B2] focus:outline-none font-medium text-[#1F2937]"
                  disabled={loading}
                >
                  <option value="">-- Elige tu nombre --</option>
                  {participants.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <div className="bg-[#DC2626]/10 border border-[#DC2626]/30 rounded-xl p-3 text-[#DC2626] text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleCheckin}
                disabled={!selectedId || loading}
                className="w-full bg-gradient-to-r from-[#0891B2] to-[#059669] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Registrando...' : '✨ Confirmar mi participación'}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-[#059669]/10 to-[#22D3EE]/10 rounded-3xl p-8 border-2 border-[#059669]/30 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-[#1F2937] mb-3 font-[family-name:var(--font-display)]">
              ¡Ya estás registrado(a)!
            </h3>
            <p className="text-[#4B5563] mb-4">
              Te mandaré tu enlace personal por WhatsApp cuando todos se hayan apuntado.
            </p>
            <div className="inline-block bg-gradient-to-r from-[#DC2626] to-[#F59E0B] text-white px-6 py-3 rounded-full shadow-lg">
              <p className="font-semibold text-sm">
                🎄 ¡Nos vemos en la playa! 🌴
              </p>
            </div>
          </div>
        )}

        {/* Back to home */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#0891B2] hover:text-[#059669] font-medium transition-colors"
          >
            <span>←</span>
            <span>Volver a la página principal</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
