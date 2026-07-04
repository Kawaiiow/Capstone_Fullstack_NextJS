import supabase from '@/libs/supabase'
import RoomCard from '../_components/RoomCard'

export default async function RoomsPage() {
  const { data: rooms, error } = await supabase
    .from('rooms')
    .select(`
      id, name, room_type, capacity, status,
      room_amenities(amenities(name))
    `)

  if (error) {
    return <div className="p-10 text-danger">Error: {error.message}</div>
  }

  const meetingRooms = rooms.filter((r) => r.room_type === 'meeting_room')
  const desks = rooms.filter((r) => r.room_type === 'desk')

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 bg-white">
      <p className="text-sm font-medium text-teal mb-1">พื้นที่ทำงาน</p>
      <h1 className="font-sans text-3xl font-bold text-navy mb-8">ห้องและพื้นที่ทั้งหมด</h1>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-navy mb-4">ห้องประชุม</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {meetingRooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-navy mb-4">โต๊ะทำงาน</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {desks.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </section>
    </div>
  )
}