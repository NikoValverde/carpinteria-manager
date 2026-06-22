export default function SectionCard({ title, icon: Icon, children }) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
            <Icon size={18} />
          </div>
        )}

        <div className="flex-1 text-zinc-900 dark:text-zinc-100">{title}</div>
      </div>

      <div className="p-6">{children}</div>
    </div>
  );
}
