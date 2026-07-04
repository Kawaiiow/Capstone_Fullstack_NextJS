"use client"

import { useState } from "react"
import { updateBookingStatus } from "./action"

export default function RequestList({ bookings }) {
    const [loadingId, setLoadingId] = useState(null)

    const handleAction = async (id, status) => {
        setLoadingId(id)
        const res = await updateBookingStatus(id, status)
        setLoadingId(null)
        if (res.error) {
            alert(`Error: ${res.error}`)
        }
    }

    if (!bookings || bookings.length === 0) {
        return <p className="text-navy/60 text-sm">ไม่มีคำขอจองห้อง - รอดำเนินการ</p>
    }

    return (
        <div className="flex flex-col gap-4">
            {bookings.map((booking) => {
                const hours = (new Date(booking.end_time) - new Date(booking.start_time)) / (1000 * 60 * 60)
                const totalPrice = hours * booking.rooms.price_per_hour
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
                            <span className="font-bold text-navy mr-4">฿{totalPrice}</span>
                            <button
                                type="button"
                                onClick={() => handleAction(booking.id, "cancelled")}
                                disabled={isLoading}
                                className="text-xs px-4 py-2 flex-shrink-0 rounded-lg border border-danger text-danger hover:bg-danger hover:text-white transition-colors disabled:opacity-50"
                            >
                                {isLoading ? "..." : "Deny"}
                            </button>
                            <button
                                type="button"
                                onClick={() => handleAction(booking.id, "confirmed")}
                                disabled={isLoading}
                                className="text-xs px-4 py-2 flex-shrink-0 rounded-lg bg-teal text-white hover:bg-teal/80 transition-colors disabled:opacity-50"
                            >
                                {isLoading ? "..." : "Approve"}
                            </button>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
