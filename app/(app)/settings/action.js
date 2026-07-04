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

    if (avatarFile && avatarFile.size > 0) {
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

    revalidatePath("/settings")
    return { success: "Profile updated successfully!", user: data.user }
  } catch (error) {
    return { error: "An unexpected error occurred. Please try again." }
  }
}
