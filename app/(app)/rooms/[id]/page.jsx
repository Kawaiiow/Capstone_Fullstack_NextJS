import supabase from '@/libs/supabase'
import Link from 'next/link'

export default async function RoomDetailPage({ params }) {
  const { id } = await params

  const { data: room, error } = await supabase
    .from('rooms')
    .select(`
      id, name, room_type, capacity, status,
      room_amenities(amenities(name))
    `)
    .eq('id', id)
    .single()

  if (error || !room) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10">
        <p className="text-danger">ไม่พบห้องนี้</p>
        <Link href="/rooms" className="text-teal underline">กลับไปหน้ารายการห้อง</Link>
      </div>
    )
  }

  const amenities = room.room_amenities.map((ra) => ra.amenities.name)

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <Link href="/rooms" className="text-sm text-teal mb-4 inline-block">
        ← กลับไปหน้ารายการห้อง
      </Link>

      <h1 className="font-sans text-3xl font-bold text-navy mb-2">{room.name}</h1>
      <p className="text-navy/70 mb-6">รองรับ {room.capacity} คน</p>

      {amenities.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-6">
          {amenities.map((name) => (
            <span key={name} className="text-xs px-2 py-1 rounded-full bg-muted text-navy">
              {name}
            </span>
          ))}
        </div>
      )}

      <Link
        href={`/rooms/${room.id}/book`}
        className="inline-block bg-navy text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
      >
        จองห้องนี้
      </Link>
    </div>
  )
}