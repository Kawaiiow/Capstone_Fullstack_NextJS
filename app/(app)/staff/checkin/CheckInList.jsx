"use client"

import { useState } from "react"
import { checkInGuest, cancelBookingFromCheckIn } from "./action"

export default function CheckInList({ bookings }) {
    const [loadingId, setLoadingId] = useState(null)

    const handleCheckIn = async (id) => {
        setLoadingId(id)
        const res = await checkInGuest(id)
        setLoadingId(null)
        if (res.error) {
            alert(`Error: ${res.error}`)
        }
    }

    const handleCancel = async (id) => {
        if (!confirm("คุณต้องการยกเลิกการจองนี้ใช่หรือไม่?")) return
        setLoadingId(id)
        const res = await cancelBookingFromCheckIn(id)
        setLoadingId(null)
        if (res.error) {
            alert(`Error: ${res.error}`)
        }
    }

    if (!bookings || bookings.length === 0) {
        return <p className="text-navy/60 text-sm">ไม่มีคุณลูกค้าที่รอเช็คอิน (ไม่มีการจองที่ยืนยันแล้ว)</p>
    }

    return (
        <div className="flex flex-col gap-4">
            {bookings.map((booking) => {
                const hours = (new Date(booking.end_time) - new Date(booking.start_time)) / (1000 * 60 * 60)
                const dateLabel = new Date(booking.start_time).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })
                const startLabel = new Date(booking.start_time).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })
                const endLabel = new Date(booking.end_time).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })

                const isLoading = loadingId === booking.id

                return (
                    <div key={booking.id} className="rounded-xl border border-border bg-surface p-5 flex flex-col sm:flex-row items-center justify-between shadow-sm">
                        <div className="w-full">
                            <p className="font-sans font-semibold text-navy">
                                {booking.rooms.name}
                            </p>
                            <p className="text-sm text-navy/70">
                                {dateLabel} | {startLabel} — {endLabel} ({hours} ชม.)
                            </p>
                            <p className="text-xs text-navy/50 mt-1">Booked by: {booking.profiles?.first_name} {booking.profiles?.last_name} ({booking.profiles?.email})</p>
                        </div>

                        <div className="flex items-center gap-4 mt-4 sm:mt-0 w-full sm:w-auto justify-end">
                            <button
                                type="button"
                                onClick={() => handleCancel(booking.id)}
                                disabled={isLoading}
                                className="text-xs px-4 py-2 shrink-0 rounded-lg border border-danger text-danger hover:bg-danger hover:text-white transition-colors disabled:opacity-50"
                            >
                                {isLoading ? "..." : "Cancel Reservation"}
                            </button>
                            <button
                                type="button"
                                onClick={() => handleCheckIn(booking.id)}
                                disabled={isLoading}
                                className="text-xs px-6 py-2 shrink-0 rounded-lg bg-teal text-white font-bold hover:bg-teal/80 transition-colors disabled:opacity-50"
                            >
                                {isLoading ? "..." : "Check In"}
                            </button>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

