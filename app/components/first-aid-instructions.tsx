"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, AlertCircle, Clock } from "lucide-react"

interface InstructionStep {
  id: string
  title: string
  description: string
  duration?: string
  critical?: boolean
}

const cprSteps: InstructionStep[] = [
  {
    id: "1",
    title: "Check Responsiveness",
    description: 'Tap shoulders firmly and shout "Are you okay?" Check for normal breathing.',
    duration: "5-10 seconds",
    critical: true,
  },
  {
    id: "2",
    title: "Call for Help",
    description: "Call 911 immediately. Ask someone to find an AED if available.",
    duration: "30 seconds",
    critical: true,
  },
  {
    id: "3",
    title: "Position Hands",
    description:
      "Place heel of one hand on center of chest between nipples. Place other hand on top, interlacing fingers.",
    duration: "10 seconds",
  },
  {
    id: "4",
    title: "Start Compressions",
    description: "Push hard and fast at least 2 inches deep. Allow complete chest recoil between compressions.",
    duration: "30 compressions",
  },
  {
    id: "5",
    title: "Give Rescue Breaths",
    description: "Tilt head back, lift chin. Give 2 breaths, each lasting 1 second with visible chest rise.",
    duration: "2 breaths",
  },
  {
    id: "6",
    title: "Continue Cycles",
    description: "Continue 30 compressions followed by 2 breaths. Minimize interruptions.",
    duration: "Until help arrives",
  },
]

const chokingSteps: InstructionStep[] = [
  {
    id: "1",
    title: "Assess the Situation",
    description: 'Ask "Are you choking?" If person can cough or speak, encourage continued coughing.',
    critical: true,
  },
  {
    id: "2",
    title: "Position for Back Blows",
    description: "Stand behind person, lean them forward. Support chest with one hand.",
    duration: "5 seconds",
  },
  {
    id: "3",
    title: "Give Back Blows",
    description: "Strike firmly between shoulder blades with heel of hand. Give up to 5 back blows.",
    duration: "5 back blows",
  },
  {
    id: "4",
    title: "Abdominal Thrusts",
    description: "Stand behind person, place fist above navel. Grasp fist with other hand and thrust upward.",
    duration: "5 thrusts",
  },
  {
    id: "5",
    title: "Alternate Techniques",
    description: "Continue alternating 5 back blows and 5 abdominal thrusts until object is expelled.",
    duration: "Until clear",
  },
]

export default function FirstAidInstructions() {
  const [activeTab, setActiveTab] = useState<"cpr" | "choking">("cpr")
  const [visibleSteps, setVisibleSteps] = useState<Set<string>>(new Set())
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    // Intersection Observer API - Animate steps as they come into view
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stepId = entry.target.getAttribute("data-step-id")
            if (stepId) {
              setVisibleSteps((prev) => new Set([...prev, stepId]))
            }
          }
        })
      },
      {
        threshold: 0.3,
        rootMargin: "0px 0px -50px 0px",
      },
    )

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  useEffect(() => {
    // Reset visible steps when tab changes
    setVisibleSteps(new Set())

    // Re-observe all step elements
    if (observerRef.current) {
      const stepElements = document.querySelectorAll("[data-step-id]")
      stepElements.forEach((el) => observerRef.current?.observe(el))
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [activeTab])

  const currentSteps = activeTab === "cpr" ? cprSteps : chokingSteps

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          Emergency First Aid Instructions
        </CardTitle>
        <CardDescription>
          Life-saving instructions that animate as you scroll. Practice these regularly.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("cpr")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "cpr"
                ? "bg-red-100 text-red-800 border border-red-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            CPR Instructions
          </button>
          <button
            onClick={() => setActiveTab("choking")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "choking"
                ? "bg-red-100 text-red-800 border border-red-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Choking Relief
          </button>
        </div>

        {/* Emergency Warning */}
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-800">Important</h4>
              <p className="text-sm text-red-700">
                These instructions are for reference only. Get proper first aid training. Always call 911 in
                emergencies.
              </p>
            </div>
          </div>
        </div>

        {/* Instructions Steps */}
        <div className="space-y-4">
          {currentSteps.map((step, index) => (
            <div
              key={step.id}
              data-step-id={step.id}
              className={`border rounded-lg p-4 transition-all duration-700 transform ${
                visibleSteps.has(step.id) ? "opacity-100 translate-y-0 scale-100" : "opacity-30 translate-y-4 scale-95"
              } ${step.critical ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"}`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    step.critical ? "bg-red-600 text-white" : "bg-blue-600 text-white"
                  }`}
                >
                  {index + 1}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-900">{step.title}</h3>
                    {step.critical && (
                      <Badge variant="destructive" className="text-xs">
                        Critical
                      </Badge>
                    )}
                    {step.duration && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {step.duration}
                      </div>
                    )}
                  </div>
                  <p className="text-gray-700">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Practice Reminder */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Practice Makes Perfect</h4>
          <p className="text-sm text-blue-700">
            Consider taking a certified CPR/First Aid course. Practice these steps regularly so you can act quickly in
            an emergency.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
