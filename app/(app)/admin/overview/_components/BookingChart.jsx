"use client"

import { useRef, useEffect } from "react"

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export default function BookingChart({ data }) {
	const canvasRef = useRef(null)

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return

		const ctx = canvas.getContext("2d")
		const dpr = window.devicePixelRatio || 1

		const rect = canvas.getBoundingClientRect()
		canvas.width = rect.width * dpr
		canvas.height = rect.height * dpr
		ctx.scale(dpr, dpr)

		const w = rect.width
		const h = rect.height
		const padding = { top: 20, right: 20, bottom: 40, left: 40 }
		const chartW = w - padding.left - padding.right
		const chartH = h - padding.top - padding.bottom

		const max = Math.max(...data, 1)
		const barWidth = (chartW / data.length) * 0.5
		const gap = (chartW / data.length) * 0.5

		ctx.clearRect(0, 0, w, h)

		// Grid lines
		const gridLines = 4
		ctx.strokeStyle = "#EDEEF2"
		ctx.lineWidth = 1
		ctx.font = "11px sans-serif"
		ctx.fillStyle = "#9CA3AF"
		ctx.textAlign = "right"

		for (let i = 0; i <= gridLines; i++) {
			const y = padding.top + chartH - (chartH / gridLines) * i
			const val = Math.round((max / gridLines) * i)
			ctx.beginPath()
			ctx.moveTo(padding.left, y)
			ctx.lineTo(w - padding.right, y)
			ctx.stroke()
			ctx.fillText(val, padding.left - 8, y + 4)
		}

		// Bars
		data.forEach((value, i) => {
			const barH = (value / max) * chartH
			const x = padding.left + (barWidth + gap) * i + gap / 2
			const y = padding.top + chartH - barH

			const gradient = ctx.createLinearGradient(x, y, x, y + barH)
			gradient.addColorStop(0, "#55BAB4")
			gradient.addColorStop(1, "#55BAB4AA")

			ctx.fillStyle = gradient
			ctx.beginPath()
			ctx.roundRect(x, y, barWidth, barH, [6, 6, 0, 0])
			ctx.fill()

			ctx.fillStyle = "#6B7280"
			ctx.font = "11px sans-serif"
			ctx.textAlign = "center"
			ctx.fillText(DAYS[i], x + barWidth / 2, h - padding.bottom + 20)
		})
	}, [data])

	return (
		<div className="bg-surface border border-border/40 rounded-2xl p-6 shadow-sm">
			<h3 className="font-sans font-semibold text-navy mb-4">
				Bookings This Week
			</h3>
			<canvas
				ref={canvasRef}
				className="w-full"
				style={{ height: "220px" }}
			/>
		</div>
	)
}
