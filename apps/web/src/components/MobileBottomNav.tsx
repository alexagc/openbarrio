import React from 'react';
import { Map, FileText, Layers, Search } from 'lucide-react';

export type MobileNavDestination = 'map' | 'report' | 'layers' | 'search';

export interface MobileBottomNavProps {
  activeDestination: MobileNavDestination;
  onSelectDestination: (dest: MobileNavDestination) => void;
  layersCount?: number;
  className?: string;
}

interface DestinationItem {
  id: MobileNavDestination;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const DESTINATIONS: DestinationItem[] = [
  { id: 'map', label: 'Mapa', icon: Map },
  { id: 'report', label: 'Informe', icon: FileText },
  { id: 'layers', label: 'Capas', icon: Layers },
  { id: 'search', label: 'Buscar', icon: Search },
];

/**
 * Mobile Bottom Navigation Bar for OpenBarrio (Stitch Civic Precision v0.6.3)
 * Adheres strictly to the Stitch Shell Border Ban (prohibits border-t, uses tonal elevation).
 */
export function MobileBottomNav({
  activeDestination,
  onSelectDestination,
  layersCount,
  className = '',
}: MobileBottomNavProps) {
  return (
    <nav
      role="navigation"
      aria-label="Navegación móvil inferior"
      className={`fixed bottom-0 left-0 right-0 z-40 md:hidden bg-surface-container-lowest shadow-lg pb-[env(safe-area-inset-bottom,0.5rem)] pt-1.5 px-3 select-none no-print ${className}`}
    >
      <div className="flex items-center justify-around h-12 max-w-lg mx-auto">
        {DESTINATIONS.map(({ id, label, icon: Icon }) => {
          const isActive = activeDestination === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelectDestination(id)}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-2 rounded-lg min-h-[44px] min-w-[44px] transition-all duration-150 active:scale-95 cursor-pointer relative ${
                isActive
                  ? 'text-primary font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  className={`w-5 h-5 transition-transform duration-150 ${
                    isActive ? 'scale-110 text-primary' : 'opacity-80'
                  }`}
                />
                {id === 'layers' && typeof layersCount === 'number' && layersCount > 0 && (
                  <span
                    data-testid="layers-count-badge"
                    className="absolute -top-1 -right-2 min-w-[14px] h-[14px] px-1 bg-primary text-on-primary font-mono text-[9px] font-bold rounded-full flex items-center justify-center leading-none shadow-xs"
                  >
                    {layersCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 leading-none">
                {label}
              </span>
              {isActive ? (
                <span
                  data-testid="active-indicator"
                  className="w-1 h-1 rounded-full bg-primary mt-0.5 shadow-sm shadow-primary/50"
                />
              ) : (
                <span className="w-1 h-1 mt-0.5 invisible" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default MobileBottomNav;
