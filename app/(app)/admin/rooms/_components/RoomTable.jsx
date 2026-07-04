"use client"

import { useState, useTransition } from "react"
import RoomFormModal from "./RoomFormModal"
import { deleteRoom } from "../action"

const statusConfig = {
	available: { label: "Available", color: "bg-teal" },
	occupied: { label: "Occupied", color: "bg-warning" },
	maintenance: { label: "Maintenance", color: "bg-danger" },
}

const typeLabels = {
	meeting_room: "Meeting Room",
	desk: "Desk",
}

export default function RoomTable({ rooms, amenities }) {
	const [search, setSearch] = useState("")
	const [modalRoom, setModalRoom] = useState(null)
	const [showModal, setShowModal] = useState(false)
	const [deletingId, setDeletingId] = useState(null)
	const [isPending, startTransition] = useTransition()

	const filtered = rooms.filter((r) =>
		r.name.toLowerCase().includes(search.toLowerCase())
	)

	const handleDelete = (id, name) => {
		if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) return

		setDeletingId(id)
		startTransition(async () => {
			await deleteRoom(id)
			setDeletingId(null)
		})
	}

	return (
		<div>
			{/* Toolbar */}
			<div className="flex flex-col sm:flex-row gap-3 mb-6">
				<input
					type="text"
					placeholder="Search rooms..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="flex-1 border border-border/50 rounded-lg px-4 py-2.5 text-sm text-navy placeholder:text-zinc-400 focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal/40 transition-shadow bg-surface"
				/>
				<button
					type="button"
					onClick={() => {
						setModalRoom(null)
						setShowModal(true)
					}}
					className="px-5 py-2.5 rounded-lg bg-navy text-white text-sm font-semibold hover:bg-navy/95 active:scale-[0.98] transition-all shadow-sm cursor-pointer flex items-center gap-2"
				>
					<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
						<path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
					</svg>
					Add Room
				</button>
			</div>

			{/* Table */}
			<div className="border border-border/40 rounded-2xl overflow-hidden shadow-sm">
				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead>
							<tr className="bg-muted/60 text-left">
								<th className="px-5 py-3 font-semibold text-navy/70 text-xs uppercase tracking-wider">Name</th>
								<th className="px-5 py-3 font-semibold text-navy/70 text-xs uppercase tracking-wider">Type</th>
								<th className="px-5 py-3 font-semibold text-navy/70 text-xs uppercase tracking-wider">Capacity</th>
								<th className="px-5 py-3 font-semibold text-navy/70 text-xs uppercase tracking-wider">Status</th>
								<th className="px-5 py-3 font-semibold text-navy/70 text-xs uppercase tracking-wider text-right">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-border/20">
							{filtered.length === 0 ? (
								<tr>
									<td colSpan={5} className="px-5 py-10 text-center text-navy/50 text-sm">
										No rooms found.
									</td>
								</tr>
							) : (
								filtered.map((room) => {
									const status = statusConfig[room.status] ?? statusConfig.available
									return (
										<tr
											key={room.id}
											className={`hover:bg-muted/30 transition-colors ${deletingId === room.id ? "opacity-50" : ""}`}
										>
											<td className="px-5 py-4">
												<div>
													<p className="font-semibold text-navy">{room.name}</p>
													{room.room_amenities && room.room_amenities.length > 0 && (
														<div className="flex flex-wrap gap-1 mt-1.5">
															{room.room_amenities.map((ra) => {
																const amenity = amenities.find((a) => a.id === ra.amenity_id)
																return amenity ? (
																	<span
																		key={ra.amenity_id}
																		className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-navy/70 border border-border/25 font-medium"
																	>
																		{amenity.name}
																	</span>
																) : null
															})}
														</div>
													)}
												</div>
											</td>
											<td className="px-5 py-4 text-navy/70">
												{typeLabels[room.room_type] || room.room_type}
											</td>
											<td className="px-5 py-4 text-navy/70">{room.capacity}</td>
											<td className="px-5 py-4">
												<span className="inline-flex items-center gap-1.5 text-xs font-medium text-navy">
													<span className={`w-2 h-2 rounded-full ${status.color}`} />
													{status.label}
												</span>
											</td>
											<td className="px-5 py-4 text-right">
												<div className="flex items-center justify-end gap-2">
													<button
														type="button"
														onClick={() => {
															setModalRoom(room)
															setShowModal(true)
														}}
														className="px-3 py-1.5 rounded-lg text-xs font-medium text-navy bg-muted hover:bg-border/60 transition-colors cursor-pointer"
													>
														Edit
													</button>
													<button
														type="button"
														disabled={deletingId === room.id}
														onClick={() => handleDelete(room.id, room.name)}
														className="px-3 py-1.5 rounded-lg text-xs font-medium text-danger bg-danger/5 hover:bg-danger/15 transition-colors cursor-pointer disabled:opacity-50"
													>
														Delete
													</button>
												</div>
											</td>
										</tr>
									)
								})
							)}
						</tbody>
					</table>
				</div>
			</div>

			<div className="mt-4 text-xs text-navy/50 px-1">
				Showing {filtered.length} of {rooms.length} rooms
			</div>

			{showModal && (
				<RoomFormModal
					room={modalRoom}
					allAmenities={amenities}
					onClose={() => {
						setShowModal(false)
						setModalRoom(null)
					}}
				/>
			)}
		</div>
	)
}
