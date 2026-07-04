const iconMap = {
	booking: (
		<svg className="w-4 h-4 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
		</svg>
	),
	cancel: (
		<svg className="w-4 h-4 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
		</svg>
	),
	user: (
		<svg className="w-4 h-4 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
		</svg>
	),
}

const bgMap = {
	booking: "bg-teal/10",
	cancel: "bg-danger/10",
	user: "bg-navy/10",
}

export default function RecentActivity({ activities }) {
	return (
		<div className="bg-surface border border-border/40 rounded-2xl p-6 shadow-sm">
			<h3 className="font-sans font-semibold text-navy mb-4">
				Recent Activity
			</h3>

			{activities.length === 0 ? (
				<p className="text-sm text-navy/50">No recent activity.</p>
			) : (
				<div className="space-y-1">
					{activities.map((activity, i) => (
						<div
							key={i}
							className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/30 transition-colors"
						>
							<span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${bgMap[activity.type] || "bg-muted"}`}>
								{iconMap[activity.type]}
							</span>
							<div className="flex-1 min-w-0">
								<p className="text-sm text-navy font-medium">{activity.message}</p>
								<p className="text-xs text-navy/40 mt-0.5">{activity.time}</p>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	)
}
