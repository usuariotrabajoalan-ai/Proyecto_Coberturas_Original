self.addEventListener("install", (event) => {
  console.log("Service worker instalado.");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service worker activado.");
});

self.addEventListener("fetch", (event) => {
  // Service worker básico para permitir instalación PWA
});
