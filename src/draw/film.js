/* ─────────────────────────────────────────────────────────────
   The film's continuous state as pure functions of time.
   A polygon here is never "drawn as a shape": it is whatever region
   the lines close off. Every line i is  X·u(a) = r  around the centre C
   (u = direction a, r = distance from C). The polygon is the part of
   the plane on C's side of every line (half-plane clipping), so when a
   new line slides in, a new side and a new corner appear by themselves.
   ───────────────────────────────────────────────────────────── */
(function (LI) {
  'use strict';
  const { seg, clamp, lerp, inOut, outBack, outCubic, hump } = LI.E;
  const A = LI.Ang, KD = LI.KD, Ink = LI.Ink;

  const layout = (n, i, Rc) => ({ a: 270 + (360 * i) / n, r: Rc * Math.cos(Math.PI / n) });
  // transitions: n → n+1 during [a, b]
  const GROW = [[3, 41.5, 43.5], [4, 46.5, 48.5], [5, 51.5, 53.5]];

  /** all lines at time t: {a, r, p (draw-on), alpha} */
  function lines(t, env) {
    const L = KD.L(env), Rc = L.Rc, r3 = layout(3, 0, Rc).r;
    const faint = lerp(1, 0.32, seg(t, 20.0, 21.2));
    const big = 1 - seg(t, 58.0, 59.0);
    if (t < 41.5) {
      return [
        { a: 270, r: r3, p: seg(t, 3.3, 4.5), alpha: faint * big },
        { a: 390, r: r3, p: seg(t, 8.4, 9.4), alpha: faint * big },
        { a: lerp(450, 510, inOut(seg(t, 16.2, 18.0))), r: r3, p: seg(t, 10.0, 11.0), alpha: faint * big },
      ];
    }
    let n = 3, k = 0;
    for (const [n0, a, b] of GROW) { if (t >= a) { n = n0; k = inOut(seg(t, a, b)); } }
    if (k >= 1) { n += 1; k = 0; }
    const out = [];
    for (let i = 0; i < n; i++) {
      const p0 = layout(n, i, Rc), p1 = layout(n + 1, i, Rc);
      out.push({ a: lerp(p0.a, p1.a, k), r: lerp(p0.r, p1.r, k), p: 1, alpha: 0.32 * big });
    }
    if (k > 0) {
      const tg = layout(n + 1, n, Rc);
      out.push({ a: tg.a, r: lerp(Rc * 2.4, tg.r, k), p: 1, alpha: (0.32 + 0.6 * hump(k, 0, 1)) * seg(k, 0, 0.25) * big, isNew: true });
    }
    return out;
  }

  const rel = (C, X) => [X[0] - C[0], X[1] - C[1]];
  const dot2 = (u, v) => u[0] * v[0] + u[1] * v[1];
  const tangent = (C, ln) => A.at(C, ln.a, ln.r);
  const ends = (C, ln, H) => { const T = tangent(C, ln); return [A.at(T, ln.a + 90, -H), A.at(T, ln.a + 90, H)]; };

  /** intersection of two lines */
  function meet(C, l1, l2) {
    const u = A.dir(l1.a), v = A.dir(l2.a), det = u[0] * v[1] - u[1] * v[0];
    if (Math.abs(det) < 1e-6) return null;
    const x = (l1.r * v[1] - u[1] * l2.r) / det, y = (u[0] * l2.r - l1.r * v[0]) / det;
    return [C[0] + x, C[1] + y];
  }

  /** the closed region on C's side of every line (convex polygon), ordered counter-clockwise from bottom-left */
  function polygon(C, ls) {
    let P = [[-4000, -4000], [4000, -4000], [4000, 4000], [-4000, 4000]].map((q) => [C[0] + q[0], C[1] + q[1]]);
    for (const ln of ls) {
      const u = A.dir(ln.a), inside = (X) => dot2(rel(C, X), u) <= ln.r;
      const Q = [];
      for (let i = 0; i < P.length; i++) {
        const S = P[i], E = P[(i + 1) % P.length], si = inside(S), ei = inside(E);
        if (si) Q.push(S);
        if (si !== ei) {
          const ds = dot2(rel(C, S), u) - ln.r, de = dot2(rel(C, E), u) - ln.r, f = ds / (ds - de);
          Q.push([lerp(S[0], E[0], f), lerp(S[1], E[1], f)]);
        }
      }
      P = Q;
    }
    const cx = P.reduce((s, q) => s + q[0], 0) / P.length, cy = P.reduce((s, q) => s + q[1], 0) / P.length;
    const ang = (q) => ((Math.atan2(-(q[1] - cy), q[0] - cx) * 180) / Math.PI - 200 + 720) % 360;
    P.sort((p, q) => ang(p) - ang(q));
    // merge near-duplicate corners (a line that only touches)
    return P.filter((q, i) => Math.hypot(q[0] - P[(i + 1) % P.length][0], q[1] - P[(i + 1) % P.length][1]) > 2);
  }

  const degOf = (v) => (Math.atan2(-v[1], v[0]) * 180) / Math.PI;
  /** amber arc for the interior angle at corner i */
  function inner(ctx, P, i, r, o = {}) {
    const V = P[i], a = P[(i + P.length - 1) % P.length], b = P[(i + 1) % P.length];
    let d1 = degOf(rel(V, a)), d2 = degOf(rel(V, b));
    let sw = (((d2 - d1) % 360) + 360) % 360;
    if (sw > 180) { [d1, d2] = [d2, d1]; sw = 360 - sw; }
    A.wedge(ctx, V, r, d1, d1 + sw, 0.2 * (o.alpha ?? 1));
    A.arc(ctx, V, r, d1 + 3, d1 + sw - 3, { p: o.p ?? 1, alpha: o.alpha ?? 1, w: 5, seed: 40 + i });
  }
  const centroid = (P) => [P.reduce((s, q) => s + q[0], 0) / P.length, P.reduce((s, q) => s + q[1], 0) / P.length];
  /** a point pushed outwards from the centroid */
  const outward = (P, X, d) => { const G = centroid(P), v = rel(G, X), m = Math.hypot(v[0], v[1]) || 1; return [X[0] + (v[0] / m) * d, X[1] + (v[1] / m) * d]; };

  /** count the sides: each lights up amber with its number, one after another */
  function countSides(ctx, P, t0, step, fade, o = {}) {
    P.forEach((V, i) => {
      const W = P[(i + 1) % P.length], k = seg(o.t, t0 + i * step, t0 + i * step + 0.35) * fade;
      if (k <= 0) return;
      Ink.path(ctx, [V, W], { w: 10, p: k, color: LI.AMBER_RGB, alpha: 0.9 * fade, seed: 50 + i, taper: [0.05, 0.05] });
      const M = outward(P, [(V[0] + W[0]) / 2, (V[1] + W[1]) / 2], o.gap ?? 46);
      A.text(ctx, String(i + 1), M[0], M[1], { size: o.size ?? 50, color: A.amber, alpha: k, halo: true });
    });
  }

  /** a regular polygon's corners (bottom side horizontal) */
  function regular(n, G, Rc) {
    const P = [];
    for (let i = 0; i < n; i++) P.push(A.at(G, 270 + (360 * i) / n + 180 / n - 360 / n, Rc));
    return P;
  }

  /** Nokta, as a function of time */
  function nokta(t, env) {
    const L = KD.L(env), C = L.C;
    const p = { x: L.nx, y: L.gy, s: L.s, mouth: 0.4, brow: 0.1 };
    const g = outCubic(seg(t, 1.3, 2.3));
    p.born = { body: lerp(0.3, 1, g), legs: outCubic(seg(t, 2.0, 2.6)), arms: outCubic(seg(t, 2.3, 2.8)), tuft: outBack(seg(t, 2.5, 2.9)) };
    if (t < 3.0) { p.sq = lerp(0.4, 1, clamp(LI.E.spring(seg(t, 1.3, 3.0) * 2, 8, 3.4), 0, 1.3)); p.drop = 1 - g; p.wobble = 1 - seg(t, 1.3, 2.8); }
    p.eyeOpen = outCubic(seg(t, 2.8, 3.1));
    KD.look(p, C);
    const brush = (a, b) => { if (t > a && t < b) { p.hold = 'brush'; p.brushAng = -0.8 + 0.3 * Math.sin(t * 9); p.hands = { R: [1.35, -0.2 + 0.15 * Math.sin(t * 9)] }; } };
    brush(2.9, 4.8); brush(8.2, 11.2);
    const pointing = (a, b) => { if (t > a && t < b) { p.point = 'R'; p.hands = { L: [-1.2, 0.55], R: [1.5, -0.35] }; } };
    pointing(16.0, 18.2); pointing(41.4, 43.6); pointing(46.4, 48.6); pointing(51.4, 53.6);
    // surprised: the shape is open
    if (t > 12.6 && t < 14.6) { p.mouthOpen = 0.55; p.eyeScale = 1.1; p.brow = -0.4; }
    // no, that is not a polygon (shakes head)
    const no = (a, b) => { if (t > a && t < b) { p.brow = -0.6; p.mouth = -0.3; p.turn = 0.35 * Math.sin((t - a) * 12) * (1 - seg(t, b - 0.5, b)); } };
    no(76.4, 78.0); no(80.6, 82.2);
    const joy = (a, b) => { if (t > a && t < b) { p.squint = 1; p.mouth = 1; p.sq = 1 + 0.1 * hump(t, a, a + 0.6); p.y -= 26 * hump(t, a, a + 0.6); p.hands = { L: [-1.3, -0.35], R: [1.3, -0.35] }; } };
    joy(19.8, 21.4); joy(37.6, 39.2); joy(56.4, 58.0); joy(71.8, 73.4);
    if (t > 85.0) {
      const j = (t - 85.0) % 1.4;
      p.squint = 1; p.mouth = 1; p.turn = 0.15; p.lookX = 0.3; p.lookY = 0;
      p.sq = 1 + 0.1 * Math.sin(Math.PI * clamp(j / 0.6)); p.y -= 40 * Math.sin(Math.PI * clamp(j / 0.6));
      p.hands = { L: [-1.35, -0.6 - 0.2 * Math.sin(t * 6)], R: [1.35, -0.6 + 0.2 * Math.sin(t * 6)] };
      if (t > 89.2) { p.squint = 0; p.lookX = 0; p.lookY = 0.2; p.turn = 0; p.y = L.gy; p.sq = 1; p.hands = { L: [-1.2, 0.55], R: [1.2, -1.0 + 0.25 * Math.sin(t * 10)] }; }
    }
    p.blink = Math.max(hump(t, 5.8, 5.95), hump(t, 23.0, 23.15), hump(t, 31.0, 31.15), hump(t, 45.0, 45.15), hump(t, 63.0, 63.15), hump(t, 83.0, 83.15));
    return p;
  }

  /** common render: ground, the lines, the closed polygon (once closed), Nokta */
  function base(ctx, env, t, cam) {
    const L = KD.L(env), C = L.C;
    LI.Ambient.specks(ctx, env, cam, t, { alpha: 0.22, n: 18, depth: 0.4, seed: 21 });
    LI.Camera.apply(ctx, env, cam);
    KD.ground(ctx, env, L.nx, L.gy);
    const ls = lines(t, env);
    ls.forEach((ln, i) => {
      if (ln.p <= 0 || ln.alpha <= 0.01) return;
      const [P0, P1] = ends(C, ln, L.H);
      Ink.path(ctx, [P0, P1], { w: 6, p: ln.p, seed: 11 + i, taper: [0.1, 0.1], wob: 0.2, dry: 0.4, bleed: 0.4, alpha: ln.alpha });
    });
    // the polygon: bold ink sides + a soft amber inside
    let P = null;
    const closed = seg(t, 18.2, 19.6), big = 1 - seg(t, 58.0, 59.0);
    if (closed > 0 && big > 0) {
      P = polygon(C, ls.filter((l) => l.p >= 1));
      if (P.length >= 3) {
        const fill = seg(t, 19.2, 20.0) * big;
        if (fill > 0) { ctx.fillStyle = `rgba(${LI.AMBER_RGB},${0.13 * fill})`; ctx.beginPath(); P.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath(); ctx.fill(); }
        Ink.path(ctx, P.concat([P[0]]), { w: 11, p: closed, seed: 7, taper: [0.02, 0.02], wob: 0.12, dry: 0.3, bleed: 0.5, alpha: big });
      }
    }
    LI.Nokta.draw(ctx, LI.Nokta.follow((tt) => nokta(tt, env), t), t);
    if (t < 1.35 && t > 0.3) { const f = seg(t, 0.3, 1.3); Ink.dot(ctx, L.nx, lerp(-700, L.gy - 14, f * f), 15, { seed: 2, bleed: 0 }); }
    if (t > 1.3) Ink.drops(ctx, L.nx, L.gy - 4, t - 1.3, { n: 9, seed: 5, ground: L.gy + 4, scale: 0.8, alpha: 1 - seg(t, 4, 8) * 0.6 });
    return { C, L, ls, P };
  }

  LI.Film = { lines, polygon, meet, ends, tangent, inner, outward, centroid, countSides, regular, nokta, base, layout };
})(window.LI = window.LI || {});
