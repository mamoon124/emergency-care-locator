"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff, Signal } from "lucide-react"

interface NetworkStatusProps {
  isOnline: boolean
  networkInfo: any
}

export default function NetworkStatus({ isOnline, networkInfo }: NetworkStatusProps) {
  const getConnectionType = () => {
    if (!networkInfo) return "Unknown"
    return networkInfo.effectiveType || networkInfo.type || "Unknown"
  }

  const getConnectionSpeed = () => {
    if (!networkInfo) return null
    if (networkInfo.downlink) {
      return `${networkInfo.downlink} Mbps`
    }
    return null
  }

  const isSlowConnection = () => {
    if (!networkInfo) return false
    return networkInfo.effectiveType === "slow-2g" || networkInfo.effectiveType === "2g"
  }

  return (
    <Alert
      className={`${
        !isOnline
          ? "border-red-200 bg-red-50"
          : isSlowConnection()
            ? "border-yellow-200 bg-yellow-50"
            : "border-green-200 bg-green-50"
      }`}
    >
      <div className="flex items-center gap-2">
        {isOnline ? (
          <Wifi className={`h-4 w-4 ${isSlowConnection() ? "text-yellow-600" : "text-green-600"}`} />
        ) : (
          <WifiOff className="h-4 w-4 text-red-600" />
        )}
        <AlertDescription
          className={`${!isOnline ? "text-red-800" : isSlowConnection() ? "text-yellow-800" : "text-green-800"}`}
        >
          <div className="flex items-center gap-2 flex-wrap">
            <span>
              {!isOnline
                ? "Offline - Emergency instructions available without internet"
                : isSlowConnection()
                  ? "Slow connection detected - Some features may be limited"
                  : "Online - All features available"}
            </span>
            {isOnline && networkInfo && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {getConnectionType().toUpperCase()}
                </Badge>
                {getConnectionSpeed() && (
                  <Badge variant="outline" className="text-xs">
                    <Signal className="h-3 w-3 mr-1" />
                    {getConnectionSpeed()}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </AlertDescription>
      </div>
    </Alert>
  )
}
