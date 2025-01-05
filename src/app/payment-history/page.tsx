"use client";  // Mark this as a Client Component
// /src/app/history/page.tsx
import PayerHistory from "../../components/PaymentHistory";
import { useRouter } from "next/navigation";  // Import useRouter from Next.js
import { FaArrowLeft } from "react-icons/fa";  // Import the back arrow icon

export default function HistoryPage() {
  const router = useRouter();  // Initialize the router

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-100 to-indigo-200">
      <h1 className="text-5xl font-extrabold text-gray-800 mb-10">
        Payer History
      </h1>

      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-4xl">
        <h2 className="text-3xl font-semibold mb-6 text-gray-700">
          Shifts Log
        </h2>

        {/* Reusable PayerHistory Component */}
        <PayerHistory />

        {/* Back to Home Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push("/")}  // Navigate back to the home page
            className="inline-flex items-center justify-center bg-gradient-to-r from-green-400 to-teal-500 text-white px-6 py-3 rounded-full text-lg font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300"
          >
            <FaArrowLeft className="mr-2" /> {/* Back arrow icon */}
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}