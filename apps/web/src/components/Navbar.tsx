import React, { useState } from 'react';
import { Building2, Database, Github, Info, X, CheckCircle, ExternalLink } from 'lucide-react';

interface NavbarProps {
  isOfflineDemo?: boolean;
}

export function Navbar({ isOfflineDemo }: NavbarProps) {
  const [showSourcesModal, setShowSourcesModal] = useState(false);

  return (
    <>
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur sticky top-0 z-30 px-4 sm:px-6 py-3 flex items-center justify-between no-print shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-100">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-black tracking-tight text-slate-900">OpenBarrio</span>
              <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-100">
                Civic Tech España
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Auditoría inmobiliaria y vecinal con datos oficiales
            </p>
          </div>
        </div>

        <nav className="flex items-center space-x-3 sm:space-x-5 text-xs sm:text-sm font-medium text-slate-600">
          {isOfflineDemo && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
              <span className="w-1.5 h-1.5 mr-1.5 bg-amber-500 rounded-full animate-pulse"></span>
              Modo Demo Offline
            </span>
          )}

          <button
            onClick={() => setShowSourcesModal(true)}
            className="flex items-center space-x-1.5 hover:text-indigo-600 transition text-slate-600 px-2.5 py-1.5 rounded-lg hover:bg-slate-50"
            title="Ver fuentes oficiales del Estado"
          >
            <Database className="w-4 h-4 text-indigo-500" />
            <span className="hidden sm:inline">Fuentes Oficiales</span>
          </button>

          <a
            href="https://github.com/alexagc/openbarrio"
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-1.5 hover:text-indigo-600 transition text-slate-600 px-2.5 py-1.5 rounded-lg hover:bg-slate-50"
          >
            <Github className="w-4 h-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </nav>
      </header>

      {/* Sources Modal */}
      {showSourcesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setShowSourcesModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Info className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Fuentes Oficiales Abiertas</h3>
                <p className="text-xs text-slate-500">Administración Pública del Reino de España</p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs text-slate-600 my-4 max-h-[60vh] overflow-y-auto pr-1">
              <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between font-semibold text-slate-800 text-sm mb-1">
                  <span>Sede Electrónica del Catastro (Ministerio de Hacienda)</span>
                  <a
                    href="https://www.sedecatastro.gob.es/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 hover:underline flex items-center text-xs"
                  >
                    OVC WFS/WMS <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
                <p>
                  Año de edificación, superficie construida, uso principal, división horizontal y cartografía parcelaria vectorial.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between font-semibold text-slate-800 text-sm mb-1">
                  <span>INE - Atlas de Distribución de Renta de los Hogares (ADRH)</span>
                  <a
                    href="https://www.ine.es/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 hover:underline flex items-center text-xs"
                  >
                    INE.es <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
                <p>
                  Renta media neta anual por hogar y por persona por sección censal (~36.000 secciones), percentiles municipales y estructura demográfica.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between font-semibold text-slate-800 text-sm mb-1">
                  <span>MITECO - Sistema de Información de Contaminación Acústica (SICA)</span>
                  <a
                    href="https://sicaweb.miteco.gob.es/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 hover:underline flex items-center text-xs"
                  >
                    SICA Web <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
                <p>
                  Mapas estratégicos de ruido ambiental (Lden dB) por tráfico rodado, ferroviario, aeroportuario e industrial.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between font-semibold text-slate-800 text-sm mb-1">
                  <span>MITECO - Sistema Nacional de Cartografía de Zonas Inundables (SNCZI)</span>
                  <a
                    href="https://sig.mapama.gob.es/snczi/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 hover:underline flex items-center text-xs"
                  >
                    SNCZI <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
                <p>
                  Delimitación cartográfica de zonas inundables con periodos de retorno T=10, 50, 100 y 500 años y Zona de Flujo Preferente (ZFP).
                </p>
              </div>

              <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between font-semibold text-slate-800 text-sm mb-1">
                  <span>MIVAU - Sistema Estatal de Referencia del Precio del Alquiler (SERPAVI)</span>
                  <a
                    href="https://serpavi.mivau.gob.es/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 hover:underline flex items-center text-xs"
                  >
                    SERPAVI <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
                <p>
                  Índice de referencia de precios de alquiler e identificación de Zonas de Mercado Residencial Tensionado (Ley 12/2023).
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center text-emerald-600 font-medium">
                <CheckCircle className="w-4 h-4 mr-1" /> 100% Datos Oficiales Verificables
              </span>
              <button
                onClick={() => setShowSourcesModal(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
