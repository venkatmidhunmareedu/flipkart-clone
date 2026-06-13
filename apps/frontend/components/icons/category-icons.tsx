import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function IconBase({ children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" {...props}>
      {children}
    </svg>
  );
}

export function ElectronicsIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="8" y="12" width="32" height="22" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M16 38h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M24 34v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </IconBase>
  );
}

export function FashionIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path
        d="M16 14l-4 6v18h24V20l-4-6H16z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M20 14V10h8v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </IconBase>
  );
}

export function MobilesIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="16" y="8" width="16" height="32" rx="2" stroke="currentColor" strokeWidth="2" />
      <circle cx="24" cy="36" r="1.5" fill="currentColor" />
    </IconBase>
  );
}

export function BeautyIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path
        d="M20 10h8v12c0 4-8 4-8 0V10z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M18 34h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M20 26v8M28 26v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </IconBase>
  );
}

export function HomeIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path
        d="M10 22L24 10l14 12v16H10V22z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M20 38V26h8v12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </IconBase>
  );
}

export function AppliancesIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="12" y="10" width="24" height="28" rx="2" stroke="currentColor" strokeWidth="2" />
      <circle cx="24" cy="24" r="6" stroke="currentColor" strokeWidth="2" />
      <path d="M18 34h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </IconBase>
  );
}

export function ToysBabyIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="24" cy="20" r="8" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 38c0-6 5-10 12-10s12 4 12 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </IconBase>
  );
}

export function FoodHealthIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path
        d="M14 16c0-4 4-6 10-6s10 2 10 6v4H14v-4z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M12 20h24v14H12V20z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </IconBase>
  );
}

export function SportsIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="24" cy="24" r="14" stroke="currentColor" strokeWidth="2" />
      <path
        d="M24 10v28M10 24h28M14 14l20 20M34 14L14 34"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </IconBase>
  );
}

export function FurnitureIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path
        d="M10 28h28v8H10v-8zM14 20h20v8H14v-8z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M14 36v4M34 36v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </IconBase>
  );
}

export function DefaultCategoryIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="10" y="10" width="28" height="28" rx="4" stroke="currentColor" strokeWidth="2" />
      <path d="M18 24h12M24 18v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </IconBase>
  );
}

const CATEGORY_ICON_MAP: Record<string, React.ComponentType<IconProps>> = {
  electronics: ElectronicsIcon,
  fashion: FashionIcon,
  mobiles: MobilesIcon,
  beauty: BeautyIcon,
  home: HomeIcon,
  appliances: AppliancesIcon,
  "toys-baby": ToysBabyIcon,
  "food-health": FoodHealthIcon,
  sports: SportsIcon,
  furniture: FurnitureIcon,
};

export function CategoryIcon({ slug, className }: { slug: string; className?: string }) {
  const Icon = CATEGORY_ICON_MAP[slug] ?? DefaultCategoryIcon;

  return <Icon className={className} />;
}
