"use server"

import { createClient } from "@/libs/supabase"
import { revalidatePath } from "next/cache"

export async function updateProfile(prevState, formData) {
  const firstname = formData.get("firstname")?.trim()
  const lastname = formData.get("lastname")?.trim()
  const avatarFile = formData.get("avatar")

  if (!firstname || !lastname) {
    return { error: "First name and last name are required." }
  }

  try {
    const supabase = await createClient()

    // First retrieve current user key details to check auth
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return { error: "You must be logged in to update your profile metadata." }
    }

    const updates = {
      firstname,
      lastname,
    }

    let oldFilePathToDelete = null

    if (avatarFile && avatarFile.size > 0) {
      // 1MB = 1048576 bytes
      if (avatarFile.size > 1048576) {
        return { error: "Profile picture must be less than 1MB." }
      }

      // Track old avatar path if it was using supabase storage so we can delete it after new upload success
      const oldAvatarUrl = user.user_metadata?.avatar_url
      if (oldAvatarUrl && oldAvatarUrl.includes("/storage/v1/object/public/avatars/")) {
        const urlParts = oldAvatarUrl.split("/storage/v1/object/public/avatars/")
        if (urlParts.length > 1) {
          oldFilePathToDelete = urlParts[1]
        }
      }

      const fileExt = avatarFile.name.split('.').pop()
      const filePath = `${user.id}_${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, avatarFile, { upsert: true })

      if (uploadError) {
        return { error: `Failed to upload avatar: ${uploadError.message}` }
      }

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath)

      updates.avatar_url = publicUrl
    }

    const { data, error } = await supabase.auth.updateUser({
      data: updates,
    })

    if (error) {
      return { error: error.message }
    }

    // Clean up old avatar image file from storage if updated successfully
    if (oldFilePathToDelete) {
      await supabase.storage.from("avatars").remove([oldFilePathToDelete])
    }

    revalidatePath("/settings")
    return { success: "Profile updated successfully!", user: data.user }
  } catch (error) {
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function updatePassword(prevState, formData) {
  const currentPassword = formData.get("current_password")
  const password = formData.get("password")

  if (!currentPassword || !password) {
    return { error: "Both current and new password are required." }
  }

  try {
    const supabase = await createClient()

    // First retrieve current user key details to check auth
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return { error: "You must be logged in to update your password." }
    }

    // Verify current password
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    })

    if (signInError) {
      return { error: "Incorrect current password." }
    }

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: password
    })

    if (updateError) {
      return { error: updateError.message }
    }

    return { success: "Password updated successfully!" }
  } catch (error) {
    return { error: "An unexpected error occurred. Please try again." }
  }
}
