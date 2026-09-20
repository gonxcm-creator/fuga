// Landing: drop primero (un pulgar), sin parser en este módulo.
// Wire del archivo lo hace main.ts.
export function landingHtml(): string {
  return `
    <main>
      <div
        class="drop"
        id="drop"
        tabindex="0"
        role="button"
        aria-label="Soltar extracto CSV o Excel del banco"
        aria-describedby="drop-hint"
      >
        <strong>Soltar extracto</strong>
        <span class="muted" id="drop-hint">CSV o Excel del banco · o pulsa para elegir</span>
        <span class="drop-status muted" id="drop-status" aria-live="polite"></span>
        <input id="file" type="file" accept=".csv,.txt,.tsv,.xlsx,.xls" hidden />
      </div>

      <p class="muted" style="margin-top:0">
        <button type="button" class="linkish" id="demo-btn">Probar con CSV de ejemplo</button>
      </p>

      <h1>Ves las fugas de tu banco sin subir el extracto.</h1>
      <ul class="list-plain">
        <li>Recurrentes y comisiones en un vistazo</li>
        <li>Total al mes y al año (el año, en grande)</li>
        <li>Qué cortar primero + texto para WhatsApp</li>
      </ul>

      <h2>Qué NO hacemos</h2>
      <ul class="list-plain muted">
        <li>No conectamos tu banco</li>
        <li>No cancelamos por ti</li>
        <li>No leemos PDFs mágicos</li>
        <li>No hay cuentas ni nube</li>
      </ul>

      <p class="privacy">El extracto no sale de tu PC. Todo ocurre en este navegador.</p>

      <a class="btn btn-secondary" href="#/guia">Cómo exportar</a>
      <a class="btn btn-secondary" href="#/ajustes">Ajustes</a>
    </main>
  `
}
