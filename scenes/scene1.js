/* SAHNE 1 — BİR DOĞRU (0–8 s)  Nokta is born from a drop of ink and draws the first line. */
(function (LI) {
  'use strict';
  const KD = LI.KD;
  function camera(t, env) {
    const L = KD.L(env);
    return LI.Camera.breathe(LI.Camera.track([
      [0, KD.cam(env, { x: L.nx, y: env.V ? 380 : 140, zoom: 1.6 })],
      [3.0, KD.cam(env, { x: L.nx, y: env.V ? 380 : 140, zoom: 1.6 })],
      [4.8, KD.cam(env, { zoom: 1 })],
    ], t), t, 0.5);
  }
  function render(ctx, lt, env, t) { LI.Film.base(ctx, env, t, camera(t, env)); }
  LI.registerScene({ id: 1, start: 0, end: 8, name: 'One line', nameTr: 'Bir doğru', concept: 'Building a shape from lines', conceptTr: 'Doğrularla şekil kurmak', render });
})(window.LI = window.LI || {});
