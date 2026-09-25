/* SAHNE 4 — BİR DOĞRU DAHA (40–58 s)
   Each new line slides in, cuts off a corner, and the polygon gets one more side:
   triangle → quadrilateral → pentagon → hexagon. */
(function (LI) {
  'use strict';
  const { seg } = LI.E;
  const KD = LI.KD;
  const STAGES = [['dörtgen', 44.0, 46.4], ['beşgen', 49.0, 51.4], ['altıgen', 54.0, 57.8]];
  function camera(t, env) { return LI.Camera.breathe(LI.Camera.track([[40, KD.cam(env, env.V ? {} : { zoom: 1.08, x: 60, y: -40 })], [42, KD.cam(env, { zoom: 1 })], [58, KD.cam(env, { zoom: 1 })]], t), t, 0.4); }
  function render(ctx, lt, env, t) {
    const { P } = LI.Film.base(ctx, env, t, camera(t, env));
    if (!P) return;
    STAGES.forEach(([name, a, b]) => {
      if (t < a - 0.2 || t > b + 0.2) return;
      LI.Film.countSides(ctx, P, a, 0.4, 1 - seg(t, b - 0.4, b), { t, size: 46 });
      LI.Name(ctx, env, t, name, a + 0.3, b);
    });
  }
  LI.registerScene({ id: 4, start: 40, end: 58, name: 'One more line', nameTr: 'Bir doğru daha', concept: '4, 5, 6 lines → 4, 5, 6 sides', conceptTr: '4, 5, 6 doğru → 4, 5, 6 kenar', render });
})(window.LI = window.LI || {});
