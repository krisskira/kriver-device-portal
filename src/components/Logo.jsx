import { logoInk, logoOnDark } from '../brand/logos';

export function BrandLogo({ className = 'h-16 w-auto', onDark = false, label = 'Kriver Devices' }) {
  if (onDark) {
    return <img src={logoOnDark} alt={label} className={className} />;
  }

  return (
    <>
      <img src={logoInk} alt={label} className={`${className} dark:hidden`} />
      <img src={logoOnDark} alt={label} className={`${className} hidden dark:block`} />
    </>
  );
}
