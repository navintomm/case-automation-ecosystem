# Project CASE
**Case Automation & Smart Ecosystem**

An intelligent, premium legal drafting and workflow management workspace built with **Expo, React Native (Web), and Zustand**. 

This application provides a role-based environment customized for **Advocates, Clerks, and System Administrators**, featuring a unified, modern "Navy & Gold" aesthetic suitable for a high-end legal firm or government portal.

## 🌟 Key Features

- **Role-Based Portals:**
  - **Advocate:** Draft legal documents, manage active matters, allocate tasks, and receive AI-driven advisor recommendations.
  - **Clerk:** View and manage assigned filing tasks through a clean, swipe-to-delete Kanban-style interface.
  - **Administrator:** Manage user access, monitor system health, and build/update the knowledge repository.
  
- **Intelligent Drafting Workflow:**
  - A comprehensive 4-step wizard for case drafting (Jurisdiction, Evidence/Documents, Strategy & Prayers, Verification).
  - Built-in UI components tailored for legal inputs (e.g., dynamic "Party" cards, Prayer Builders, and Case Date Pickers).
  
- **Optimized for Web & Mobile:**
  - Fully responsive grid layouts.
  - Fluid animations via `react-native-reanimated`.
  - Elegant typography using Google Fonts (DM Serif Display & Inter).

- **State Management:**
  - Highly modularized local state utilizing `Zustand`.
  - Stores implemented: `caseStore`, `clerkStore`, `advisorStore`, `adminStore`, `mattersStore`, and `notificationsStore`.

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/navintomm/case-automation-ecosystem.git
   cd "case-automation-ecosystem"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npx expo start -c
   ```
   *(Press `w` to open the app in your web browser, or access it directly at `http://localhost:8081`)*

## 📦 Deployment (Vercel)

This application is fully compatible with Vercel for fast, scalable web hosting. 

1. Ensure the Vercel CLI is installed (`npm i -g vercel`).
2. Build the production web bundle:
   ```bash
   npx expo export -p web
   ```
3. Deploy the `dist` directory:
   ```bash
   vercel ./dist
   ```

## 🎨 Theme & Design System

The application strictly adheres to a predefined token system (`theme/tokens.ts`) ensuring visual consistency:
- **Primary Colors:** Deep Navy (`#1B2A4A`), Cream (`#FDFBF7`), Elegant Gold (`#C9963A`)
- **Typography:** DM Serif Display (Headings), Inter (Body & UI)
- **Geometry:** Subtle border radiuses (`radius.md`, `radius.lg`) combined with elevated drop shadows mimicking physical paper and premium dashboards.

## 🛠 Tech Stack

- **Framework:** [Expo](https://expo.dev/) (SDK 56) & [React Native](https://reactnative.dev/)
- **Routing:** [Expo Router](https://docs.expo.dev/router/introduction/) (File-based navigation)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Animations:** [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- **Icons:** Expo Vector Icons (`Ionicons`)

---
*Built for advocates. Controlled by advocates.*
