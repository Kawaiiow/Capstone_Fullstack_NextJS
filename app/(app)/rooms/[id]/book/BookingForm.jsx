"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
// import supabase from "@/libs/supabase"
import supabase from "@/libs/supabase-browser"

export default function BookingForm({ room, userId }) {
  const router = useRouter()
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const hours =
    startTime && endTime
      ? Math.max(0, (new Date(endTime) - new Date(startTime)) / (1000 * 60 * 60))
      : 0

  const totalPrice = hours * room.price_per_hour

  async function handleSubmit(e) {
    e.preventDefault()
    setErrorMsg("")

    if (!startTime || !endTime) {
      setErrorMsg("กรุณาเลือกเวลาเริ่มและเวลาสิ้นสุด")
      return
    }

    if (new Date(endTime) <= new Date(startTime)) {
      setErrorMsg("เวลาสิ้นสุดต้องอยู่หลังเวลาเริ่ม")
      return
    }

    setSubmitting(true)

    // Check for overlapping bookings
    const { data: overlapping, error: overlapError } = await supabase
      .from("bookings")
      .select("id")
      .eq("room_id", room.id)
      .in("status", ["pending", "confirmed"])
      .lt("start_time", new Date(endTime).toISOString())
      .gt("end_time", new Date(startTime).toISOString())

    if (overlapError) {
      setErrorMsg(overlapError.message)
      setSubmitting(false)
      return
    }

    if (overlapping && overlapping.length > 0) {
      setErrorMsg("เวลานี้ถูกจองไปแล้ว กรุณาเลือกเวลาอื่น")
      setSubmitting(false)
      return
    }

    const { data, error } = await supabase
      .from("bookings")
      .insert({
        room_id: room.id,
        user_id: userId,
        start_time: startTime,
        end_time: endTime,
        status: "pending",
      })
      .select()
      .single()

    setSubmitting(false)

    if (error) {
      setErrorMsg(error.message)
      return
    }

    await supabase.from("notifications").insert({
      user_id: userId,
      title: "Booking Requested",
      message: `Your booking for ${room.name} has been placed and is waiting for approval.`
    })

    router.push(`/bookings/${data.id}/payment`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-navy">เวลาเริ่ม</label>
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="border border-border rounded-lg px-4 py-2 text-sm"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-navy">เวลาสิ้นสุด</label>
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="border border-border rounded-lg px-4 py-2 text-sm"
        />
      </div>

      <div className="rounded-lg bg-muted p-4 flex flex-col gap-1">
        <p className="text-sm text-navy/70">
          ราคา {room.price_per_hour} บาท/ชั่วโมง × {hours} ชั่วโมง
        </p>
        <p className="text-xl font-bold text-navy">รวม {totalPrice} บาท</p>
      </div>

      {errorMsg && <p className="text-sm text-danger">{errorMsg}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="bg-navy text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {submitting ? "กำลังจอง..." : "ยืนยันจอง"}
      </button>
    </form>
  )
}