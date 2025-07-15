"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Phone, MapPin, Clock, Hospital, Ambulance, Droplets } from "lucide-react"

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

interface EmergencyServicesProps {
  facilities: EmergencyFacility[]
  onCall: (phone: string) => void
  isOnline: boolean
}

export default function EmergencyServices({ facilities, onCall, isOnline }: EmergencyServicesProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "hospital":
        return <Hospital className="h-4 w-4" />
      case "ambulance":
        return <Ambulance className="h-4 w-4" />
      case "blood_bank":
        return <Droplets className="h-4 w-4" />
      default:
        return <Hospital className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "hospital":
        return "bg-red-100 text-red-800 border-red-200"
      case "ambulance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "blood_bank":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatType = (type: string) => {
    return type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5" />
          Emergency Services
        </CardTitle>
        <CardDescription>
          Nearby emergency facilities sorted by distance
          {!isOnline && " (Offline - showing cached results)"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {facilities.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No emergency facilities found. Please try again or contact 911.
            </p>
          ) : (
            facilities.map((facility) => (
              <div key={facility.id} className="border rounded-lg p-4 space-y-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {getIcon(facility.type)}
                      <h3 className="font-semibold text-gray-900">{facility.name}</h3>
                    </div>
                    <Badge variant="outline" className={getTypeColor(facility.type)}>
                      {formatType(facility.type)}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="h-3 w-3" />
                      {facility.distance.toFixed(1)} mi
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <Clock className="h-3 w-3" />~{Math.ceil(facility.distance * 3)} min
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600">{facility.address}</p>

                <div className="flex gap-2">
                  <Button
                    onClick={() => onCall(facility.phone)}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                    size="sm"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call {facility.phone}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const url = `https://maps.google.com/?q=${facility.coordinates.latitude},${facility.coordinates.longitude}`
                      window.open(url, "_blank")
                    }}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Directions
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {!isOnline && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Offline Mode:</strong> Showing cached emergency services. Some information may be outdated.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
