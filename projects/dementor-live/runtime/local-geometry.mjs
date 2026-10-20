// Dementor Live local-scene geometry v1.
// One authoritative set of world-coordinate footprints for plot/expedition/interior.
// Renderers may style these surfaces, but must never invent separate physical positions.
export const LOCAL_SIZE = 16;
export const LOCAL_PLAYER_RADIUS = .3;
const rect = (id, kind, x, y, w, h, height = 0, solid = true) =>
  ({id, kind, x, y, w, h, height, solid});

export function localFootprints(scene, home, now = 0) {
  if (!home) return [];
  if (scene === 'interior') return [
    rect('room-wall-north', 'room-wall', 0, 0, 16, .36, 1.6),
    rect('room-wall-west', 'room-wall', 0, .36, .36, 15.64, 1.6),
    rect('chest', 'chest', 3, 4.8, 1.6, 1.3, .85),
    rect('bed', 'bed', 8.4, 5.1, 2.4, 1.7, .52)
  ];
  if (!['plot', 'expedition'].includes(scene)) return [];
  const objects = [
    ...(home.nodes || []).filter(n => n.left > 0 && ['wood','stone','food','seed_hemp','seed_carrot'].includes(n.kind))
      .map(n => rect(n.id, 'node-'+n.kind, n.x-.29, n.y-.29, .58, .58, 1.3)),
  ];
  if (scene === 'expedition') return objects;
  if (home.tent > 0) {
    objects.push(rect('tent-visual', 'tent', 6, 5, 4, 3, 1.9, false));
    if (home.tent >= 2) {
      // A physical doorway remains open in the SOUTH (y=8) front side.
      objects.push(
        rect('tent-rear', 'tent-wall', 6, 5, 4, .6, 1.9),
        rect('tent-left', 'tent-wall', 6, 5.6, .6, 2.4, 1.9),
        rect('tent-right', 'tent-wall', 9.4, 5.6, .6, 2.4, 1.9)
      );
    }
  }
  objects.push(rect('well', 'well', 13.45, 2.45, 1.1, 1.1, .65));
  for (const bed of home.beds || []) objects.push(
    rect(bed.id, 'garden-bed', bed.x-.55, bed.y-.55, 1.1, 1.1, .1)
  );
  for (const tree of home.plantedTrees || []) {
    if (tree.wateredAt && now-tree.wateredAt >= 180000)
      objects.push(rect(tree.id || 'tree-'+tree.x+'-'+tree.y, 'planted-tree', tree.x-.3, tree.y-.3, .6, .6, 1.4));
  }
  return objects;
}

export function intersectsLocalFootprint(x, y, o, radius = LOCAL_PLAYER_RADIUS) {
  if (!o.solid) return false;
  const dx = Math.max(o.x - x, 0, x - o.x - o.w);
  const dy = Math.max(o.y - y, 0, y - o.y - o.h);
  return dx*dx + dy*dy < radius*radius;
}

export function blockedByLocalFootprints(x, y, objects, radius = LOCAL_PLAYER_RADIUS, previous = null) {
  return objects.some(o => {
    if (!intersectsLocalFootprint(x,y,o,radius)) return false;
    // A person already inside geometry in an older save must be able to ESCAPE.
    // Never let this exemption grant entry from outside the footprint.
    if (previous && intersectsLocalFootprint(previous.x, previous.y, o, radius)) {
      const cx=o.x+o.w/2, cy=o.y+o.h/2;
      if (Math.hypot(x-cx,y-cy) > Math.hypot(previous.x-cx,previous.y-cy)+1e-8) return false;
    }
    return true;
  });
}
