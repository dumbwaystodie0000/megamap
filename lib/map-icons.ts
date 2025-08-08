import L from "leaflet";

export function createCustomIcon(
  type: string,
  count?: number,
  isHovered: boolean = false
): L.DivIcon {
  const baseSize = 20;
  const hoverScale = isHovered ? 1.2 : 1;
  const size = baseSize * hoverScale;

  // Simple red dot for all markers
  const html = `
    <div class="relative flex items-center justify-center transition-all duration-200" style="">
      <div class="w-5 h-5 rounded-full border-2 border-white shadow-md relative" style="background-color: #dc2626;">
        ${count ? `<span class="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">${count}</span>` : ''}
      </div>
    </div>
  `;

  return L.divIcon({
    className: "custom-icon",
    html,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
} 