import React from 'react';
import { Building2, ShieldCheck, MapPin, Search } from 'lucide-react';

export function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Building2 className="w-7 h-7 text-indigo-600" />
          <span className="text-xl font-bold tracking-tight text-slate-900">OpenBarrio</span>
          <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium">Civic Tech España</span>
        </div>
        <nav className="flex items-center space-x-6 text-sm text-slate-600">
          <a href="#about" className="hover:text-indigo-600 transition">Fuentes Públicas</a>
          <a href="#extension" className="hover:text-indigo-600 transition">Extensión Portales</a>
          <a href="https://github.com/alexagc/openbarrio" target="_blank" rel="noreferrer" className="hover:text-indigo-600 transition font-medium">GitHub</a>
        </nav>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12">
        <section className="text-center space-y-4 max-w-2xl mx-auto">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Auditoría Inmobiliaria y Vecinal con Datos Oficiales
          </h1>
          <p className="text-lg text-slate-600">
            Descubre la realidad de cualquier inmueble en España: cruce oficial de Catastro, renta media por sección censal del INE, mapa de ruido ambiental y riesgo de inundación.
          </p>

          <div className="pt-6 flex items-center max-w-xl mx-auto">
            <div className="relative flex-1">
              <MapPin className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Ej. Calle Gran Vía 1, Madrid o Referencia Catastral..."
                className="w-full pl-11 pr-4 py-3 rounded-l-xl border border-r-0 border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-r-xl flex items-center space-x-2 transition">
              <Search className="w-5 h-5" />
              <span>Auditar</span>
            </button>
          </div>
        </section>

        <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2">
            <Building2 className="w-6 h-6 text-indigo-600" />
            <h3 className="font-bold text-slate-900">Catastro Inmobiliario</h3>
            <p className="text-sm text-slate-600">Año real de construcción, metros cuadrados construidos, número de viviendas y división horizontal.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <h3 className="font-bold text-slate-900">Renta & Demografía INE</h3>
            <p className="text-sm text-slate-600">Renta media por hogar en la sección censal, pirámide demográfica y percentil socioeconómico.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2">
            <MapPin className="w-6 h-6 text-amber-600" />
            <h3 className="font-bold text-slate-900">MITECO: Ruido & Inundaciones</h3>
            <p className="text-sm text-slate-600">Mapas acústicos estratégicos y cartografía oficial de zonas con riesgo de inundación fluvial.</p>
          </div>
        </section>
      </main>

      <footer className="border-t bg-white py-6 text-center text-xs text-slate-500">
        OpenBarrio · Plataforma de código abierto basada en datos abiertos de España · Licencia Apache 2.0
      </footer>
    </div>
  );
}
