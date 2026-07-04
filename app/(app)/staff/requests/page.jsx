import { createClient } from "@/libs/supabase"
import { createAdminClient } from "@/libs/adminClient"
import { redirect } from "next/navigation"
import RequestList from "./RequestList"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function StaffRequestsPage() {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) redirect("/login")
        
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
    if (profile?.role !== "admin" && profile?.role !== "staff") {
        return <div className="p-8 text-center"><h1 className="text-2xl font-bold text-danger">Unauthorized</h1></div>
    }

    // Fetch pending bookings with associated room
    const { data: rawBookings, error } = await supabase
        .from("bookings")
        .select(`
            id, start_time, end_time, status, created_at,
            rooms ( name, price_per_hour ),
            user_id
        `)
        .eq("status", "pending")
        .order("created_at", { ascending: true })

    if (error) {
        return <div className="p-10 text-danger">Error: {error.message}</div>
    }

    // Fetch all auth users to map names/emails
    const adminSupabase = createAdminClient()
    const { data: { users: authUsers }, error: usersError } = await adminSupabase.auth.admin.listUsers()

    if (usersError) {
        return <div className="p-10 text-danger">Error loading user profiles: {usersError.message}</div>
    }

    const bookings = (rawBookings || []).map((booking) => {
        const u = authUsers?.find((user) => user.id === booking.user_id)
        return {
            ...booking,
            profiles: {
                first_name: u?.user_metadata?.firstname || "",
                last_name: u?.user_metadata?.lastname || "",
                email: u?.email || "",
            }
        }
    })

    return (
        <div className="max-w-5xl mx-auto px-6 py-10">
            <div className="flex items-center gap-6 mb-8 border-b border-border pb-4">
                <h1 className="font-sans text-3xl font-bold text-navy">คำขอจองห้อง (Requests)</h1>
                <Link href="/staff/checkin" className="text-sm font-medium text-teal hover:underline mt-2">
                    → ไปที่หน้าเช็คอิน (หน้าจัดการลูกค้าเช็คอิน)
                </Link>
            </div>

            <RequestList bookings={bookings} />
        </div>
    )
}

