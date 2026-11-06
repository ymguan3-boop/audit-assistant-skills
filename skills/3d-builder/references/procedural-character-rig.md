# Procedural Runtime Character Rig

Use this reference when a character or mascot is built in code for a Three.js runtime, or when a stiff low-poly character must be upgraded without Blender. It records what the user approved on 2026-11-06 for 招財 (Zhaocai), a shiba mascot in 幻靈奇旅 / 初光商會: 「這次模型制作的很好」.

Project evidence (Three.js r128, no GLB, no external assets):

- model, face atlas, pose, and move timing: `original-games/幻靈奇旅/js/commerce-gate.js`
- coins, sparks, and the training dummy: `original-games/幻靈奇旅/js/fx/zhaocai-coins.js`
- bird-customer sizing and folded-wing pose: `original-games/初光商會/js/asset-resolver.js`

Treat this as a minimum rigor standard, not a style to copy. Adapt the joints, palette, and moves to the subject.

## What the user rejected first

Each item was a real correction. Check them before showing a character.

| Rejected | Accepted fix |
|---|---|
| Too few joints: head, body, tail only | Match the project's protagonist joint set |
| Boxes and low-segment spheres, visible corners | Curved surfaces only, no box parts on the body |
| Eyes, nose, and mouth stuck out of the face | Paint features onto a shell that hugs the head |
| Fixed face regardless of action | Expression atlas driven by action state |
| Flat badge | Real object: thickness, rim, specular, glint |
| Tail pressed against clothing | Tail exits below the hem, runs backward, then rises |
| Small ear motion | Large, overlapping secondary motion |
| Feet sunk in the ground | Measure the floor, then lift the character |
| Colors washed out, parts blending together | Darker saturated palette with real value contrast |
| Heavy outline on small faces and limbs | Thin colored outline, or none when contrast carries the form |

## Rig

1. Read the protagonist's real animated joint names first. For a GLB, list `animations[].channels[].target.node`. A rig may be rigid node animation with no `skins`.
2. Build a named `Group` per joint with the same names where anatomy allows: `hips > chest > head`, `upperArm > forearm > hand`, `thigh > shin > foot`. Add subject-specific joints: ears and three tail segments.
3. Merge each joint's parts into one vertex-colored mesh. That gives one draw call per joint and keeps the hierarchy animatable. A mascot of about 20 joints is fine when it is only visible near one location.
4. Place the pivot at the anatomical joint, not the part's center. Add an overlapping ball at the joint so bends never open a gap.

## Surfaces

- Use spheres of at least 18×14 segments, `LatheGeometry` for clothes and hats, and tori for trim. Grep the character builder for `BoxGeometry` and treat any body hit as a defect.
- `LatheGeometry` points must run bottom to top. Reversed points give inside-out faces, which look like a hollow halo. Call `computeVertexNormals()` afterward.
- If a merge helper defaults missing scale axes to 1, wrap it so `put(geo,color,x,y,z,s)` means uniform scale. Otherwise a one-value call becomes a two-meter blade.
- Render opaque gold, skin, and cloth as separate value bands. Without an outline, contrast must come from dark red, mid orange, and near-white.

## Face

- Paint eyes, brows, nose, muzzle, blush, and mouth into a canvas atlas. Map it onto a partial sphere 1% larger than the head, with `transparent`, `depthWrite:false`, and `polygonOffset`.
- Use a 4×2 grid of 512px cells: `idle blink happy talk shout star sad wow`. Switch expressions by moving `texture.offset`, so no rebuild is needed.
- Drive the face from state every frame:
  - idle: `idle` with a random blink every 2 to 5 seconds
  - walking: alternate `happy` and `talk`
  - dialogue: alternate `talk` and `happy` quickly
  - windup: `shout`; release: `wow`; recovery: `happy`
  - ultimate: `star`

## Motion

- Use one `pose(joints, time, walkWeight, action)` function. Ease `walkWeight` from 0 to 1 so stand and walk blend without popping.
- Walk with opposite arm and leg, knee and elbow bend only in the anatomical direction, chest counter-twist, and a small hip bob. Never hop the whole body.
- Idle must not be still: breathing, slow head look, tail wag.
- Keep secondary motion large and delayed: tail segments use increasing phase offsets, and ears swing about 0.6 rad while walking and about 1 rad during moves.
- Give each move a table such as `{length:1.15, release:.36}`. Fire effects from the release time, never from a separate timer, so damage matches the animation.
- A throw has windup, whip, follow-through, and recovery, and the chest and support leg must take part. An ultimate has crouch, launch, sustained action, and landing.

## Props and effects

- Hero props need real volume: thick cylinder, torus rim on both sides, Phong or Standard specular, and an occasional additive glint. Canvas text goes on the cap; check its orientation by eye.
- Render swarms with `InstancedMesh`. Simulate gravity, spin, up to three bounces, a short rest, and shrink-out. About 500 coins and 240 sparks cost two draw calls.
- Stagger emission over 1.5 to 2 seconds rather than one frame.
- Keep additive light columns under about 0.15 opacity. Higher values wash out the character at the moment it should read best.
- Every attack needs a target. Build a training dummy with a spring-damped wobble, a brief flash, and a per-target hit cooldown.

## Scene fit

- Raycast the real floor under the character and keep materials with `visible:false` out of the result. Lift to the top surface plus a small margin. Arenas and terrain differ, so never assume y=0.
- Size characters by world ratio against the protagonist, then clamp only what the space cannot hold. A footprint clamp will silently shrink winged or long-tailed models.
- For folding creatures, set the folded pose before measuring bounds, or spread wings will shrink the body. Freeze a walking bird in its walk pose while it waits, because idle may spread the wings.
- Never stack two outline systems. Skip meshes already outlined, and for a silhouette-only look write a stencil mask from the body and draw the hull outside it, with hull `renderOrder` above the body.
- Bump cache tags for every changed script, and check that callers using a new procedural path no longer try to download it. The preview, placement, and preload paths are the usual misses.

## Verification

1. Build a throwaway viewer page with orbit, zoom, and buttons for stand, walk, and each move. Show it to the user before pushing, and do not commit it.
2. Check front, three-quarter, side, and back, plus the peak frame of each move.
3. Open it in a real browser and read the console. Run the game route too.
4. Report what was not seen, such as real phones or continuous animation smoothness.
5. When the user asks for changes, re-capture the changed angle rather than assuming the edit worked.

Art approval comes from the user seeing the model. Passing tests is only `TECHNICAL_PASS`.
