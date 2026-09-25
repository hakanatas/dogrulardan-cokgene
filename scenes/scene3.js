/* SAHNE 3 — ÇOKGENİN ELEMANLARI (24–40 s)  Sides, corners (vertices), inside angles. */
(function (LI) {
  'use strict';
  const { seg } = LI.E;
  const A = LI.Ang, KD = LI.KD;
  function camera(t, env) { return LI.Camera.breathe(LI.Camera.track([[24, KD.cam(env, { zoom: 1 })], [26, KD.cam(env, env.V ? {} : { zoom: 1.08, x: 60, y: -40 })], [40, KD.cam(env, env.V ? {} : { zoom: 1.08, x: 60, y: -40 })]], t), t, 0.4); }
  function render(ctx, lt, env, t) {
    const { P, L, C } = LI.Film.base(ctx, env, t, camera(t, env));
    if (!P) return;
    LI.Film.countSides(ctx, P, 24.8, 0.8, 1 - seg(t, 28.4, 29.0), { t });
    const out = 1 - seg(t, 39.2, 39.8);
    const names = ['A', 'B', 'C'];
    P.forEach((V, i) => {
      const k = seg(t, 29.0 + i * 0.6, 29.4 + i * 0.6) * out;
      if (k <= 0) return;
      LI.Ink.dot(ctx, V[0], V[1], 13 * LI.E.outBack(k), { seed: 60 + i, color: LI.AMBER_RGB, bleed: 0.3 });
      const M = LI.Film.outward(P, V, 50);
      A.text(ctx, names[i] || '', M[0], M[1], { size: 56, alpha: k });
    });
    P.forEach((V, i) => {
      const k = seg(t, 33.2 + i * 0.6, 33.7 + i * 0.6) * out;
      if (k > 0) LI.Film.inner(ctx, P, i, 58, { p: k, alpha: out });
    });
    const s = seg(t, 36.8, 37.8);
    if (s > 0) {
      const Y = C[1] - L.Rc - 150;
      A.text(ctx, '3 kenar · 3 köşe · 3 iç açı', C[0], Y, { size: 60, color: A.amber, p: s, alpha: out, halo: true });
    }
  }
  LI.registerScene({ id: 3, start: 24, end: 40, name: 'Parts of a polygon', nameTr: 'Çokgenin elemanları', concept: 'Sides, corners, inside angles', conceptTr: 'Kenar, köşe, iç açı', render });
})(window.LI = window.LI || {});
