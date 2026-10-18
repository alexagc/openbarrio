/**
 * OpenBarrio Content Script for Idealista and Fotocasa.
 * Injects official cadastral & neighborhood due diligence data.
 */

function initOpenBarrioWidget() {
  if (document.getElementById('openbarrio-root')) {
    return;
  }

  const container = document.createElement('div');
  container.id = 'openbarrio-root';
  container.style.position = 'fixed';
  container.style.bottom = '24px';
  container.style.right = '24px';
  container.style.zIndex = '999999';
  container.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.2)';
  container.style.borderRadius = '16px';
  container.style.backgroundColor = '#ffffff';
  container.style.border = '1px solid #e2e8f0';
  container.style.padding = '16px 20px';
  container.style.fontFamily = 'system-ui, -apple-system, sans-serif';
  container.style.maxWidth = '320px';

  container.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
      <span style="font-weight: 700; font-size: 14px; color: #0f172a;">OpenBarrio · Auditoría</span>
      <span style="font-size: 11px; background: #e0e7ff; color: #4338ca; padding: 2px 6px; border-radius: 9999px; font-weight: 600;">Público</span>
    </div>
    <p style="font-size: 12px; color: #64748b; margin: 0 0 12px 0;">
      Extrayendo datos de Catastro e INE para este inmueble...
    </p>
    <a href="http://localhost:3000" target="_blank" style="display: block; text-align: center; background: #4f46e5; color: #ffffff; text-decoration: none; font-size: 12px; font-weight: 600; padding: 8px 12px; border-radius: 8px;">
      Ver informe completo en OpenBarrio &rarr;
    </a>
  `;

  document.body.appendChild(container);
}

// Initialize when ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initOpenBarrioWidget);
} else {
  initOpenBarrioWidget();
}
