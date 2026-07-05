export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen bg-surface items-center justify-center space-y-6">
      <div className="relative flex h-16 w-16 items-center justify-center">
        {/* Outer subtle ring */}
        <div className="absolute inset-0 rounded-full border-[5px] border-muted"></div>
        {/* Spinning teal ring */}
        <div className="absolute inset-0 animate-spin rounded-full border-[5px] border-teal border-t-transparent border-l-transparent"></div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <h3 className="animate-pulse text-sm font-semibold tracking-[0.2em] text-navy uppercase">
          loading
        </h3>
        <p className="text-xs text-zinc-600">
          please wait while we prepare your content...
        </p>
      </div>
    </div>
  );
}
