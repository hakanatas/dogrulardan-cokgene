/* SAHNE 6 — ÇOKGEN DEĞİL (74–84 s)  An open shape, and a shape with a curved side. */
(function (LI) {
  'use strict';
  const { seg } = LI.E;
  const A = LI.Ang, KD = LI.KD, Ink = LI.Ink;
  const cross = (ctx, X, k, a) => {
    Ink.path(ctx, [[X[0] - 34, X[1] - 34], [X[0] + 34, X[1] + 34]], { w: 9, p: seg(k, 0, 0.5), color: LI.AMBER_RGB, alpha: a, seed: 31 });
    Ink.path(ctx, [[X[0] + 34, X[1] - 34], [X[0] - 34, X[1] + 34]], { w: 9, p: seg(k, 0.5, 1), color: LI.AMBER_RGB, alpha: a, seed: 32 });
  };
  function camera(t, env) { return LI.Camera.breathe(KD.cam(env, { zoom: 1 }), t, 0.4); }
  function render(ctx, lt, env, t) {
    LI.Film.base(ctx, env, t, camera(t, env));
    const a = 1 - seg(t, 83.6, 84.2);
    const G1 = env.V ? [40, -600] : [-140, -60], G2 = env.V ? [40, -130] : [360, -60];
    // 1) open: three sides that do not close
    const o1 = [[-120, 90], [120, 90], [150, -80], [-30, -125]].map((q) => [G1[0] + q[0], G1[1] + q[1]]);
    Ink.path(ctx, o1, { w: 10, p: seg(t, 74.3, 75.3), seed: 33, taper: [0.02, 0.02], alpha: a });
    if (t > 75.3) { Ink.dot(ctx, ...o1[0], 8, { seed: 34, alpha: a }); Ink.dot(ctx, ...o1[3], 8, { seed: 35, alpha: a }); }
    cross(ctx, [G1[0] + 170, G1[1] - 150], seg(t, 76.2, 76.8), a);
    A.text(ctx, 'kapalı değil', G1[0], G1[1] + 170, { size: 50, p: seg(t, 76.4, 77.2), alpha: a });
    // 2) a curved side
    const o2 = [[-130, 80], [130, 80]];
    for (let i = 0; i <= 30; i++) { const q = A.at([0, 80], (180 * i) / 30, 130); o2.push(q); }
    const P2 = o2.map((q) => [G2[0] + q[0], G2[1] + q[1]]);
    Ink.path(ctx, P2, { w: 10, p: seg(t, 78.6, 79.8), seed: 36, taper: [0.02, 0.02], alpha: a });
    cross(ctx, [G2[0] + 170, G2[1] - 150], seg(t, 80.4, 81.0), a);
    A.text(ctx, 'kenarı eğri', G2[0], G2[1] + 170, { size: 50, p: seg(t, 80.6, 81.4), alpha: a });
  }
  LI.registerScene({ id: 6, start: 74, end: 84, name: 'Not a polygon', nameTr: 'Çokgen değil', concept: 'Open · curved side', conceptTr: 'Açık · eğri kenar', render });
})(window.LI = window.LI || {});
