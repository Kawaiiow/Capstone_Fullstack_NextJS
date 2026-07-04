import { createClient } from "@/libs/supabase"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"

export default async function PaymentPage({ params }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/login")
  }

  const { data: booking, error } = await supabase
    .from("bookings")
    .select(`
      id, start_time, end_time, status,
      rooms ( name, price_per_hour )
    `)
    .eq("id", id)
    .single()

  if (error || !booking) {
    notFound()
  }

  const hours =
    (new Date(booking.end_time) - new Date(booking.start_time)) / (1000 * 60 * 60)
  const totalPrice = hours * booking.rooms.price_per_hour

  const formattedDate = new Date(booking.start_time).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
  })
  const startLabel = new Date(booking.start_time).toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  })
  const endLabel = new Date(booking.end_time).toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-teal" />
          <span className="text-sm text-navy/70">เลือกเวลา</span>
        </div>
        <div className="flex-1 h-px bg-border" />
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-navy text-white text-xs flex items-center justify-center">
            2
          </span>
          <span className="text-sm font-medium text-navy">ชำระเงิน</span>
        </div>
      </div>

      {/* สรุปการจอง */}
      <div className="rounded-xl border border-border bg-surface p-5 mb-8">
        <p className="text-navy font-medium mb-1">
          {booking.rooms.name} · {formattedDate}
        </p>
        <p className="text-navy/70 mb-4">
          {startLabel} — {endLabel} ({hours} ชม.)
        </p>
        <div className="border-t border-border pt-4 flex items-center justify-between">
          <span className="text-navy/70">ยอดรวม</span>
          <span className="text-2xl font-bold text-navy">฿{totalPrice}</span>
        </div>
      </div>

      {/* QR code */}
      <p className="text-sm font-medium text-navy mb-3">สแกนจ่ายผ่าน PromptPay</p>
      <div className="w-48 h-48 rounded-xl bg-muted mx-auto mb-8" />

      {/* อัปโหลดสลิป (placeholder ให้เพื่อนมาทำต่อ) */}
      <p className="text-sm font-medium text-navy mb-3">แนบสลิปการโอนเงิน</p>
      <div className="border-2 border-dashed border-border rounded-xl p-10 text-center mb-2">
        <p className="text-navy/70">ลากไฟล์สลิปมาวาง หรือคลิกเพื่อเลือกไฟล์</p>
        <p className="text-xs text-navy/50 mt-1">รองรับ jpg, png ขนาดไม่เกิน 5MB</p>
      </div>
      <p className="text-xs text-navy/50 mb-8">
        (ส่วนอัปโหลดสลิปกำลังพัฒนาโดยทีม จะเปิดใช้งานเร็วๆ นี้)
      </p>

      <button
        type="button"
        disabled
        className="w-full bg-navy text-white px-6 py-3 rounded-lg font-medium opacity-50 cursor-not-allowed"
      >
        ยืนยันการจอง
      </button>
      <p className="text-xs text-navy/50 text-center mt-2">
        การจองของคุณจะรอการอนุมัติจากเจ้าหน้าที่หลังแนบสลิป
      </p>
    </div>
  )
}