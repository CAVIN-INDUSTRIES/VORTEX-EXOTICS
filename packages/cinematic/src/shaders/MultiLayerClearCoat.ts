/**
 * Multi-layer clear-coat: stacked Fresnel + roughness-scaled refraction term +
 * warm/cool dual “environment” blend (no extra texture — analytic).
 */
export const MULTI_LAYER_CLEAR_COAT = /* glsl */ `
  vec3 viewDirCC = normalize(-vViewPosition);
  vec3 nCC = normalize(normal);
  float NdotVcc = clamp(dot(nCC, viewDirCC), 0.0, 1.0);
  float f0 = pow(1.0 - NdotVcc, 1.25);
  float f1 = pow(1.0 - NdotVcc, 3.2 + uClearCoatRefraction * 2.8);
  float coat = f0 * 0.55 + f1 * 0.35;
  /* Micro-surface normal perturbation (fbm) — view-dependent env variance without extra textures. */
  float microN = vex_fbm(vUv * 120.0 + uMouseInfluence * 10.0) * 2.0 - 1.0;
  float coatPert = coat * (1.0 + microN * 0.055 * uClearCoatRefraction);
  vec3 warmRim = vec3(1.0, 0.96, 0.88) * (0.055 + 0.045 * uClearCoatRefraction);
  vec3 coolRim = vec3(0.86, 0.9, 1.0) * (0.045 + 0.055 * uClearCoatRefraction);
  float nvBlend = clamp(NdotVcc + microN * 0.04 * uClearCoatRefraction, 0.0, 1.0);
  vec3 envBlend = mix(warmRim, coolRim, nvBlend);
  outgoingLight *= (1.0 + uClearCoatIntensity * (0.04 + 0.09 * coatPert));
  outgoingLight += vec3(0.02 * f0 * uClearCoatIntensity);
  outgoingLight += envBlend * coatPert * uClearCoatIntensity * uClearCoatRefraction * 0.38;
`;
