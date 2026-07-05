import { createClient } from '@/libs/supabase'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function RoomDetailPage({ params }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect('/login')
  }

  const { data: room, error } = await supabase
    .from('rooms')
    .select(`
      id, name, room_type, capacity, status, price_per_hour,
      room_amenities(amenities(name))
    `)
    .eq('id', id)
    .single()

  const { data: bookings } = await supabase
    .from('bookings')
    .select('start_time, end_time, status')
    .eq('room_id', id)
    .in('status', ['pending', 'confirmed'])
    .gte('end_time', new Date().toISOString())
    .order('start_time', { ascending: true })

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

      {bookings && bookings.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-navy mb-3">ช่วงเวลาที่ถูกจองแล้ว (เร็วๆ นี้)</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border">
              <thead className="bg-muted text-navy border-b">
                <tr>
                  <th className="px-4 py-3 border-b">เริ่มเวลา</th>
                  <th className="px-4 py-3 border-b">สิ้นสุดเวลา</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, i) => (
                  <tr key={i} className="border-b">
                    <td className="px-4 py-3 whitespace-nowrap">{new Date(b.start_time).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{new Date(b.end_time).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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