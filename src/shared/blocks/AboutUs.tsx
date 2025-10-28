/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  MapPin,
  Star,
  Truck,
  LocateFixed,
  CheckCircle2,
  FileText,
  Mail,
  ChevronDown,
  RefreshCcw,
  XCircle,
  Headphones,
} from "lucide-react";
import { AboutUsServerSettings } from "./about_Us";

/* ---------- bullet + item types ---------- */
type Bullet = { icon?: React.ReactNode; text?: React.ReactNode };
type Item = { id?: string; title: React.ReactNode; bullets: Bullet[] };

/* ---------- icon lookup when settings pass a string key ---------- */
const iconLookup: Record<string, React.ElementType> = {
  truck: Truck,
  star: Star,
  compass: LocateFixed,
  "check-circle": CheckCircle2,
  "file-text": FileText,
  "map-pin": MapPin,
  mail: Mail,
  refresh: RefreshCcw,
  "close-circle": XCircle,
  headset: Headphones,
};

/* ---------- PER-SECTION DEFAULT ICONS (fallbacks) ---------- */
/* If the server only sends strings for bullets, we’ll use these. */
const DEFAULT_ICON_MATRIX: Record<string, React.ReactNode[]> = {
  orders: [
    <Truck size={18} />,
    <Star size={18} />,
    <Truck size={18} />,
    <LocateFixed size={18} />,
  ],
  cancellation: [<CheckCircle2 size={18} />],
  returns: [<FileText size={18} />],
  reach: [<MapPin size={18} />, <Mail size={18} />],
};

/* Safe getter for the fallback icon by section key + bullet index */
function getFallbackIcon(sectionKey: string, index: number): React.ReactNode {
  const arr = DEFAULT_ICON_MATRIX[sectionKey] || [];
  return arr[index] ?? <CheckCircle2 size={18} />;
}

/* If settings provide an icon string, convert via lookup */
function iconFromKey(key?: string, size = 18): React.ReactNode {
  if (!key) return undefined;
  const Cmp = iconLookup[key];
  return Cmp ? <Cmp size={size} /> : undefined;
}

/* ---------- styled card ---------- */
function Card({
  item,
  defaultOpen = true,
}: {
  item: Item;
  defaultOpen?: boolean;
}) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-xl border border-slate-200 bg-white shadow-sm transition open:shadow-md open:ring-1 open:ring-slate-200"
    >
      <summary className="flex items-center gap-3 px-4 sm:px-6 py-4 cursor-pointer select-none list-none rounded-xl">
        <h3 className="text-[18px] leading-6 font-semibold text-slate-800">
          {item.title}
        </h3>
        <ChevronDown
          className="ml-auto h-5 w-5 text-slate-600 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
          strokeWidth={1.75}
          aria-hidden
        />
      </summary>

      <div className="h-px bg-slate-200/80 mx-4 sm:mx-6" />

      <div className="px-4 sm:px-6 py-4">
        <ul className="space-y-2.5">
          {item.bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className="mt-[2px] inline-flex h-5 w-5 items-center justify-center text-slate-500"
                aria-hidden
              >
                {b.icon ?? <CheckCircle2 size={18} />}
              </span>
              <p className="text-[15px] leading-6 text-slate-600">{b.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}

/* ---------- DEFAULT CONTENT (used when settings are empty) ---------- */
const DEFAULT_ITEMS: Item[] = [
  {
    id: "orders",
    title: "Orders and delivery",
    bullets: [
      { icon: <Truck size={18} />, text: "Delivery across India" },
      { icon: <Star size={18} />, text: "Delivery fee will apply" },
      {
        icon: <Truck size={18} />,
        text: (
          <>
            All orders will be delivered by <b>SampleStore.co</b>
          </>
        ),
      },
      {
        icon: <LocateFixed size={18} />,
        text: "Enter pincode details in home page for estimated delivery timeline",
      },
    ],
  },
  {
    id: "cancellation",
    title: "Cancellation policy",
    bullets: [
      {
        icon: <CheckCircle2 size={18} />,
        text: "Full refund if you cancel it before the order is accepted by us. For any queries on cancellations reach out to us via chat",
      },
    ],
  },
  {
    id: "returns",
    title: "Return policy",
    bullets: [
      {
        icon: <FileText size={18} />,
        text: "For Terms & Conditions Refer to our highlights",
      },
    ],
  },
  {
    id: "reach",
    title: "How to reach us",
    bullets: [
      { icon: <MapPin size={18} />, text: "Jogeshwari West, Mumbai" },
      { icon: <Mail size={18} />, text: "XXXXXXXXXXXXXX014@gmail.com" },
    ],
  },
];

/* ---------- normalize server settings into our Item[] shape ---------- */
function normalizeFromSettings(s?: AboutUsServerSettings): Item[] {
  if (!s?.items || !Array.isArray(s.items) || s.items.length === 0)
    return DEFAULT_ITEMS;

  return s.items.map((raw: any, idx: number): Item => {
    // Use key/id to pick fallback icon set
    const sectionKey = String(
      raw?.key ?? raw?.id ?? `section-${idx}`
    ).toLowerCase();

    const bullets: Bullet[] = Array.isArray(raw?.bullets)
      ? raw.bullets.map((b: any, bi: number) => {
          // If bullet is a string -> apply fallback icon by section + index
          if (typeof b === "string") {
            return { text: b, icon: getFallbackIcon(sectionKey, bi) };
          }
          // If bullet is an object:
          //  - if icon is a ReactNode, keep it
          //  - if icon is a string key, convert via iconFromKey
          //  - otherwise, fallback to matrix
          const nodeIcon = React.isValidElement(b?.icon)
            ? b.icon
            : iconFromKey(String(b?.icon || "")) ??
              getFallbackIcon(sectionKey, bi);
          return { text: b?.text ?? "", icon: nodeIcon };
        })
      : [];

    return {
      id: raw?.key ?? raw?.id ?? `about-item-${idx}`,
      title: raw?.title ?? "",
      bullets,
    };
  });
}

/* ---------- main block ---------- */
const AboutUsBlock: React.FC<{ settings?: AboutUsServerSettings }> = ({
  settings,
}) => {
  const s: AboutUsServerSettings = {
    enabled: true,
    display_title: false,
    title: "About us",
    title_color: "#111827",
    display_subtitle: false,
    subtitle: "",
    subtitle_color: "#6b7280",
    align: "left",
    section_background_color: "#ffffff",
    grid_desktop_columns: 1,
    grid_tablet_columns: 1,
    card_radius: "xl",
    card_shadow: "md",
    card_divider: true,
    use_accordion: true,
    items: DEFAULT_ITEMS as any,
    section_top_margin: "0rem",
    section_bottom_margin: "1.5rem",
    custom_css: null,
    visibility: "all",
    ...(settings || {}),
  };

  if (s.enabled === false) return null;

  const items = normalizeFromSettings(s);

  return (
    <section
      style={{
        background: s.section_background_color,
        marginTop: s.section_top_margin,
        marginBottom: s.section_bottom_margin,
      }}
      className="bg-transparent pb-2"
    >
      {/* ABOUT US header + dotted rule */}
      <div className="px-4 sm:px-6 pt-2">
        <div className="flex items-center gap-3">
          <span className="text-[11px] tracking-[0.18em] text-slate-500 font-semibold uppercase">
            ABOUT US
          </span>
          <span className="h-[1px] flex-1 border-t border-dotted border-slate-300/60 translate-y-[1px]" />
        </div>
      </div>

      {/* Cards (all open by default) */}
      <div className="mx-4 sm:mx-6 my-3 grid gap-3">
        {items.map((it) => (
          <Card key={it.id as any} item={it} defaultOpen />
        ))}
      </div>

      {/* Hide native marker triangle */}
      <style>{`
        details > summary::-webkit-details-marker { display: none; }
        details > summary { list-style: none; }
      `}</style>

      {s.custom_css ? (
        <style dangerouslySetInnerHTML={{ __html: s.custom_css }} />
      ) : null}
    </section>
  );
};

export default AboutUsBlock;
