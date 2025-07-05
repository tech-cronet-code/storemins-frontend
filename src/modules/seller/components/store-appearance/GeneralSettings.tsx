import React, { useEffect, useRef, useState } from 'react'
import { Check, ChevronLeft, ChevronRight } from 'lucide-react'
import StoreFont from './StoreFont'

/* ---------------------- constants ---------------------- */
const borderStyles = [
  { label: 'Square', value: '0px' },
  { label: 'Soft Rounded', value: '12px' },
  { label: 'Rounded', value: '9999px' }
]

const themeColors = [
  '#296FC2',
  '#E02858',
  '#2A5EE1',
  '#29A56C',
  '#F6740C',
  '#29A13C',
  '#F6A401'
]

interface Props {
  generalSettings: any
  onChange: (d: any) => void
}

const GeneralSettings: React.FC<Props> = ({ generalSettings, onChange }) => {
  /* -------------- border-radius dropdown -------------- */
  const [radiusOpen, setRadiusOpen] = useState(false)

  /* -------------- theme color scroller -------------- */
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(false)
  const [hasOverflow, setHasOverflow] = useState(false)

  const updateArrows = () => {
    const el = scrollRef.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    const overflow = scrollWidth > clientWidth + 1
    setHasOverflow(overflow)
    setShowLeft(overflow && scrollLeft > 0)
    setShowRight(overflow && scrollLeft + clientWidth < scrollWidth - 1)
  }

  useEffect(() => {
    updateArrows()
    window.addEventListener('resize', updateArrows)
    const el = scrollRef.current
    el?.addEventListener('scroll', updateArrows)
    return () => {
      window.removeEventListener('resize', updateArrows)
      el?.removeEventListener('scroll', updateArrows)
    }
  }, [])

  /* ---------------------- jsx ---------------------- */
  return (
    <div className="space-y-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* font picker */}
      <StoreFont
        value={generalSettings.font}
        onChange={font => onChange({ ...generalSettings, font })}
      />

      {/* border radius picker */}
      <div className="relative">
        <label className="mb-1 block text-sm font-semibold text-gray-700">
          Border Radius For Buttons
        </label>

        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-left"
          onClick={() => setRadiusOpen(prev => !prev)}
        >
          <span
            className="h-6 w-6 border"
            style={{ borderRadius: generalSettings.borderRadius }}
          />
          <span className="grow">
            {borderStyles.find(b => b.value === generalSettings.borderRadius)?.label ??
              'Select'}
          </span>
          <ChevronRight className="h-4 w-4 shrink-0" />
        </button>

        {radiusOpen && (
          <ul className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
            {borderStyles.map(s => {
              const isActive = generalSettings.borderRadius === s.value
              return (
                <li
                  key={s.value}
                  className={`flex cursor-pointer items-center gap-4 px-5 py-3 text-sm hover:bg-gray-50 ${isActive && 'bg-gray-100 font-medium'
                    }`}
                  onClick={() => {
                    onChange({ ...generalSettings, borderRadius: s.value })
                    setRadiusOpen(false)
                  }}
                >
                  <span className="h-6 w-6 border" style={{ borderRadius: s.value }} />
                  {s.label}
                  {isActive && <Check className="ml-auto h-4 w-4 text-emerald-600" />}
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {/* theme colors */}
      {/* Theme colors ---------------------------------------------- */}
      <div>
        <label className="block font-medium mb-1">Choose a Theme Color</label>

        <div className="relative w-full">
          <div className="relative flex items-center">
            {/* Left arrow */}
            {showLeft && (
              <button
                className="absolute left-2 z-20 bg-white shadow-md rounded-full p-1"
                style={{ top: "50%", transform: "translateY(-50%)" }}
                onClick={() =>
                  scrollRef.current?.scrollBy({ left: -120, behavior: "smooth" })
                }
              >
                <ChevronLeft size={18} />
              </button>
            )}

            {/* Scroll container */}
            <div
              className={`w-full overflow-hidden relative ${hasOverflow ? "px-12" : ""
                }`}
            >
              <div
                ref={scrollRef}
                className={`flex gap-6 py-2 overflow-x-auto scroll-smooth hide-scrollbar ${hasOverflow ? "" : "justify-center"
                  }`}
              >
                {themeColors.map(color => {
                  const isSelected = generalSettings.themeColor === color;
                  return (
                    <div
                      key={color}
                      className="flex flex-col items-center gap-1 min-w-[60px] shrink-0"
                    >
                      <div
                        onClick={() =>
                          onChange({ ...generalSettings, themeColor: color })
                        }
                        style={{ backgroundColor: color }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition ${isSelected
                            ? "ring-2 ring-green-600"
                            : "border border-gray-300"
                          }`}
                      >
                        {isSelected && (
                          <Check className="text-white w-4 h-4" strokeWidth={3} />
                        )}
                      </div>
                      <span
                        className={`text-xs ${isSelected
                            ? "font-bold text-gray-800"
                            : "text-gray-500"
                          }`}
                      >
                        Color
                      </span>
                      <span
                        className={`text-xs ${isSelected
                            ? "text-gray-700 font-semibold"
                            : "text-gray-500"
                          }`}
                      >
                        {color.replace("#", "")}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Gradient masks (only when overflow) */}
              {hasOverflow && showLeft && (
                <div className="absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
              )}
              {hasOverflow && showRight && (
                <div className="absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
              )}
            </div>

            {/* Right arrow */}
            {showRight && (
              <button
                className="absolute right-2 z-20 bg-white shadow-md rounded-full p-1"
                style={{ top: "50%", transform: "translateY(-50%)" }}
                onClick={() =>
                  scrollRef.current?.scrollBy({ left: 120, behavior: "smooth" })
                }
              >
                <ChevronRight size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* CTA toggles ------------------------------------------------ */}
      <div>
        <label className="mb-1 block text-sm font-semibold text-gray-700">
          Product Card – Call to Actions
        </label>

        {[
          { label: 'Add to Cart', key: 'addToCart' },
          { label: 'Buy Now', key: 'buyNow' },
          { label: 'WhatsApp', key: 'showWhatsApp' }
        ].map(i => {
          const checked = generalSettings[i.key]
          const id = `cta-${i.key}`        // unique id for a11y
          return (
            /* <<< entire row is now clickable >>> */
            <label
              key={i.key}
              htmlFor={id}
              className="mb-3 flex cursor-pointer items-center justify-between gap-4
                   rounded-lg px-3 py-2 hover:bg-gray-50"
            >
              <span className="select-none text-sm">{i.label}</span>

              {/* hidden checkbox */}
              <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={e =>
                  onChange({ ...generalSettings, [i.key]: e.target.checked })
                }
                className="peer sr-only"
              />

              {/* custom switch knob */}
              <div
                className="relative h-5 w-9 rounded-full bg-gray-300 transition-colors
                     peer-checked:bg-emerald-500"
              >
                <span
                  className="absolute left-[2px] top-[2px] h-4 w-4 rounded-full bg-white
                       transition-transform peer-checked:translate-x-4"
                />
              </div>
            </label>
          )
        })}
      </div>

    </div>
  )
}

export default GeneralSettings
