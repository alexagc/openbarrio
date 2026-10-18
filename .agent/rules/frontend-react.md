# Frontend React Rules

## 1. Principles
* **Framework:** React 19 / 18 with TypeScript and Vite.
* **Styling:** Tailwind CSS with modern, clean components inspired by Shadcn UI.
* **Icons:** Lucide React (`lucide-react`).
* **State & Data Fetching:** React Query / TanStack Query or native typed fetch wrappers.

## 2. Interactive Map (MapLibre GL)
* Use MapLibre GL for rendering maps without proprietary API keys.
* Overlay layers:
  * Cadastral parcel footprint (from Catastro WMS/WFS).
  * Census tract income heatmap (from INE ADRH).
  * Points of interest (health centers, schools).

## 3. Due Diligence Scoring Display
* Visual indicators must use intuitive color grades:
  * Green: High score / low environmental risk / fair rental price.
  * Amber: Moderate caution (e.g., noisy street, older unrenovated building).
  * Red: High risk (flood zone, severe rental price inflation).
