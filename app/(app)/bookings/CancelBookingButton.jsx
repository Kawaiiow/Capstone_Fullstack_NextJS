"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import supabase from "@/libs/supabase-browser"

export default function CancelBookingButton({ bookingId }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleCancel(e) {
    e.preventDefault()
    e.stopPropagation()

    const confirmed = window.confirm("ยืนยันยกเลิกการจองนี้ใช่ไหม?")
    if (!confirmed) return

    setLoading(true)

    const { error } = await supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", bookingId)

    setLoading(false)

    if (error) {
      alert("ยกเลิกไม่สำเร็จ: " + error.message)
      return
    }

    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={handleCancel}
      disabled={loading}
      className="text-xs px-3 py-1.5 rounded-lg border border-danger text-danger hover:bg-danger hover:text-white transition-colors disabled:opacity-50"
    >
      {loading ? "กำลังยกเลิก..." : "ยกเลิก"}
    </button>
  )
}