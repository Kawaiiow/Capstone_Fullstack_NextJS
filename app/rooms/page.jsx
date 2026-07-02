import supabase from '@/libs/supabase'

export default async function RoomsPage() {
  const { data: rooms, error } = await supabase
    .from('rooms')
    .select(`
      id,
      name,
      room_type,
      capacity,
      status,
      room_amenities (
        amenities ( name )
      )
    `)

  if (error) {
    return <div style={{ padding: 20 }}>Error: {error.message}</div>
  }

  return (
    <div style={{ padding: 20 }}>
      
      <h1>Rooms</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
        {rooms.map((room) => (
          <div key={room.id} style={{ border: '1px solid #ccc', padding: 16, borderRadius: 8 }}>
            <h3>{room.name}</h3>
            <p>room_type: {room.room_type}</p>
            <p>size: {room.capacity} คน</p>
            <p>status: {room.status}</p>
            <p>
              amenities:{' '}
              {room.room_amenities.map((ra) => ra.amenities.name).join(', ') || '-'}
            </p>
          </div>
        ))}
      </div>
    
    </div>
  )
}