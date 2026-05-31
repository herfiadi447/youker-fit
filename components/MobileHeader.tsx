export default function MobileHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="md:hidden bg-surface-container-low border-b border-outline-variant h-16 w-full fixed top-0 flex items-center justify-between px-4 z-30">
      <h1 className="font-headline-sm text-headline-sm font-semibold text-on-surface">
        Youker Fit
      </h1>
      <button onClick={onMenuClick} className="text-primary p-2">
        <span className="material-symbols-outlined">menu</span>
      </button>
    </header>
  );
}
