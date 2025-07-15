"use client"

import { useEffect, useRef } from "react"

interface Location {
  latitude: number
  longitude: number
}

interface EmergencyFacility {
  id: string
  name: string
  type: "hospital" | "ambulance" | "blood_bank"
  distance: number
  phone: string
  address: string
  coordinates: Location
}

interface MapCanvasProps {
  userLocation: Location | null
  facilities: EmergencyFacility[]
}

export default function MapCanvas({ userLocation, facilities }: MapCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw background
    ctx.fillStyle = "#f8fafc"
    ctx.fillRect(0, 0, rect.width, rect.height)

    // Draw grid
    ctx.strokeStyle = "#e2e8f0"
    ctx.lineWidth = 1
    for (let i = 0; i < rect.width; i += 20) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, rect.height)
      ctx.stroke()
    }
    for (let i = 0; i < rect.height; i += 20) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(rect.width, i)
      ctx.stroke()
    }

    if (!userLocation) {
      // Show "No location" message
      ctx.fillStyle = "#64748b"
      ctx.font = "16px system-ui"
      ctx.textAlign = "center"
      ctx.fillText("Enable location to see map", rect.width / 2, rect.height / 2)
      return
    }

    // Calculate bounds for all locations
    const allLats = [userLocation.latitude, ...facilities.map((f) => f.coordinates.latitude)]
    const allLngs = [userLocation.longitude, ...facilities.map((f) => f.coordinates.longitude)]

    const minLat = Math.min(...allLats) - 0.01
    const maxLat = Math.max(...allLats) + 0.01
    const minLng = Math.min(...allLngs) - 0.01
    const maxLng = Math.max(...allLngs) + 0.01

    // Convert lat/lng to canvas coordinates
    const latToY = (lat: number) => {
      return rect.height - ((lat - minLat) / (maxLat - minLat)) * rect.height
    }

    const lngToX = (lng: number) => {
      return ((lng - minLng) / (maxLng - minLng)) * rect.width
    }

    // Draw user location
    const userX = lngToX(userLocation.longitude)
    const userY = latToY(userLocation.latitude)

    // User location circle
    ctx.fillStyle = "#3b82f6"
    ctx.beginPath()
    ctx.arc(userX, userY, 8, 0, 2 * Math.PI)
    ctx.fill()

    // User location pulse effect
    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(userX, userY, 15, 0, 2 * Math.PI)
    ctx.stroke()

    // User label
    ctx.fillStyle = "#1e293b"
    ctx.font = "bold 12px system-ui"
    ctx.textAlign = "center"
    ctx.fillText("You", userX, userY - 20)

    // Draw facilities
    facilities.forEach((facility, index) => {
      const x = lngToX(facility.coordinates.longitude)
      const y = latToY(facility.coordinates.latitude)

      // Facility colors
      let color = "#ef4444" // hospital
      if (facility.type === "ambulance") color = "#f59e0b"
      if (facility.type === "blood_bank") color = "#dc2626"

      // Draw connection line
      ctx.strokeStyle = color + "40"
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(userX, userY)
      ctx.lineTo(x, y)
      ctx.stroke()
      ctx.setLineDash([])

      // Facility marker
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(x, y, 6, 0, 2 * Math.PI)
      ctx.fill()

      // Facility icon (simplified)
      ctx.fillStyle = "white"
      ctx.font = "bold 8px system-ui"
      ctx.textAlign = "center"
      let icon = "H"
      if (facility.type === "ambulance") icon = "A"
      if (facility.type === "blood_bank") icon = "B"
      ctx.fillText(icon, x, y + 3)

      // Distance label
      ctx.fillStyle = "#1e293b"
      ctx.font = "10px system-ui"
      ctx.fillText(`${facility.distance.toFixed(1)}mi`, x, y + 20)
    })

    // Legend
    const legendY = 20
    ctx.fillStyle = "#1e293b"
    ctx.font = "12px system-ui"
    ctx.textAlign = "left"
    ctx.fillText("Legend:", 10, legendY)

    // Hospital
    ctx.fillStyle = "#ef4444"
    ctx.beginPath()
    ctx.arc(20, legendY + 20, 4, 0, 2 * Math.PI)
    ctx.fill()
    ctx.fillStyle = "#1e293b"
    ctx.fillText("Hospital", 30, legendY + 24)

    // Ambulance
    ctx.fillStyle = "#f59e0b"
    ctx.beginPath()
    ctx.arc(20, legendY + 40, 4, 0, 2 * Math.PI)
    ctx.fill()
    ctx.fillStyle = "#1e293b"
    ctx.fillText("Ambulance", 30, legendY + 44)

    // Blood Bank
    ctx.fillStyle = "#dc2626"
    ctx.beginPath()
    ctx.arc(20, legendY + 60, 4, 0, 2 * Math.PI)
    ctx.fill()
    ctx.fillStyle = "#1e293b"
    ctx.fillText("Blood Bank", 30, legendY + 64)
  }, [userLocation, facilities])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-80 border rounded-lg bg-slate-50"
      style={{ width: "100%", height: "320px" }}
    />
  )
}
