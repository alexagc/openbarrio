import { ArrowLeft, Database, ShieldCheck, ExternalLink, Map as MapIcon } from 'lucide-react';
import { DataTransparencyMatrix } from '../components/landing/DataTransparencyMatrix';
import { Footer } from '../components/landing/Footer';
import { Header } from '../components/landing/Header';
import { useWorkspaceStore } from '../store/workspace.store';

export function TransparencyView() {
  const setViewMode = useWorkspaceStore((s) => s.setViewMode);

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col bg-background text-on-surface">
      <Header onOpenMap={() => setViewMode('map')} />

      <main className="flex-1 flex flex-col items-center py-10 px-space-md sm:px-space-lg lg:px-space-xl">
        <div className="w-full max-w-7xl">
          {/* Breadcrumb / Back button */}
          <div className="mb-6 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setViewMode('landing')}
              className="inline-flex items-center gap-2 text-xs font-mono text-primary hover:text-primary-container px-3 py-1.5 rounded bg-surface-container border border-outline-variant transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a la Portada</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('map')}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-on-surface px-3 py-1.5 rounded bg-surface-container-high border border-outline-variant hover:border-primary transition-colors cursor-pointer"
            >
              <MapIcon className="w-4 h-4 text-primary" />
              <span>Explorar en Visor GIS</span>
            </button>
          </div>

          {/* Page Title & Vision */}
          <div className="mb-8 p-6 rounded-xl bg-surface-container-low border border-outline-variant">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 mb-3 text-primary font-mono text-xs font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Marco Legal de Reutilización del Sector Público (Ley 37/2007)</span>
            </div>
            <h1 className="font-headline text-3xl sm:text-4xl font-bold text-on-surface mb-3">
              Catálogo de Fuentes Oficiales & Soberanía de Datos
            </h1>
            <p className="font-body text-sm sm:text-base text-on-surface-variant max-w-4xl leading-relaxed">
              OpenBarrio no recopila datos privados ni comercia con información vecinal. Todos los indicadores de nuestro motor de due diligence provienen exclusivamente de sedes electrónicas oficiales del Reino de España, geoportales INSPIRE y bases de datos abiertas del sector público ministerial.
            </p>
          </div>

          {/* Matrix Component */}
          <div className="mb-10">
            <DataTransparencyMatrix />
          </div>

          {/* Regulatory & Technical Guarantees Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="p-5 rounded-lg bg-surface-container border border-outline-variant">
              <h3 className="font-headline text-base font-bold text-on-surface mb-2 flex items-center gap-2">
                <Database className="w-4 h-4 text-primary" />
                <span>Directiva INSPIRE 2007/2/CE</span>
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Interoperabilidad de infraestructuras de información espacial en la Unión Europea. Consumo de capas vectoriales de parcelas catastrales y ortofotografía aérea de máxima resolución (PNOA) del IGN.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-surface-container border border-outline-variant">
              <h3 className="font-headline text-base font-bold text-on-surface mb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>Ley 19/2013 de Transparencia</span>
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Acceso público y buen gobierno. Integración directa de microdatos del Atlas de Distribución de Renta de los Hogares (ADRH) del INE para nivel socioeconómico objetivo por sección censal.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-surface-container border border-outline-variant">
              <h3 className="font-headline text-base font-bold text-on-surface mb-2 flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-primary" />
                <span>Iniciativa Aporta (datos.gob.es)</span>
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Alineación con el catálogo nacional de datos abiertos. Los modelos y algoritmos de puntuación de OpenBarrio son 100% auditables, reproducibles y de código abierto (Apache-2.0).
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer onOpenMap={() => setViewMode('map')} />
    </div>
  );
}
