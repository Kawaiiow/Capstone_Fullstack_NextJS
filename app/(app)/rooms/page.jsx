import supabase from '@/libs/supabase'
import Link from 'next/link'

const statusConfig = {
  available: { label: 'ว่าง', color: 'bg-teal' },
  occupied: { label: 'ไม่ว่าง', color: 'bg-warning' },
  maintenance: { label: 'ปิดปรับปรุง', color: 'bg-danger' },
}

function RoomCard({ room }) {
  const status = statusConfig[room.status] ?? statusConfig.available
  const amenities = room.room_amenities.map((ra) => ra.amenities.name)

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
// import supabase from '@/libs/supabase'

// export default async function RoomsPage() {
//   const { data: rooms, error } = await supabase
//     .from('rooms')
//     .select(`
//       id,
//       name,
//       room_type,
//       capacity,
//       status,
//       room_amenities (
//         amenities ( name )
//       )
//     `)

//   if (error) {
//     return <div style={{ padding: 20 }}>Error: {error.message}</div>
//   }

//   return (
//     <div style={{ padding: 20 }}>
      
//       <h1>Rooms</h1>
//       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
//         {rooms.map((room) => (
//           <div key={room.id} style={{ border: '1px solid #ccc', padding: 16, borderRadius: 8 }}>
//             <h3>{room.name}</h3>
//             <p>room_type: {room.room_type}</p>
//             <p>size: {room.capacity} คน</p>
//             <p>status: {room.status}</p>
//             <p>
//               amenities:{' '}
//               {room.room_amenities.map((ra) => ra.amenities.name).join(', ') || '-'}
//             </p>
//           </div>
//         ))}
//       </div>
    
//     </div>
//   )
// }