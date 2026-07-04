"use server"

import { createClient } from "@/libs/supabase"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function submitPayment(prevState, formData) {
  const bookingId = formData.get("bookingId")
  const totalPrice = formData.get("totalPrice")
  const slipFile = formData.get("slip")
  let redirectUrl = ""
  let isSuccess = false

  if (!bookingId || !slipFile || slipFile.size === 0) {
    return { error: "กรุณาแนบไฟล์สลิปการโอนเงิน (Please provide a valid slip file)" }
  }

  // max 5MB
  if (slipFile.size > 5 * 1024 * 1024) {
    return { error: "ขนาดไฟล์ต้องไม่เกิน 5MB (Slip file must be less than 5MB)" }
  }

  if (!slipFile.type.startsWith("image/")) {
    return { error: "รองรับไฟล์รูปภาพเท่านั้น (Only image files are supported)" }
  }

  try {
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return { error: "คุณต้องเข้าสู่ระบบก่อนทำการอัปโหลด (You must be logged in)" }
    }

    const fileExt = slipFile.name.split('.').pop()
    const filePath = `${bookingId}_${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from("slips")
      .upload(filePath, slipFile, { upsert: true })

    if (uploadError) {
      return { error: `อัปโหลดไฟล์ล้มเหลว: ${uploadError.message}` }
    }

    const { data: { publicUrl } } = supabase.storage
      .from("slips")
      .getPublicUrl(filePath)

    // Insert into payments table
    const { error: paymentError } = await supabase
      .from("payments")
      .insert({
        booking_id: bookingId,
        amount: parseFloat(totalPrice),
        status: "pending",
        slip_url: publicUrl,
        paid_at: new Date().toISOString()
      })

    if (paymentError) {
      return { error: `บันทึกข้อมูลการชำระเงินล้มเหลว: ${paymentError.message}` }
    }

    // Update booking status
    const { error: bookingError } = await supabase
      .from("bookings")
      .update({ status: "pending" })
      .eq("id", bookingId)

    if (bookingError) {
      return { error: `อัปเดตสถานะการจองล้มเหลว: ${bookingError.message}` }
    }
    
    isSuccess = true
    redirectUrl = `/bookings` // Redirect to the user's booking history/list

  } catch (error) {
    return { error: "เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง (Unexpected error)" }
  }

  if (isSuccess) {
    revalidatePath("/bookings")
    redirect(redirectUrl)
  }
}
