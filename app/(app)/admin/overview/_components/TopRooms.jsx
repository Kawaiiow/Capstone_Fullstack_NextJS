const rankColors = [
	"bg-amber-400 text-white",
	"bg-zinc-400 text-white",
	"bg-amber-700 text-white",
]

export default function TopRooms({ rooms }) {
	return (
		<div className="bg-surface border border-border/40 rounded-2xl p-6 shadow-sm">
			<h3 className="font-sans font-semibold text-navy mb-4">
				Top 3 Most Booked Rooms
			</h3>

			{rooms.length === 0 ? (
				<p className="text-sm text-navy/50">No booking data available.</p>
			) : (
				<div className="space-y-3">
					{rooms.map((room, i) => (
						<div
							key={room.name}
							className="flex items-center gap-4 p-3 rounded-xl bg-muted/40 hover:bg-muted/70 transition-colors"
						>
							<span
								className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${rankColors[i] || "bg-zinc-200 text-navy"}`}
							>
								{i + 1}
							</span>
							<div className="flex-1 min-w-0">
								<p className="font-medium text-navy text-sm truncate">
									{room.name}
								</p>
								<p className="text-xs text-navy/50">{room.type}</p>
							</div>
							<div className="text-right">
								<p className="font-bold text-navy text-lg">{room.bookings}</p>
								<p className="text-[10px] text-navy/40 uppercase tracking-wider">bookings</p>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	)
}
