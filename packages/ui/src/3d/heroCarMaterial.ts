import * as THREE from "three";

export type HeroLuxuryPaintOptions = {
  /** Tenant / CSS accent — sheen + iridescence tint */
  accentHex?: string;
  iridescence?: number;
};

/** Luxury PBR pass for hero GLB — iridescent clear-coat, sheen, metallic base. */
export function applyHeroLuxuryCarPaint(root: THREE.Object3D, opts?: HeroLuxuryPaintOptions): void {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh) return;
    const name = (mesh.name || "").toLowerCase();
    if (
      /lamp|light|glass|window|wheel|tire|tyre|rim|ground|shadow|logo|grille|headlight|taillight|interior|seat|mirror/i.test(
        name,
      )
    ) {
      return;
    }

    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (let i = 0; i < mats.length; i++) {
      const raw = mats[i];
      if (!raw) continue;

      let phys: THREE.MeshPhysicalMaterial;
      if (raw instanceof THREE.MeshPhysicalMaterial) {
        phys = raw;
      } else if (raw instanceof THREE.MeshStandardMaterial) {
        phys = new THREE.MeshPhysicalMaterial();
        phys.copy(raw);
        if (Array.isArray(mesh.material)) {
          const next = [...mesh.material] as THREE.Material[];
          next[i] = phys;
          mesh.material = next;
        } else {
          mesh.material = phys;
        }
      } else {
        continue;
      }

      phys.color = new THREE.Color(0x121820);
      phys.metalness = THREE.MathUtils.clamp(phys.metalness * 0.9 + 0.08, 0, 1);
      phys.roughness = THREE.MathUtils.clamp(phys.roughness * 0.88, 0.05, 1);
      phys.clearcoat = 1;
      phys.clearcoatRoughness = 0.07;
      phys.sheen = 0.78;
      phys.sheenRoughness = 0.38;
      const accent = opts?.accentHex ? new THREE.Color(opts.accentHex) : new THREE.Color(0xc9a962);
      phys.sheenColor = accent;
      phys.iridescence = opts?.iridescence ?? 0.52;
      phys.iridescenceIOR = 1.34;
      phys.iridescenceThicknessRange = [100, 420];
      phys.needsUpdate = true;
    }
  });
}
