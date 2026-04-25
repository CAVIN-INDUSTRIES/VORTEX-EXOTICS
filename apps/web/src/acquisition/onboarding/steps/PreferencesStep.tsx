import type { AcquisitionStepProps } from "@/acquisition/types/contracts";
import { PREFERENCE_BRANDS, PREFERENCE_BRAND_AVOIDANCE, PREFERENCE_COMFORT, PREFERENCE_EMOTIONS } from "@/acquisition/schemas/questions";

function isSelected(list: string[], item: string) {
  return list.includes(item);
}

export function PreferencesStep({ profile, dispatch }: AcquisitionStepProps) {
  const toggleBrand = (brand: string) => {
    dispatch({
      type: "SET_PREFERRED_BRANDS",
      payload: isSelected(profile.preferredBrands, brand)
        ? profile.preferredBrands.filter((current) => current !== brand)
        : [...profile.preferredBrands, brand],
    });
  };

  const toggleAvoidedBrand = (brand: string) => {
    dispatch({
      type: "SET_AVOIDED_BRANDS",
      payload: isSelected(profile.avoidedBrands, brand)
        ? profile.avoidedBrands.filter((current) => current !== brand)
        : [...profile.avoidedBrands, brand],
    });
  };

  const toggleEmotion = (emotion: string) => {
    dispatch({
      type: "SET_DESIRED_EMOTION",
      payload: isSelected(profile.desiredEmotion, emotion)
        ? profile.desiredEmotion.filter((current) => current !== emotion)
        : [...profile.desiredEmotion, emotion],
    });
  };

  const toggleLifestyle = (experience: string) => {
    dispatch({
      type: "SET_LIFESTYLE",
      payload: isSelected(profile.lifestyle, experience)
        ? profile.lifestyle.filter((current) => current !== experience)
        : [...profile.lifestyle, experience],
    });
  };

  return (
    <div className="grid gap-8">
      <section className="rounded-[1.5rem] border border-white/10 bg-black/22 p-5">
        <p className="text-xs uppercase tracking-[0.28em] text-[#f1d38a]/75">Brand attraction</p>
        <h3 className="mt-3 text-2xl text-[#fff8eb]">Select preferred marques</h3>
        <p className="mt-3 text-sm leading-7 text-[#d8d0c2]">
          Choose the brands that align with your ownership identity and market confidence.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {PREFERENCE_BRANDS.options?.map((brand) => (
            <button
              key={brand}
              type="button"
              onClick={() => toggleBrand(brand)}
              className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition ${
                profile.preferredBrands.includes(brand)
                  ? "border-[#f1d38a]/45 bg-[#d4af37]/16 text-[#fff5de]"
                  : "border-white/12 bg-white/[0.03] text-[#cfc4b2] hover:border-[#f1d38a]/22 hover:text-[#fff8eb]"
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-white/10 bg-black/22 p-5">
        <p className="text-xs uppercase tracking-[0.28em] text-[#f1d38a]/75">Brand filters</p>
        <h3 className="mt-3 text-2xl text-[#fff8eb]">Avoided brands</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {PREFERENCE_BRAND_AVOIDANCE.options?.map((brand) => (
            <button
              key={brand}
              type="button"
              onClick={() => toggleAvoidedBrand(brand)}
              className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition ${
                profile.avoidedBrands.includes(brand)
                  ? "border-[#f1d38a]/35 bg-[#7a4a1c]/22 text-[#fff1dc]"
                  : "border-white/12 bg-white/[0.03] text-[#cfc4b2] hover:border-[#f1d38a]/22 hover:text-[#fff8eb]"
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-white/10 bg-black/22 p-5">
        <p className="text-xs uppercase tracking-[0.28em] text-[#f1d38a]/75">Ownership emotion</p>
        <h3 className="mt-3 text-2xl text-[#fff8eb]">How should ownership feel?</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {PREFERENCE_EMOTIONS.options?.map((emotion) => (
            <label
              key={emotion}
              className="flex items-center gap-3 rounded-[1rem] border border-white/12 bg-white/[0.03] px-4 py-3 text-sm text-[#e5dccf]"
            >
              <input
                type="checkbox"
                checked={profile.desiredEmotion.includes(emotion)}
                onChange={() => toggleEmotion(emotion)}
              />
              {emotion}
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-white/10 bg-black/22 p-5">
        <p className="text-xs uppercase tracking-[0.28em] text-[#f1d38a]/75">Lifestyle match</p>
        <h3 className="mt-3 text-2xl text-[#fff8eb]">Comfort and use profile</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {PREFERENCE_COMFORT.options?.map((experience) => (
            <button
              key={experience}
              type="button"
              onClick={() => toggleLifestyle(experience)}
              className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition ${
                profile.lifestyle.includes(experience)
                  ? "border-[#f1d38a]/45 bg-[#d4af37]/16 text-[#fff5de]"
                  : "border-white/12 bg-white/[0.03] text-[#cfc4b2] hover:border-[#f1d38a]/22 hover:text-[#fff8eb]"
              }`}
            >
              {experience}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
