"use client"

import { useActionState, useState, useRef } from "react"
import { updateProfile } from "@/app/(app)/settings/action"

export default function SettingsForm({ initialUser }) {
  const [state, formAction, isPending] = useActionState(updateProfile, null)
  const [copied, setCopied] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)
  const fileInputRef = useRef(null)

  // Use state-based user metadata if successfully updated, otherwise initial user
  const user = state?.user || initialUser
  const metadata = user?.user_metadata || {}
  const firstname = metadata.firstname || ""
  const lastname = metadata.lastname || ""
  const role = metadata.role || "member"
  const avatarUrl = metadata.avatar_url || null
  const email = user?.email || ""
  const userId = user?.id || ""

  const initials = ((firstname?.[0] || "") + (lastname?.[0] || "")).toUpperCase() || "?"
  const displayAvatar = previewUrl || avatarUrl

  const handleCopyId = () => {
    navigator.clipboard.writeText(userId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Profile Overview Card */}
      <div className="lg:col-span-1 bg-surface border border-border/40 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center transition-all duration-300 hover:shadow-md">
        <div 
          className="relative group mb-4 cursor-pointer"
          onClick={handleAvatarClick}
          title="Click to change profile picture"
        >
          <div className="w-24 h-24 rounded-full bg-linear-to-tr from-navy to-teal flex items-center justify-center text-white text-3xl font-sans font-bold shadow-lg shadow-navy/10 group-hover:scale-[1.03] transition-transform duration-300 overflow-hidden">
            {displayAvatar ? (
               <img src={displayAvatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
               initials
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center text-white text-xs font-semibold backdrop-blur-[1px]">
              Upload
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-teal border-2 border-surface flex items-center justify-center shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
          </div>
        </div>

        <h3 className="font-sans font-bold text-lg text-navy">
          {firstname ? `${firstname} ${lastname}` : "Guest User"}
        </h3>
        <p className="text-sm text-zinc-500 mb-4">{email}</p>

        <div className="flex flex-col gap-2 w-full mt-4 border-t border-border/20 pt-4">
          <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-500 font-medium font-sans">Role Privilege:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-teal/10 text-teal font-semibold font-sans text-[11px] capitalize tracking-wide border border-teal/20">
              {role}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs mt-2">
            <span className="text-zinc-500 font-medium font-sans">Account ID:</span>
            <button
              onClick={handleCopyId}
              type="button"
              className="text-navy hover:text-teal font-mono text-[10px] bg-muted/60 px-2 py-0.5 rounded border border-border/20 flex items-center gap-1 transition-colors cursor-pointer"
              title="Click to copy ID"
            >
              {userId ? `${userId.substring(0, 8)}...${userId.substring(userId.length - 4)}` : "N/A"}
              {copied ? (
                <span className="text-teal font-sans text-[9px] font-bold">Copied!</span>
              ) : (
                <svg className="w-3 h-3 text-navy/40 group-hover:text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Edit Form Card */}
      <div className="lg:col-span-2 bg-surface border border-border/40 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-md">
        <h2 className="font-sans text-xl font-bold text-navy mb-1">Edit Profile</h2>
        <p className="text-xs text-zinc-500 mb-6">Update your public details and customize your profile metadata.</p>

        <form action={formAction} className="space-y-5">
          <input 
            type="file" 
            name="avatar" 
            accept="image/*" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstname" className="mb-1 block text-xs font-semibold text-navy">
                First Name
              </label>
              <input
                type="text"
                name="firstname"
                id="firstname"
                required
                defaultValue={firstname}
                className="w-full rounded-lg border border-border/50 bg-surface px-3 py-2 text-sm text-navy placeholder:text-zinc-400 focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal/40 transition-shadow duration-200"
                placeholder="John"
              />
            </div>
            <div>
              <label htmlFor="lastname" className="mb-1 block text-xs font-semibold text-navy">
                Last Name
              </label>
              <input
                type="text"
                name="lastname"
                id="lastname"
                required
                defaultValue={lastname}
                className="w-full rounded-lg border border-border/50 bg-surface px-3 py-2 text-sm text-navy placeholder:text-zinc-400 focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal/40 transition-shadow duration-200"
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-border/10">
            <div>
              <label className="mb-1 block text-xs font-semibold text-navy/55">
                Email Address (Read-only)
              </label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full rounded-lg border border-border/30 bg-muted/40 px-3 py-2 text-sm text-navy/60 cursor-not-allowed select-none"
              />
            </div>
          </div>

          {state?.error && (
            <div className="p-3 bg-danger/5 border border-danger/20 rounded-lg flex items-center gap-2">
              <svg className="w-4 h-4 text-danger shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs font-medium text-danger">{state.error}</p>
            </div>
          )}

          {state?.success && (
            <div className="p-3 bg-teal/5 border border-teal/20 rounded-lg flex items-center gap-2">
              <svg className="w-4 h-4 text-teal shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs font-medium text-teal">{state.success}</p>
            </div>
          )}

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2.5 rounded-lg bg-navy text-white text-sm font-semibold hover:bg-navy/95 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow cursor-pointer duration-200"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </span>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
