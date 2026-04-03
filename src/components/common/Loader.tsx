export default function Loader() {
  return (
    <div
      className="flex min-h-[52vh] items-center justify-center px-4"
      role="status"
      aria-live="polite"
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-white/70 bg-white/90 p-8 text-center shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-500 via-emerald-500 to-teal-500" />
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-cyan-100 bg-cyan-50 shadow-inner">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-100 border-t-cyan-600" />
        </div>
        <p className="mt-5 text-lg font-semibold text-slate-900">
          Loading AI insights...
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Preparing a polished operations view for you.
        </p>
      </div>
    </div>
  );
}
