"use client"

import { logoutAction } from "@/lib/actions/auth"

type LogoutButtonProps = {
  className?: string
  children?: React.ReactNode
}

export function LogoutButton({ className, children }: LogoutButtonProps) {
  async function handleLogout() {
    // Clear Service Worker cache before logout
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      try {
        navigator.serviceWorker.controller.postMessage({ type: "CLEAR_CACHE" })

        // Wait a bit for the cache to be cleared
        await new Promise((resolve) => setTimeout(resolve, 100))
      } catch (error) {
        console.error("Failed to clear Service Worker cache:", error)
      }
    }

    // Perform logout action
    await logoutAction()
  }

  return (
    <button onClick={handleLogout} className={className}>
      {children || "Выйти"}
    </button>
  )
}
