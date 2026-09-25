/* SAHNE 2 — AÇIK MI, KAPALI MI? (8–24 s)
   Three lines cross one after another. If the last one misses the first,
   the shape stays open. Turn it until it meets the first: a closed shape, a triangle. */
(function (LI) {
  'use strict';
  const { seg } = LI.E;
  const A = LI.Ang, KD = LI.KD, F = () => LI.Film;
  function camera(t, env) { return LI.Camera.breathe(KD.cam(env, { zoom: 1 }), t, 0.4); }
  function render(ctx, lt, env, t) {
    const { C, L, ls } = F().base(ctx, env, t, camera(t, env));
    // the open path: along line 1, up line 2, back along line 3 — never closing
    const op = seg(t, 11.4, 12.6), fade = 1 - seg(t, 15.6, 16.2);
    if (op > 0 && fade > 0) {
      const [l1, l2, l3] = ls;
      const V12 = F().meet(C, l1, l2), V23 = F().meet(C, l2, l3);
      const e1 = F().ends(C, l1, L.H)[0], e3 = F().ends(C, l3, L.H)[1];
      LI.Ink.path(ctx, [e1, V12, V23, e3], { w: 11, p: op, seed: 8, taper: [0.02, 0.02], alpha: fade });
      A.text(ctx, 'açık', C[0] - L.Rc * 0.95, C[1] - L.Rc * 0.1, { size: 56, color: A.amber, p: seg(t, 12.6, 13.4), alpha: fade, halo: true });
    }
    // the crossing that closes the shape
    const r = seg(t, 17.6, 18.8);
    if (r > 0 && r < 1) { const X = F().meet(C, ls[2], ls[0]); if (X) LI.Ink.ring(ctx, X[0], X[1], 16 + 44 * r, { w: 5, alpha: 1 - r, seed: 9, color: LI.AMBER_RGB }); }
    LI.Name(ctx, env, t, 'üçgen', 20.2, 23.6);
  }
  LI.registerScene({ id: 2, start: 8, end: 24, name: 'Open or closed?', nameTr: 'Açık mı, kapalı mı?', concept: 'The last line must meet the first', conceptTr: 'Son doğru ilk doğruyu kesmeli', render });

  /** the polygon's name, written beside it */
  LI.Name = function (ctx, env, t, s, a, b) {
    const L = KD.L(env), C = L.C;
    const P = env.V ? [C[0], C[1] - L.Rc - 150] : [C[0] + L.Rc + 190, C[1]];
    A.text(ctx, s, P[0], P[1], { size: 72, p: seg(t, a, a + 0.8), alpha: 1 - seg(t, b - 0.4, b) });
  };
})(window.LI = window.LI || {});
