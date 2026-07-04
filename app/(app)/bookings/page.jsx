import { createClient } from "@/libs/supabase"
import { redirect } from "next/navigation"
import Link from "next/link"
import CancelBookingButton from "./CancelBookingButton"

const statusConfig = {
    pending: { label: "รอดำเนินการ", color: "bg-warning" },
    confirmed: { label: "ยืนยันแล้ว", color: "bg-teal" },
    cancelled: { label: "ยกเลิก", color: "bg-danger" },
}

export default async function MyBookingsPage() {
    const supabase = await createClient()

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
        redirect("/login")
    }

    const { data: bookings, error } = await supabase
        .from("bookings")
        .select(`
      id, start_time, end_time, status, created_at,
      rooms ( name, price_per_hour )
    `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

    if (error) {
        return <div className="p-10 text-danger">Error: {error.message}</div>
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-10">
            <h1 className="font-sans text-3xl font-bold text-navy mb-8">การจองของฉัน</h1>

            {bookings.length === 0 ? (
                <p className="text-navy/60 text-sm">
                    คุณยังไม่มีรายการจอง —{" "}
                    <Link href="/rooms" className="text-teal underline">
                        ไปเลือกห้องเลย
                    </Link>
                </p>
            ) : (
                <div className="flex flex-col gap-3">
                    {bookings.map((booking) => {
                        const status = statusConfig[booking.status] ?? statusConfig.pending
                        const hours =
                            (new Date(booking.end_time) - new Date(booking.start_time)) /
                            (1000 * 60 * 60)
                        const totalPrice = hours * booking.rooms.price_per_hour

                        const dateLabel = new Date(booking.start_time).toLocaleDateString("th-TH", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
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
                            <Link
                                key={booking.id}
                                href={`/bookings/${booking.id}/payment`}
                                className="rounded-xl border border-border bg-surface p-5 flex items-center justify-between hover:shadow-md transition-shadow"
                            >
                                <div>
                                    <p className="font-sans font-semibold text-navy">
                                        {booking.rooms.name} · {dateLabel}
                                    </p>
                                    <p className="text-sm text-navy/70">
                                        {startLabel} — {endLabel} ({hours} ชม.)
                                    </p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="flex items-center gap-1.5 text-xs font-medium text-navy">
                                            <span className={`w-2 h-2 rounded-full ${status.color}`} />
                                            {status.label}
                                        </span>
                                        <span className="font-bold text-navy">฿{totalPrice}</span>
                                    </div>

                                    {booking.status === "pending" && (
                                        <CancelBookingButton bookingId={booking.id} />
                                    )}
                                </div>
                            </Link>
                        )
                    })}
                </div>
            )}
        </div>
    )
}