# Arvan panel visual affinity

The challenge app should feel like Arvan’s product panel (`panel.arvancloud.ir`) without cloning its layout. Visual tokens and button chrome follow [Sorkhab](https://sorkhab.arvancloud.ir/) (Arvan’s design system) — especially [Button](https://sorkhab.arvancloud.ir/components/button/) metrics and opaque primary/danger/secondary states — mapped onto Nuxt UI rather than Nuxt’s default green or translucent `/75` hovers. Light and dark shell themes apply to Monaco and the session console; OS appearance is snapshotted into a persisted light/dark theme preference on first visit. An in-app theme toggle is deferred until a proper chrome placement exists (not the snippet list panel).

