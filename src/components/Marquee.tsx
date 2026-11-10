/**
 * Hero altındaki kayan bant: üstte büyük harflerle üretim adımları, altta ters yöne
 * akan kumaş özelliği çipleri. Kenarlar yumuşakça kaybolur; üzerine gelince durur.
 */
export default function Marquee({ primary, secondary }: { primary: string[]; secondary: string[] }) {
  return (
    <div className="marquee relative overflow-hidden bg-brand-navy py-7 text-white sm:py-9" aria-hidden="true">
      <div className="marquee-mask">
        <div className="marquee-track">
          {[0, 1].map((n) => (
            <div key={n} className="flex shrink-0 items-center">
              {primary.map((item, i) => (
                <span key={`${n}-${item}`} className="flex items-center">
                  <span
                    className={`whitespace-nowrap px-6 font-heading text-2xl font-extrabold tracking-tight sm:px-9 sm:text-4xl ${
                      i % 2 === 1 ? "marquee-outline" : ""
                    }`}
                  >
                    {item}
                  </span>
                  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-white/40 sm:h-5 sm:w-5">
                    <path d="M12 2 14.2 9.8 22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z" fill="currentColor" />
                  </svg>
                </span>
              ))}
            </div>
          ))}
        </div>
        <div className="marquee-track marquee-reverse mt-5 sm:mt-6">
          {[0, 1].map((n) => (
            <div key={n} className="flex shrink-0 items-center gap-3 pe-3">
              {secondary.map((item) => (
                <span
                  key={`${n}-${item}`}
                  className="whitespace-nowrap rounded-full border border-white/20 bg-white/5 px-5 py-2 font-heading text-[11px] font-semibold uppercase tracking-[0.16em] text-white/75 sm:text-xs"
                >
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
