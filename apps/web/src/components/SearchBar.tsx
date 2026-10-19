import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Loader2, Sparkles, Navigation, Copy, Check } from 'lucide-react';
import { isCadastralReference } from '@openbarrio/core';
import { apiClient } from '../services/api.client';

export interface SearchPreset {
  id: string;
  name: string;
  location: string;
  refcat: string;
  lat: number;
  lon: number;
  tag?: string;
  isStressed?: boolean;
}

export const SAMPLE_PRESETS: SearchPreset[] = [
  {
    id: 'madrid-granvia',
    name: 'Edificio Gran Vía 28',
    location: 'Madrid Centro',
    refcat: '0549711VK4704H',
    lat: 40.42023,
    lon: -3.70197,
    tag: 'Renta Alta & Comercial',
  },
  {
    id: 'bcn-gracia',
    name: 'Passeig de Gràcia 43',
    location: 'Barcelona Eixample',
    refcat: '0227802DF3802E',
    lat: 41.39170,
    lon: 2.16495,
    tag: 'Zona Tensionada MIVAU',
    isStressed: true,
  },
  {
    id: 'valencia-colon',
    name: 'Carrer de Colón 15',
    location: 'València Ciutat Vella',
    refcat: '6023512YJ2762C',
    lat: 39.46845,
    lon: -0.37318,
    tag: 'Eje Comercial',
  },
  {
    id: 'sevilla-sierpes',
    name: 'Calle Sierpes 22',
    location: 'Sevilla Casco Antiguo',
    refcat: '4927803TG3442F',
    lat: 37.39147,
    lon: -5.99476,
    tag: 'Centro Histórico',
  },
];

interface SearchBarProps {
  onSearchRefcat: (refcat: string, coords?: { lat: number; lon: number }) => void;
  onSearchCoords: (lat: number, lon: number) => void;
  isLoading?: boolean;
  variant?: 'standard' | 'topbar';
  activeRefcat?: string;
  activeAddress?: string;
}

export function SearchBar({
  onSearchRefcat,
  onSearchCoords,
  isLoading = false,
  variant = 'standard',
  activeRefcat,
  activeAddress,
}: SearchBarProps) {
  const [query, setQuery] = useState(activeAddress ? `${activeAddress} (RC: ${activeRefcat || ''})` : '');
  const [copiedRc, setCopiedRc] = useState(false);
  const [suggestions, setSuggestions] = useState<
    Array<{ label: string; lat: number; lon: number; refcat?: string }>
  >([]);
  const [isSearchingSuggestions, setIsSearchingSuggestions] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync query when activeAddress/refcat updates externally
  useEffect(() => {
    if (activeAddress && activeRefcat) {
      setQuery(`${activeAddress} (RC: ${activeRefcat})`);
    } else if (activeRefcat) {
      setQuery(`Referencia Catastral: ${activeRefcat}`);
    }
  }, [activeAddress, activeRefcat]);

  // Close dropdown on outside click or touch
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Debounced address suggestion search with CartoCiudad & Nominatim
  useEffect(() => {
    const trimmed = query.trim();
    if (
      trimmed.length < 3 ||
      isCadastralReference(trimmed) ||
      /^[-+]?[0-9]*\.?[0-9]+[,\s]+[-+]?[0-9]*\.?[0-9]+$/.test(trimmed) ||
      trimmed.includes('(RC:')
    ) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingSuggestions(true);
      const results = await apiClient.searchAddress(trimmed);
      setSuggestions(results);
      setIsSearchingSuggestions(false);
      setShowDropdown(results.length > 0);
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const raw = query.trim();
    if (!raw) return;

    setShowDropdown(false);

    // If query contains (RC: ...), extract RC
    const rcInParentheses = raw.match(/\(RC:\s*([0-9A-Za-z]{14,20})\)/i);
    if (rcInParentheses) {
      onSearchRefcat(rcInParentheses[1].toUpperCase());
      return;
    }

    // 1. Direct Cadastral reference (14 or 20 alphanumeric characters)
    if (isCadastralReference(raw)) {
      const cleanRefcat = raw.replace(/[\s\-_.]/g, '').toUpperCase();
      onSearchRefcat(cleanRefcat);
      return;
    }

    // 2. Coordinates: lat, lon
    const coordsMatch = raw.match(/^([+-]?\d+(?:\.\d+)?)[,\s]+([+-]?\d+(?:\.\d+)?)$/);
    if (coordsMatch) {
      const lat = parseFloat(coordsMatch[1]);
      const lon = parseFloat(coordsMatch[2]);
      if (!isNaN(lat) && !isNaN(lon)) {
        onSearchCoords(lat, lon);
        return;
      }
    }

    // 3. Fallback: match first suggestion or query geocoder immediately
    if (suggestions.length > 0) {
      const best = suggestions[0];
      const coords = { lat: best.lat, lon: best.lon };
      if (best.refcat) {
        onSearchRefcat(best.refcat, coords);
      } else {
        onSearchCoords(best.lat, best.lon);
      }
    } else {
      setIsSearchingSuggestions(true);
      apiClient.searchAddress(raw).then((results) => {
        setIsSearchingSuggestions(false);
        if (results.length > 0) {
          const best = results[0];
          const coords = { lat: best.lat, lon: best.lon };
          if (best.refcat) {
            onSearchRefcat(best.refcat, coords);
          } else {
            onSearchCoords(best.lat, best.lon);
          }
        } else if (isCadastralReference(raw)) {
          const cleanRefcat = raw.replace(/[\s\-_.]/g, '').toUpperCase();
          onSearchRefcat(cleanRefcat);
        }
      });
    }
  };

  const handleCopyRc = (e: React.MouseEvent) => {
    e.stopPropagation();
    const targetRc = activeRefcat || (query.match(/\b([0-9A-Za-z]{14,20})\b/) || [])[1];
    if (targetRc) {
      navigator.clipboard.writeText(targetRc);
      setCopiedRc(true);
      setTimeout(() => setCopiedRc(false), 2000);
    }
  };

  const selectPreset = (preset: SearchPreset) => {
    setQuery(`${preset.name} (${preset.refcat.substring(0, 14)})`);
    setShowDropdown(false);
    onSearchRefcat(preset.refcat);
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('La geolocalización no está soportada en tu navegador.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setQuery(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
        onSearchCoords(latitude, longitude);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        alert('No se pudo obtener tu ubicación actual. Revisa los permisos.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // TOPBAR COMPACT VARIANT (Stitch Civic Precision)
  if (variant === 'topbar') {
    return (
      <div className="w-full relative" ref={dropdownRef}>
        <form
          onSubmit={handleSubmit}
          className="flex items-center bg-surface-container-low border border-outline-variant rounded px-2.5 py-1.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all w-full"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-primary animate-spin mr-2 shrink-0" />
          ) : (
            <Search className="w-4 h-4 text-outline mr-2 shrink-0" />
          )}

          <span className="bg-surface-variant text-tertiary font-mono text-[10px] uppercase px-1.5 py-0.5 rounded mr-2 tracking-wider shrink-0 font-semibold">
            ES.CAT
          </span>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) setShowDropdown(true);
            }}
            placeholder="Buscar dirección, refcat o coordenadas..."
            className="bg-transparent border-0 p-0 text-on-surface font-mono text-xs w-full focus:outline-none focus:ring-0 truncate placeholder:text-outline"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSuggestions([]);
                setShowDropdown(false);
              }}
              className="text-outline hover:text-on-surface p-0.5 mr-1"
              title="Borrar texto"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {activeRefcat && (
            <button
              type="button"
              onClick={handleCopyRc}
              className="flex items-center gap-1 text-on-surface-variant hover:text-primary px-1.5 py-0.5 rounded hover:bg-surface-container-high transition-colors text-[10px] font-mono shrink-0 ml-1"
              title="Copiar Referencia Catastral"
            >
              {copiedRc ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3" />}
              <span className="hidden sm:inline">RC</span>
            </button>
          )}

          <div className="hidden sm:block h-3.5 w-px bg-outline-variant mx-1.5 shrink-0" />

          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded bg-primary-container/20 border border-primary/30 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-primary text-[10px] font-mono font-semibold tracking-tight">
              Catastro Validado
            </span>
          </div>
        </form>

        {/* Autocomplete Dropdown in Dark GIS theme */}
        {showDropdown && suggestions.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1 bg-surface-container border border-outline-variant rounded shadow-xl overflow-hidden z-50 max-h-60 overflow-y-auto">
            <div className="p-2 border-b border-outline-variant bg-surface-container-high text-[10px] font-mono uppercase text-on-surface-variant flex items-center justify-between">
              <span>Sugerencias CartoCiudad / Catastro</span>
              {isSearchingSuggestions && <Loader2 className="w-3 h-3 animate-spin text-primary" />}
            </div>
            {suggestions.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setQuery(item.label);
                  setShowDropdown(false);
                  const coords = { lat: item.lat, lon: item.lon };
                  if (item.refcat) {
                    onSearchRefcat(item.refcat, coords);
                  } else {
                    onSearchCoords(item.lat, item.lon);
                  }
                }}
                className="w-full text-left px-3 py-2 text-xs font-mono text-on-surface hover:bg-surface-container-high border-b border-outline-variant/40 last:border-0 flex items-center justify-between space-x-2 transition cursor-pointer"
              >
                <div className="flex items-start space-x-2 min-w-0">
                  <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.refcat && (
                  <span className="shrink-0 px-1.5 py-0.5 rounded bg-surface-variant text-tertiary font-mono text-[9px] border border-outline-variant">
                    RC Oficial
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // STANDARD LANDING VARIANT
  return (
    <div className="w-full relative" ref={dropdownRef}>
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            {isLoading ? (
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
            ) : (
              <Search className="w-5 h-5 text-outline" />
            )}
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) setShowDropdown(true);
            }}
            placeholder="Introduce Referencia Catastral (14-20 car.), coordenadas o dirección..."
            className="w-full pl-11 pr-24 py-3 bg-surface-container border border-outline-variant rounded text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary shadow-sm transition"
          />

          <div className="absolute inset-y-0 right-0 pr-2 flex items-center space-x-1">
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setSuggestions([]);
                  setShowDropdown(false);
                }}
                className="p-1.5 text-outline hover:text-on-surface rounded hover:bg-surface-container-high transition"
                title="Limpiar"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={handleCurrentLocation}
              className="p-1.5 text-outline hover:text-primary rounded hover:bg-surface-container-high transition"
              title="Mi ubicación actual"
            >
              <Navigation className="w-4 h-4" />
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="ml-2.5 px-4 sm:px-6 py-3 bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm rounded shadow-sm flex items-center space-x-2 transition cursor-pointer"
        >
          <span>Auditar</span>
        </button>
      </form>

      {/* Autocomplete Suggestions Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-surface-container rounded shadow-xl border border-outline-variant overflow-hidden z-40 max-h-60 overflow-y-auto">
          <div className="p-2 border-b border-outline-variant bg-surface-container-high text-[11px] font-mono uppercase text-on-surface-variant flex items-center justify-between">
            <span>Sugerencias de Dirección</span>
            {isSearchingSuggestions && <Loader2 className="w-3 h-3 animate-spin text-primary" />}
          </div>
          {suggestions.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                setQuery(item.label);
                setShowDropdown(false);
                const coords = { lat: item.lat, lon: item.lon };
                if (item.refcat) {
                  onSearchRefcat(item.refcat, coords);
                } else {
                  onSearchCoords(item.lat, item.lon);
                }
              }}
              className="w-full text-left px-3.5 py-2.5 text-xs text-on-surface hover:bg-surface-container-high border-b border-outline-variant/40 last:border-0 flex items-center justify-between space-x-2 transition cursor-pointer"
            >
              <div className="flex items-start space-x-2 min-w-0">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span className="truncate">{item.label}</span>
              </div>
              {item.refcat && (
                <span className="shrink-0 px-1.5 py-0.5 rounded bg-surface-variant text-tertiary font-mono text-[10px] font-semibold border border-outline-variant">
                  RC Oficial
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Instant Presets Bar */}
      <div className="mt-2.5 flex items-center flex-wrap gap-1.5 text-xs text-on-surface-variant">
        <span className="inline-flex items-center text-[11px] font-mono text-outline mr-1">
          <Sparkles className="w-3.5 h-3.5 mr-1 text-secondary" /> Ejemplos:
        </span>
        {SAMPLE_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => selectPreset(preset)}
            className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high border border-outline-variant text-[11px] font-mono text-on-surface transition flex items-center space-x-1 cursor-pointer"
          >
            <span>{preset.name}</span>
            {preset.isStressed && (
              <span className="w-1.5 h-1.5 rounded-full bg-secondary ml-1" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
