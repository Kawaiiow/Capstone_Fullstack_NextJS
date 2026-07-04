import Link from 'next/link'

const statusConfig = {
  available: { label: 'ว่าง', color: 'bg-teal' },
  occupied: { label: 'ไม่ว่าง', color: 'bg-warning' },
  maintenance: { label: 'ปิดปรับปรุง', color: 'bg-danger' },
}

export default function RoomCard({ room }) {
  const status = statusConfig[room.status] ?? statusConfig.available
  const amenities = room.room_amenities?.map((ra) => ra.amenities.name) ?? []

  return (
    <Link
      href={`/rooms/${room.id}`}
      className="rounded-xl border border-border bg-surface p-5 flex flex-col gap-3 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <h3 className="font-sans font-semibold text-navy text-lg">{room.name}</h3>
        <span className="flex items-center gap-1.5 text-xs font-medium text-navy">
          <span className={`w-2 h-2 rounded-full ${status.color}`} />
          {status.label}
        </span>
      </div>

      <p className="text-sm text-navy/70">รองรับ {room.capacity} คน</p>

      {amenities.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-1">
          {amenities.map((name) => (
            <span
              key={name}
              className="text-xs px-2 py-1 rounded-full bg-muted text-navy"
            >
              {name}
            </span>
          ))}
        </div>
      )}
    </Link>
  )
}