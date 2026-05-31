export default function MobileHeader() {
  return (
    <header className="md:hidden bg-surface-container-low border-b border-outline-variant h-16 w-full fixed top-0 flex items-center justify-between px-4 z-50">
      <h1 className="font-headline-sm text-headline-sm font-semibold text-on-surface">
        Youker Fit
      </h1>
      <button className="text-primary">
        <span className="material-symbols-outlined">menu</span>
      </button>
    </header>
  );
}
