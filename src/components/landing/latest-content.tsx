import Link from 'next/link'
import { getAllContent } from '@/lib/content'

const hotTakes = [
  'Small angel investor tickets do not provide validation.',
]

export function LatestContent() {
  const content = getAllContent()
    .sort(
      (a, b) =>
        new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    )
    .slice(0, 6)

  return (
    <section className="relative z-30 border-t border-[rgba(126,184,162,0.18)] bg-[#0a0a10]">
      <div className="mx-auto max-w-4xl px-6 py-28 sm:px-8 sm:py-36">
        {/* Hot Takes */}
        <div className="mb-28">
          <div className="space-y-16">
            {hotTakes.map((take, i) => (
              <div key={take} className="relative">
                {/* Decorative number */}
                <span className="absolute -left-2 -top-6 font-sans text-[8rem] font-thin leading-none text-[rgba(126,184,162,0.07)] select-none sm:-left-6 sm:text-[10rem]">
                  {String(i + 1).padStart(2, '0')}
                </span>

                <div className="relative">
                  {/* Label */}
                  <div className="mb-5 flex items-center gap-3">
                    <span
                      className="h-px flex-1 max-w-16"
                      style={{
                        background:
                          'linear-gradient(90deg, rgba(126,184,162,0.7), transparent)',
                      }}
                    />
                    <span className="font-sans text-[0.65rem] font-normal uppercase tracking-[0.4em] text-[#7eb8a2] opacity-80">
                      Latest Hot Take
                    </span>
                  </div>

                  {/* Quote */}
                  <p className="font-serif text-[clamp(1.6rem,4vw,3.2rem)] font-light italic leading-[1.2] tracking-[-0.01em] text-[#f0ece7]">
                    {take}
                  </p>

                  {/* Bottom accent */}
                  <div
                    className="mt-6 h-px w-24"
                    style={{
                      background:
                        'linear-gradient(90deg, rgba(126,184,162,0.4), transparent)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Content */}
        {content.length > 0 && (
          <div>
            <h2 className="mb-10 font-sans text-xs font-light uppercase tracking-[0.35em] text-[rgba(232,228,223,0.55)]">
              Latest from the Knowledge Base
            </h2>
            <ul className="space-y-10">
              {content.map((item) => (
                <li
                  key={item.href}
                  className="border-l border-[rgba(126,184,162,0.2)] pl-6 transition-colors duration-200 hover:border-[#7eb8a2]"
                >
                  <Link
                    href={item.href}
                    className="group block"
                  >
                    <span className="mb-2 inline-block font-sans text-[0.65rem] font-light uppercase tracking-[0.25em] text-[#7eb8a2] opacity-70">
                      {item.collection}
                    </span>
                    <h3 className="font-serif text-2xl font-light text-[#f0ece7] transition-colors duration-200 group-hover:text-[#7eb8a2] sm:text-3xl">
                      {item.title}
                    </h3>
                    <p className="mt-2 font-sans text-base font-light leading-relaxed text-[rgba(232,228,223,0.55)] sm:text-lg">
                      {item.description}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-16">
              <Link
                href="/learn"
                className="font-sans text-base font-light tracking-wide text-[#7eb8a2] opacity-70 transition-opacity duration-200 hover:opacity-100"
              >
                Browse all content &rarr;
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
