/* SAHNE 5 — ADINI KENAR SAYISI VERİR (58–74 s)
   Triangle, quadrilateral, pentagon, hexagon side by side, with their names.
   Sides = corners = inside angles. */
(function (LI) {
  'use strict';
  const { seg, outBack } = LI.E;
  const A = LI.Ang, KD = LI.KD, Ink = LI.Ink;
  const SET = [[3, 'üçgen'], [4, 'dörtgen'], [5, 'beşgen'], [6, 'altıgen']];
  function spots(env) {
    return env.V ? [[-200, -660], [240, -660], [-200, -230], [240, -230]] : [[-330, -70], [-30, -70], [270, -70], [570, -70]];
  }
  /** the four polygons; o.t0 = when they start drawing, o.alpha, o.angles (0..1) */
  LI.Small = function (ctx, env, t, o) {
    const S = spots(env), R = env.V ? 115 : 108;
    SET.forEach(([n, name], i) => {
      const G = S[i], P = LI.Film.regular(n, [G[0], G[1] + (n === 3 ? 18 : 0)], R);
      const k = seg(t, o.t0 + i * 0.9, o.t0 + i * 0.9 + 0.8), a = o.alpha;
      if (k <= 0 || a <= 0) return;
      if (k >= 1) { ctx.fillStyle = `rgba(${LI.AMBER_RGB},${0.12 * a})`; ctx.beginPath(); P.forEach((q, j) => (j ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath(); ctx.fill(); }
      Ink.path(ctx, P.concat([P[0]]), { w: 9, p: k, seed: 90 + i, taper: [0.02, 0.02], alpha: a });
      const ang = (o.angles ?? 0) * a;
      if (ang > 0) P.forEach((V, j) => { LI.Film.inner(ctx, P, j, 24, { alpha: ang }); Ink.dot(ctx, V[0], V[1], 7 * ang, { seed: 70 + j, color: LI.AMBER_RGB, bleed: 0 }); });
      A.text(ctx, name, G[0], G[1] + R + 58, { size: 50, p: seg(t, o.t0 + i * 0.9 + 0.5, o.t0 + i * 0.9 + 1.1), alpha: a });
      A.text(ctx, `${n} kenar`, G[0], G[1] + R + 108, { size: 40, color: A.amber, p: seg(t, o.t0 + i * 0.9 + 0.8, o.t0 + i * 0.9 + 1.4), alpha: a });
    });
  };
  function camera(t, env) { return LI.Camera.breathe(KD.cam(env, { zoom: 1 }), t, 0.4); }
  function render(ctx, lt, env, t) {
    LI.Film.base(ctx, env, t, camera(t, env));
    LI.Small(ctx, env, t, { t0: 59.2, alpha: 1 - seg(t, 73.4, 74.0), angles: seg(t, 66.4, 67.4) });
  }
  LI.registerScene({ id: 5, start: 58, end: 74, name: 'Named by sides', nameTr: 'Adını kenar sayısı verir', concept: 'Triangle, quadrilateral, pentagon, hexagon', conceptTr: 'Üçgen, dörtgen, beşgen, altıgen', render });
})(window.LI = window.LI || {});
