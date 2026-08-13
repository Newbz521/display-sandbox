export default function EditButton({ color, onEdit, className = '' }) {
  return (
    <button
      type="button"
      onClick={onEdit}
      className={`cursor-pointer rounded-lg border border-ink/15 bg-card px-3 py-1.5 text-xs uppercase tracking-[0.14em] text-ink/55 transition-colors hover:border-ink/30 hover:text-ink sm:text-[10px] sm:tracking-[0.16em] ${className}`}
      style={{ borderColor: `${color}44` }}
    >
      Edit
    </button>
  )
}
