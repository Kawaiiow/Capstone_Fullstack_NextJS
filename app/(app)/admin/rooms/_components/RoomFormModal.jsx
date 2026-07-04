"use client"

import { useState, useRef, useEffect } from "react"
import { useActionState } from "react"
import { createRoom, updateRoom } from "../action"

export default function RoomFormModal({ room, allAmenities = [], onClose }) {
	const isEditing = !!room
	const action = isEditing ? updateRoom : createRoom
	const [state, formAction, isPending] = useActionState(action, null)

	useEffect(() => {
		if (state?.success) {
			const timer = setTimeout(() => onClose(), 600)
			return () => clearTimeout(timer)
		}
	}, [state?.success, onClose])

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div
				className="absolute inset-0 bg-navy/30 backdrop-blur-sm"
				onClick={onClose}
			/>

			<div className="relative bg-surface border border-border/40 rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
				<div className="flex items-center justify-between mb-6">
					<h2 className="font-sans text-xl font-bold text-navy">
						{isEditing ? "Edit Room" : "Add New Room"}
					</h2>
					<button
						type="button"
						onClick={onClose}
						className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center text-navy/50 hover:text-navy transition-colors cursor-pointer"
					>
						✕
					</button>
				</div>

				<form action={formAction} className="space-y-4">
					{isEditing && <input type="hidden" name="id" value={room.id} />}

					<div>
						<label htmlFor="room-name" className="mb-1 block text-xs font-semibold text-navy">
							Room Name
						</label>
						<input
							type="text"
							name="name"
							id="room-name"
							required
							defaultValue={room?.name || ""}
							className="w-full rounded-lg border border-border/50 bg-surface px-3 py-2 text-sm text-navy placeholder:text-zinc-400 focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal/40 transition-shadow"
							placeholder="Conference Room A"
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<label htmlFor="room-type" className="mb-1 block text-xs font-semibold text-navy">
								Room Type
							</label>
							<select
								name="room_type"
								id="room-type"
								defaultValue={room?.room_type || "meeting_room"}
								className="w-full rounded-lg border border-border/50 bg-surface px-3 py-2 text-sm text-navy focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal/40 cursor-pointer"
							>
								<option value="meeting_room">Meeting Room</option>
								<option value="desk">Desk</option>
							</select>
						</div>

						<div>
							<label htmlFor="room-capacity" className="mb-1 block text-xs font-semibold text-navy">
								Capacity
							</label>
							<input
								type="number"
								name="capacity"
								id="room-capacity"
								required
								min="1"
								defaultValue={room?.capacity || ""}
								className="w-full rounded-lg border border-border/50 bg-surface px-3 py-2 text-sm text-navy placeholder:text-zinc-400 focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal/40 transition-shadow"
								placeholder="10"
							/>
						</div>
					</div>

					<div>
						<label htmlFor="room-status" className="mb-1 block text-xs font-semibold text-navy">
							Status
						</label>
						<select
							name="status"
							id="room-status"
							defaultValue={room?.status || "available"}
							className="w-full rounded-lg border border-border/50 bg-surface px-3 py-2 text-sm text-navy focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal/40 cursor-pointer"
						>
							<option value="available">Available</option>
							<option value="occupied">Occupied</option>
							<option value="maintenance">Maintenance</option>
						</select>
					</div>

					<div>
						<span className="mb-2 block text-xs font-semibold text-navy">
							Amenities
						</span>
						<div className="grid grid-cols-2 gap-2 border border-border/40 rounded-xl p-3 bg-muted/20 max-h-36 overflow-y-auto">
							{allAmenities.length === 0 ? (
								<p className="text-zinc-400 text-xs col-span-2 text-center py-2">
									No amenities available.
								</p>
							) : (
								allAmenities.map((amenity) => {
									const isChecked = room?.room_amenities?.some(
										(ra) => ra.amenity_id === amenity.id
									)
									return (
										<label
											key={amenity.id}
											className="flex items-center gap-2 text-xs text-navy/80 hover:text-navy cursor-pointer select-none py-0.5"
										>
											<input
												type="checkbox"
												name="amenities"
												value={amenity.id}
												defaultChecked={isChecked}
												className="rounded border-border/70 text-teal focus:ring-teal/40 h-3.5 w-3.5 cursor-pointer accent-teal"
											/>
											<span>{amenity.name}</span>
										</label>
									)
								})
							)}
						</div>
					</div>

					{state?.error && (
						<div className="p-3 bg-danger/5 border border-danger/20 rounded-lg flex items-center gap-2">
							<svg className="w-4 h-4 text-danger shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<p className="text-xs font-medium text-danger">{state.error}</p>
						</div>
					)}

					{state?.success && (
						<div className="p-3 bg-teal/5 border border-teal/20 rounded-lg flex items-center gap-2">
							<svg className="w-4 h-4 text-teal shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<p className="text-xs font-medium text-teal">{state.success}</p>
						</div>
					)}

					<div className="flex justify-end gap-3 pt-2">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-navy hover:bg-muted transition-colors cursor-pointer"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isPending}
							className="px-6 py-2 rounded-lg bg-navy text-white text-sm font-semibold hover:bg-navy/95 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer"
						>
							{isPending ? (
								<span className="flex items-center gap-2">
									<svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
									</svg>
									Saving...
								</span>
							) : isEditing ? (
								"Save Changes"
							) : (
								"Add Room"
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}
