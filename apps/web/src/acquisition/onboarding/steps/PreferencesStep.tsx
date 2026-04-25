import type { AcquisitionStepComponentProps } from "@/acquisition/types/contracts";

function isSelected(list: string[], item: string) {
  return list.includes(item);
}

export function PreferencesStep({ profile, questions, onProfilePatch }: AcquisitionStepComponentProps) {
  const preferredBrandQuestion = questions.find((question) => question.id === "preferredBrands");
  const emotionQuestion = questions.find((question) => question.id === "desiredEmotion");
  const lifestyleQuestion = questions.find((question) => question.id === "lifestyle");
  const avoidedBrandQuestion = {
    options: ["Maserati", "Jaguar", "Alfa Romeo", "Lotus", "Aston Martin", "Bentley"],
  };

  const toggleBrand = (brand: string) => {
    onProfilePatch({
      preferredBrands: isSelected(profile.preferredBrands, brand)
        ? profile.preferredBrands.filter((current) => current !== brand)
        : [...profile.preferredBrands, brand],
    });
  };

  const toggleAvoidedBrand = (brand: string) => {
    onProfilePatch({
      avoidedBrands: isSelected(profile.avoidedBrands, brand)
        ? profile.avoidedBrands.filter((current) => current !== brand)
        : [...profile.avoidedBrands, brand],
    });
  };

  const toggleEmotion = (emotion: string) => {
    onProfilePatch({
      desiredEmotion: isSelected(profile.desiredEmotion, emotion)
        ? profile.desiredEmotion.filter((current) => current !== emotion)
        : [...profile.desiredEmotion, emotion],
    });
  };

  const toggleLifestyle = (experience: string) => {
    onProfilePatch({
      lifestyle: isSelected(profile.lifestyle, experience)
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
          {preferredBrandQuestion?.options?.map((brand) => (
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
          {avoidedBrandQuestion?.options?.map((brand) => (
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
          {emotionQuestion?.options?.map((emotion) => (
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
          {lifestyleQuestion?.options?.map((experience) => (
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
