import { createClient } from "@/libs/supabase"
import { redirect } from "next/navigation"
import Link from "next/link"
import BookingForm from "./BookingForm"

export default async function BookRoomPage({ params }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/login")
  }

  const { data: room, error } = await supabase
    .from("rooms")
    .select("id, name, capacity, price_per_hour")
    .eq("id", id)
    .single()

  if (error || !room) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10">
        <p className="text-danger">ไม่พบห้องนี้</p>
        <Link href="/rooms" className="text-teal underline">
          กลับไปหน้ารายการห้อง
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <Link href={`/rooms/${room.id}`} className="text-sm text-teal mb-4 inline-block">
        ← กลับไปหน้ารายละเอียดห้อง
      </Link>

      <h1 className="font-sans text-3xl font-bold text-navy mb-2">จองห้อง {room.name}</h1>
      <p className="text-navy/70 mb-8">รองรับ {room.capacity} คน</p>

      <BookingForm room={room} userId={user.id} />
    </div>
  )
}