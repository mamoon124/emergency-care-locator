# 🚨 Emergency Care Locator

A **React-based** web application that helps users find nearby emergency services and provides **life-saving first aid instructions** during critical situations.

---

## 🎯 Problem Statement

During medical emergencies or accidents, people often struggle to:

- Quickly locate nearby hospitals, ambulances, and blood banks
- Access critical first aid information when internet is poor
- Get step-by-step emergency instructions in high-stress situations
- Find emergency services when location services are disabled

---

## 🔥 Solution

Emergency Care Locator solves these problems by providing:

- ✅ Real-time location detection to find nearby emergency facilities  
- ✅ Visual map interface showing emergency services with distances  
- ✅ Offline-capable first aid instructions for CPR and choking relief  
- ✅ Network-aware functionality that adapts to connection quality  
- ✅ Scroll-based animated instructions for better learning retention  

---

## 🔌 Web APIs Implemented

### 1. 🌍 Geolocation API
- Detects user's real-time location with high accuracy  
- Calculates distances to nearby emergency facilities using Haversine formula  
- Handles permission errors and provides fallback options  
- Auto-locates user on application load  

### 2. 📡 Network Information API
- Monitors online/offline status in real-time  
- Detects connection speed and type (2G, 3G, 4G, WiFi)  
- Provides appropriate warnings for slow connections  
- Enables offline-first functionality with cached data  

### 3. 🎨 Canvas API
- Creates interactive visual map of emergency facilities  
- Plots user location and nearby services with custom markers  
- Draws connection lines showing distances to facilities  
- Implements responsive grid system and legend  
- Uses color coding for different facility types  

### 4. 👁️ Intersection Observer API
- Animates first-aid instruction steps as user scrolls  
- Creates engaging progressive disclosure of critical information  
- Smooth entrance animations that improve learning retention  
- Efficiently observes multiple elements without performance impact  

---

## ✨ Key Features

### 🏥 Emergency Services Locator
- Real-time location detection with GPS accuracy  
- Distance calculation to nearby hospitals, ambulances, blood banks  
- One-click calling to emergency services  
- Google Maps integration for directions  
- Sorted by proximity for quick decision making  

### 🗺️ Visual Emergency Map
- Canvas-based interactive map showing all nearby facilities  
- Color-coded markers (Red: Hospitals, Yellow: Ambulances, Dark Red: Blood Banks)  
- Distance indicators and connection lines  
- Responsive design that works on all screen sizes  
- Real-time updates based on user location  

### 📱 Offline Capabilities
- Network status monitoring with connection quality indicators  
- Cached emergency data available without internet  
- Offline first-aid instructions always accessible  
- Graceful degradation when services are unavailable  

### 🆘 Interactive First Aid Guide
- CPR instructions with step-by-step guidance  
- Choking relief techniques for emergency situations  
- Scroll-based animations using Intersection Observer  
- Critical step highlighting for life-saving actions  
- Duration indicators for each step  

### 🎯 Smart User Experience
- Responsive design optimized for mobile and desktop  
- Accessibility features with proper ARIA labels  
- Error handling for all API failures  
- Loading states and user feedback  
- Emergency contact integration  

---

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript  
- **Styling**: Tailwind CSS + shadcn/ui  
- **Framework**: Next.js 14 (App Router)  
- **Icons**: Lucide React  
- **APIs**: Native Web APIs (no external dependencies)  

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Modern browser with Web API support

### Installation

```bash
git clone https://github.com/yourusername/emergency-care-locator.git
cd emergency-care-locator
npm install
# or
yarn install

📱 Usage
Allow location access when prompted

View nearby facilities on the interactive map and list

Call emergency services directly from the app

Scroll through first aid guide

Works offline – critical instructions cached

🏗️ Project Structure

emergency-care-locator/
├── app/
│   ├── components/
│   │   ├── map-canvas.tsx              # Canvas API implementation
│   │   ├── emergency-services.tsx      # Services list with calling
│   │   ├── first-aid-instructions.tsx  # Intersection Observer animations
│   │   └── network-status.tsx          # Network Information API
│   ├── page.tsx                        # Main app with Geolocation API
│   ├── layout.tsx                      # App layout
│   └── globals.css                     # Global styles
├── components/ui/                      # shadcn/ui components
├── lib/
│   └── utils.ts                        # Utility functions
└── README.md

🔧 API Implementation Details
Geolocation API
navigator.geolocation.getCurrentPosition(
  (position) => {
    const location = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    }
    // Calculate distances and update UI
  },
  (error) => {
    // Handle permission denied, unavailable, timeout
  },
  {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 300000,
  }
)

Network Information API
const connection = navigator.connection
connection.addEventListener('change', () => {
  // Update UI based on connection quality
  // Show offline fallbacks when needed
})

Canvas API
const canvas = canvasRef.current
const ctx = canvas.getContext('2d')

// Plot user location and facilities
// Draw connection lines and distance markers

Intersection Observer API
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Animate first aid instruction steps
      }
    })
  },
  { threshold: 0.3, rootMargin: '0px 0px -50px 0px' }
)

🌟 Features Showcase
✅ GPS-based location detection

✅ Distance calculation and sorting

✅ Canvas-based visual emergency map

✅ Offline-first emergency aid

✅ Scroll-based animated instructions

🎯 Real-World Impact
⏱️ Saves Time: Instantly locates nearest emergency services

❤️ Saves Lives: Offline CPR and first aid

🧠 Reduces Panic: Step-by-step instructions

🌍 Universal Access: Works without internet

🔮 Future Enhancements
📡 Real API Integration

🧾 Store medical history and allergies

🌐 Multi-language support

🎙️ Voice instructions

📱 Emergency contact access

🆔 Medical ID integration

📄 License
This project is licensed under the MIT License – see the LICENSE file for details.

