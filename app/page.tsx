"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Navigation, Heart, AlertTriangle } from "lucide-react"
import MapCanvas from "./components/map-canvas"
import EmergencyServices from "./components/emergency-services"
import FirstAidInstructions from "./components/first-aid-instructions"
import NetworkStatus from "./components/network-status"

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

export default function EmergencyCarePage() {
  const [userLocation, setUserLocation] = useState<Location | null>(null)
  const [locationError, setLocationError] = useState<string>("")
  const [isOnline, setIsOnline] = useState(true)
  const [networkInfo, setNetworkInfo] = useState<any>(null)
  const [emergencyFacilities, setEmergencyFacilities] = useState<EmergencyFacility[]>([])
  const [isLocating, setIsLocating] = useState(false)

  // Mock emergency facilities data (in real app, this would come from an API)
  const mockFacilities: EmergencyFacility[] = [
    {
      id: "1",
      name: "City General Hospital",
      type: "hospital",
      distance: 0.8,
      phone: "+1-555-0101",
      address: "123 Medical Center Dr",
      coordinates: { latitude: 40.7589, longitude: -73.9851 },
    },
    {
      id: "2",
      name: "Emergency Ambulance Service",
      type: "ambulance",
      distance: 0.3,
      phone: "+1-555-0911",
      address: "456 Emergency Ave",
      coordinates: { latitude: 40.7614, longitude: -73.9776 },
    },
    {
      id: "3",
      name: "Red Cross Blood Bank",
      type: "blood_bank",
      distance: 1.2,
      phone: "+1-555-0202",
      address: "789 Donation St",
      coordinates: { latitude: 40.7505, longitude: -73.9934 },
    },
    {
      id: "4",
      name: "Metro Emergency Hospital",
      type: "hospital",
      distance: 1.5,
      phone: "+1-555-0303",
      address: "321 Health Plaza",
      coordinates: { latitude: 40.7549, longitude: -73.984 },
    },
  ]

  // Geolocation API - Get user's current location
  const getCurrentLocation = () => {
    setIsLocating(true)
    setLocationError("")

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser.")
      setIsLocating(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }
        setUserLocation(location)
        setIsLocating(false)

        // Calculate distances and sort facilities
        const facilitiesWithDistance = mockFacilities
          .map((facility) => ({
            ...facility,
            distance: calculateDistance(location, facility.coordinates),
          }))
          .sort((a, b) => a.distance - b.distance)

        setEmergencyFacilities(facilitiesWithDistance)
      },
      (error) => {
        let errorMessage = "Unable to retrieve your location."
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please enable location services."
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable."
            break
          case error.TIMEOUT:
            errorMessage = "Location request timed out."
            break
        }
        setLocationError(errorMessage)
        setIsLocating(false)
        // Show default facilities even without location
        setEmergencyFacilities(mockFacilities)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    )
  }

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (pos1: Location, pos2: Location): number => {
    const R = 3959 // Earth's radius in miles
    const dLat = ((pos2.latitude - pos1.latitude) * Math.PI) / 180
    const dLon = ((pos2.longitude - pos1.longitude) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((pos1.latitude * Math.PI) / 180) *
        Math.cos((pos2.latitude * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  // Network Information API - Monitor network status
  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine)
    }

    // Check if Network Information API is available
    if ("connection" in navigator) {
      const connection = (navigator as any).connection
      setNetworkInfo(connection)

      const updateNetworkInfo = () => {
        setNetworkInfo({ ...connection })
      }

      connection.addEventListener("change", updateNetworkInfo)
      return () => connection.removeEventListener("change", updateNetworkInfo)
    }

    window.addEventListener("online", updateOnlineStatus)
    window.addEventListener("offline", updateOnlineStatus)

    return () => {
      window.removeEventListener("online", updateOnlineStatus)
      window.removeEventListener("offline", updateOnlineStatus)
    }
  }, [])

  // Auto-locate on component mount
  useEffect(() => {
    getCurrentLocation()
  }, [])

  const callEmergency = (phone: string) => {
    window.location.href = `tel:${phone}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Heart className="h-8 w-8 text-red-500" />
            <h1 className="text-3xl font-bold text-gray-900">Emergency Care Locator</h1>
          </div>
          <p className="text-gray-600">Find nearby emergency services and get life-saving instructions</p>
        </div>

        {/* Network Status */}
        <NetworkStatus isOnline={isOnline} networkInfo={networkInfo} />

        {/* Emergency Alert */}
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Emergency? Call 911 immediately.</strong> This app provides supplementary information only.
          </AlertDescription>
        </Alert>

        {/* Location Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Your Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            {locationError ? (
              <div className="space-y-3">
                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertDescription className="text-yellow-800">{locationError}</AlertDescription>
                </Alert>
                <Button onClick={getCurrentLocation} className="w-full">
                  <Navigation className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </div>
            ) : userLocation ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Latitude: {userLocation.latitude.toFixed(6)}, Longitude: {userLocation.longitude.toFixed(6)}
                </p>
                <Badge variant="outline" className="text-green-700 border-green-200">
                  Location detected
                </Badge>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {isLocating && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>}
                <span className="text-gray-600">
                  {isLocating ? "Detecting your location..." : "Location not available"}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Map Canvas */}
          <Card>
            <CardHeader>
              <CardTitle>Emergency Facilities Map</CardTitle>
              <CardDescription>Visual map showing nearby emergency services</CardDescription>
            </CardHeader>
            <CardContent>
              <MapCanvas userLocation={userLocation} facilities={emergencyFacilities} />
            </CardContent>
          </Card>

          {/* Emergency Services List */}
          <EmergencyServices facilities={emergencyFacilities} onCall={callEmergency} isOnline={isOnline} />
        </div>

        {/* First Aid Instructions */}
        <FirstAidInstructions />
      </div>
    </div>
  )
}
