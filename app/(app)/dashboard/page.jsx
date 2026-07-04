import supabase from '@/libs/supabase'
import RoomsFilterList from './_components/RoomsFilterList'

function StatCard({ label, value, accent }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 flex flex-col gap-1">
      <p className="text-sm text-navy/70">{label}</p>
      <p className={`text-3xl font-bold ${accent ?? 'text-navy'}`}>{value}</p>
    </div>
  )
}

export default async function DashboardPage() {
  const { data: rooms, error } = await supabase
    .from('rooms')
    .select('id, name, room_type, status, capacity')

  if (error) {
    return <div className="p-10 text-danger">Error: {error.message}</div>
  }

  const totalRooms = rooms.length
  const availableRooms = rooms.filter((r) => r.status === 'available').length
  const meetingRoomCount = rooms.filter((r) => r.room_type === 'meeting_room').length
  const deskCount = rooms.filter((r) => r.room_type === 'desk').length

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="font-sans text-3xl font-bold text-navy mb-8">ภาพรวม</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="ห้องทั้งหมด" value={totalRooms} />
        <StatCard label="ห้องว่างตอนนี้" value={availableRooms} accent="text-teal" />
        <StatCard label="ห้องประชุม" value={meetingRoomCount} />
        <StatCard label="โต๊ะทำงาน" value={deskCount} />
      </div>

      <h2 className="text-lg font-semibold text-navy mb-4">ค้นหาและกรองห้อง</h2>
      <RoomsFilterList rooms={rooms} />
    </div>
  )
}