import { Metadata } from 'next';
import assignments from '@/data/assignments.json';
import Link from 'next/link';

interface Assignment {
  giver: {
    id: string;
    name: string;
  };
  receiver: {
    id: string;
    name: string;
  };
  slug: string;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate static params for all assignments
export async function generateStaticParams() {
  return assignments.map((assignment: Assignment) => ({
    slug: assignment.slug,
  }));
}

// Generate metadata for each page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const assignment = assignments.find((a: Assignment) => a.slug === slug);

  if (!assignment) {
    return {
      title: 'Jolidays - Enlace no encontrado',
    };
  }

  return {
    title: `Jolidays - ${assignment.giver.name}`,
    description: 'Tu asignación del intercambio de regalos',
  };
}

export default async function RevealPage({ params }: PageProps) {
  const { slug } = await params;

  // Find ONLY this specific assignment - don't expose others
  const assignment = assignments.find((a: Assignment) => a.slug === slug);

  if (!assignment) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FFFBF5] via-[#FEF3C7] to-[#FFFBF5] flex items-center justify-center p-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-6xl mb-4">🎁❌</div>
          <h1 className="text-4xl font-bold text-[#1F2937] mb-4 font-[family-name:var(--font-display)]">
            Enlace no encontrado
          </h1>
          <p className="text-lg text-[#6B7280] mb-8">
            Este enlace no es válido. Verifica que hayas copiado la URL completa.
          </p>
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-[#0891B2] to-[#059669] text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-shadow"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

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
            <span className="font-medium">Riviera Nayarit 2026</span>
            <span className="inline-block">🎄</span>
          </div>
        </div>
      </header>

      {/* Reveal content */}
      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white/80 backdrop-blur rounded-3xl p-8 md:p-12 shadow-2xl border-2 border-[#0891B2]/20">
          {/* Greeting */}
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">🎁</div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1F2937] mb-3 font-[family-name:var(--font-display)]">
              ¡Hola, {assignment.giver.name.split(' ')[0]}!
            </h2>
            <p className="text-lg text-[#6B7280]">
              Aquí está tu asignación para el intercambio de regalos
            </p>
          </div>

          {/* Reveal box */}
          <div className="bg-gradient-to-br from-[#22D3EE]/10 to-[#059669]/10 rounded-2xl p-8 md:p-10 border-2 border-[#0891B2]/30 mb-8">
            <p className="text-center text-lg text-[#6B7280] mb-4">
              Le darás un regalo a:
            </p>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-[#0891B2] mb-2 font-[family-name:var(--font-display)]">
                {assignment.receiver.name}
              </div>
              <div className="flex items-center justify-center gap-2 text-2xl mt-4">
                <span>🎄</span>
                <span>🎁</span>
                <span>🌴</span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-[#FEF3C7]/50 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-lg text-[#1F2937] mb-3 flex items-center gap-2">
              <span>💡</span>
              <span>Recordatorios:</span>
            </h3>
            <ul className="space-y-2 text-[#4B5563]">
              <li className="flex items-start gap-2">
                <span className="text-[#F59E0B] mt-1">•</span>
                <span>El intercambio será el <strong>24 de diciembre</strong> durante nuestro viaje a la Riviera Nayarit</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#F59E0B] mt-1">•</span>
                <span>Elige un regalo especial que creas que le gustará a tu persona asignada</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#F59E0B] mt-1">•</span>
                <span>¡Mantén el secreto! No reveles a quién le toca hasta el intercambio</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#F59E0B] mt-1">•</span>
                <span>Puedes traer el regalo empacado o comprarlo en la zona (lo que prefieras)</span>
              </li>
            </ul>
          </div>

          {/* Footer message */}
          <div className="text-center">
            <div className="inline-block bg-gradient-to-r from-[#DC2626] to-[#F59E0B] text-white px-6 py-3 rounded-full shadow-lg mb-4">
              <p className="font-semibold text-sm md:text-base">
                🎄 ¡Felices fiestas! 🌴
              </p>
            </div>
            <p className="text-sm text-[#6B7280] mt-4">
              Este enlace es privado. No lo compartas con nadie más.
            </p>
          </div>
        </div>

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
