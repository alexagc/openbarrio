import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Loader2, Sparkles, Navigation } from 'lucide-react';
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
    refcat: '9872023VH5797S0001WX',
    lat: 40.42028,
    lon: -3.70379,
    tag: 'Renta Alta & Comercial',
  },
  {
    id: 'bcn-gracia',
    name: 'Passeig de Gràcia 43',
    location: 'Barcelona Eixample',
    refcat: '08019A002000050000AB',
    lat: 41.39167,
    lon: 2.16472,
    tag: 'Zona Tensionada MIVAU',
    isStressed: true,
  },
  {
    id: 'valencia-colon',
    name: 'Carrer de Colón 15',
    location: 'València Ciutat Vella',
    refcat: '4625001VK4722E0001AZ',
    lat: 39.4699,
    lon: -0.3735,
    tag: 'Eje Comercial',
  },
  {
    id: 'sevilla-sierpes',
    name: 'Calle Sierpes 22',
    location: 'Sevilla Casco Antiguo',
    refcat: '4190001TG3449S0001AB',
    lat: 37.3908,
    lon: -5.9942,
    tag: 'Centro Histórico',
  },
];

interface SearchBarProps {
  onSearchRefcat: (refcat: string) => void;
  onSearchCoords: (lat: number, lon: number) => void;
  isLoading?: boolean;
}

export function SearchBar({ onSearchRefcat, onSearchCoords, isLoading = false }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Array<{ label: string; lat: number; lon: number }>>([]);
  const [isSearchingSuggestions, setIsSearchingSuggestions] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced address suggestion search
  useEffect(() => {
    const trimmed = query.trim();
    // Do not search if it looks like coordinates or RC
    if (
      trimmed.length < 4 ||
      /^[0-9A-Za-z]{14,20}$/.test(trimmed) ||
      /^[-+]?[0-9]*\.?[0-9]+[,\s]+[-+]?[0-9]*\.?[0-9]+$/.test(trimmed)
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
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const raw = query.trim();
    if (!raw) return;

    setShowDropdown(false);

    // 1. Cadastral reference (14-20 alphanumeric)
    const refcatMatch = raw.match(/^[0-9A-Za-z]{14,20}$/);
    if (refcatMatch) {
      onSearchRefcat(raw.toUpperCase());
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
      onSearchCoords(suggestions[0].lat, suggestions[0].lon);
    } else {
      setIsSearchingSuggestions(true);
      apiClient.searchAddress(raw).then((results) => {
        setIsSearchingSuggestions(false);
        if (results.length > 0) {
          onSearchCoords(results[0].lat, results[0].lon);
        } else {
          // If no geocoder match, try as refcat
          onSearchRefcat(raw);
        }
      });
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

  return (
    <div className="w-full relative" ref={dropdownRef}>
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            {isLoading ? (
              <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
            ) : (
              <Search className="w-5 h-5 text-slate-400" />
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
            className="w-full pl-11 pr-24 py-3 bg-white border border-slate-300 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition"
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
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
                title="Limpiar"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={handleCurrentLocation}
              className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition"
              title="Mi ubicación actual"
            >
              <Navigation className="w-4 h-4" />
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="ml-2.5 px-4 sm:px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-100 flex items-center space-x-2 transition"
        >
          <span>Auditar</span>
        </button>
      </form>

      {/* Autocomplete Suggestions Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-40 max-h-60 overflow-y-auto">
          <div className="p-2 border-b border-slate-100 bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Sugerencias de Dirección</span>
            {isSearchingSuggestions && <Loader2 className="w-3 h-3 animate-spin text-indigo-500" />}
          </div>
          {suggestions.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setQuery(item.label);
                setShowDropdown(false);
                onSearchCoords(item.lat, item.lon);
              }}
              className="w-full text-left px-3.5 py-2.5 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 border-b border-slate-50 last:border-0 flex items-start space-x-2 transition"
            >
              <MapPin className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
              <span className="line-clamp-2">{item.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Instant Presets Bar */}
      <div className="mt-2.5 flex items-center flex-wrap gap-1.5 text-xs text-slate-500">
        <span className="inline-flex items-center text-[11px] font-semibold text-slate-400 mr-1">
          <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-500" /> Ejemplos:
        </span>
        {SAMPLE_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => selectPreset(preset)}
            className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition flex items-center space-x-1 ${
              preset.isStressed
                ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
            }`}
          >
            <span>{preset.name}</span>
            {preset.isStressed && (
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 ml-1"></span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
