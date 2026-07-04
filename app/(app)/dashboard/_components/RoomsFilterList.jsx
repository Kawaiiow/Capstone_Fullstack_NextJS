"use client"

import { useState } from 'react'

const statusConfig = {
  available: { label: 'ว่าง', color: 'bg-teal' },
  occupied: { label: 'ไม่ว่าง', color: 'bg-warning' },
  maintenance: { label: 'ปิดปรับปรุง', color: 'bg-danger' },
}

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
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                statusFilter === f.key
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
          {filteredRooms.map((room) => {
            const status = statusConfig[room.status] ?? statusConfig.available
            return (
              <div
                key={room.id}
                className="rounded-xl border border-border bg-surface p-5 flex flex-col gap-2"
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-sans font-semibold text-navy">{room.name}</h3>
                  <span className="flex items-center gap-1.5 text-xs font-medium text-navy">
                    <span className={`w-2 h-2 rounded-full ${status.color}`} />
                    {status.label}
                  </span>
                </div>
                <p className="text-sm text-navy/70">รองรับ {room.capacity} คน</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}