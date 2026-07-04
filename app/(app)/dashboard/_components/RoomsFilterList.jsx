"use client"

import { useState } from 'react'
import RoomCard from '../../_components/RoomCard'

const statusFilters = [
    { key: 'all', label: 'ทั้งหมด' },
    { key: 'available', label: 'ว่าง' },
    { key: 'occupied', label: 'ไม่ว่าง' },
]

export default function RoomsFilterList({ rooms }) {
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')

    const filteredRooms = rooms.filter((room) => {
        const matchesSearch = room.name.toLowerCase().includes(search.toLowerCase())
        const matchesStatus = statusFilter === 'all' || room.status === statusFilter
        return matchesSearch && matchesStatus
    })

    return (
        <div>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <input
                    type="text"
                    placeholder="ค้นหาชื่อห้อง..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border border-border rounded-lg px-4 py-2 text-sm flex-1"
                />

                <div className="flex gap-2">
                    {statusFilters.map((f) => (
                        <button
                            key={f.key}
                            onClick={() => setStatusFilter(f.key)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium ${statusFilter === f.key
                                ? 'bg-navy text-white'
                                : 'bg-muted text-navy'
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {filteredRooms.length === 0 ? (
                <p className="text-navy/60 text-sm">ไม่พบห้องที่ตรงกับเงื่อนไข</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredRooms.map((room) => (
                        <RoomCard key={room.id} room={room} />
                    ))}
                </div>
            )}
        </div>
    )
}
