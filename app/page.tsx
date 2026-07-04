import Image from "next/image";
import Navbar from "@/components/ui/Navbar";

export default function Home() {
  return (
     <div className="flex flex-col min-h-screen bg-surface">
      
      <Navbar />

      <div className="flex flex-col items-center text-center py-12 px-6 bg-muted">
        
        <span className="text-xs bg-teal text-navy px-3 py-1 rounded-md mb-4">
          real-time room availability
        </span>
        <h1 className="text-3xl font-semibold text-navy max-w-md mb-3">
          book a room in seconds
        </h1>
        <p className="text-base text-zinc-600 max-w-md mb-6">
          see live availability, reserve a meeting room or desk, upload your
          payment slip, and track your bookings — all in one place.
        </p>
        <div className="flex gap-3">
          <button className="bg-navy text-white text-sm px-5 py-2.5 rounded font-medium">
            get started
          </button>
          <button className="border border-navy text-navy text-sm px-5 py-2.5 rounded">
            see how it works
          </button>
        </div>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border py-12 px-6">
        <div className="bg-surface flex flex-col items-center text-center p-6">
          <h3 className="text-sm font-medium text-navy mb-1">
            live availability
          </h3>
          <p className="text-xs text-zinc-600">
            no more double-booked rooms
          </p>
        </div>
        <div className="bg-surface flex flex-col items-center text-center p-6">
          <h3 className="text-sm font-medium text-navy mb-1">
            slip upload
          </h3>
          <p className="text-xs text-zinc-600">
            pay and confirm in one flow
          </p>
        </div>
        <div className="bg-surface flex flex-col items-center text-center p-6">
          <h3 className="text-sm font-medium text-navy mb-1">
            role-based access
          </h3>
          <p className="text-xs text-zinc-600">
            admins, staff and members, separated
          </p>
        </div>
      </section>
    
    
    </div>
  );
}
