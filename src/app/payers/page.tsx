"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FaTrashAlt, FaUserCircle, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { Payer } from "../../lib/paymentTracker";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";

export default function PayerManagement() {
  const [payers, setPayers] = useState<Payer[]>();
  const [payerName, setPayerName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch the list of payers from the API
  useEffect(() => {
    async function fetchPayers() {
      try {
        const res = await fetch("/api/payers");
        if (!res.ok) throw new Error("Failed to fetch payers");
        const data = await res.json();
        setPayers(data.payers);
        setLoading(false);
      } catch (err) {
        setError("Failed to load payer data.");
        setLoading(false);
      }
    }

    fetchPayers();
  }, []);

  // Handle adding a new payer
  const handleAddPayer = async (e: React.FormEvent) => {
    e.preventDefault();

    const newPayer = { id: uuidv4(), payerName: payerName, order: (payers?.length || 0) + 1 };

    try {
      const res = await fetch("/api/payers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPayer),
      });

      if (!res.ok) throw new Error("Failed to add payer");

      const addedPayer = await res.json();
      console.log(addedPayer);
      setPayers([...(payers || []), addedPayer]); // Update local state with new payer
      setPayerName(""); // Reset input field
      // router.push('/?refresh=' + new Date().getTime());
    } catch (err) {
      setError("Failed to add payer.");
    }
  };

  // Handle deleting a payer by ID
  const handleDeletePayer = async (id: string) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this payer?");
    if (!isConfirmed) return;

    try {
      const res = await fetch(`/api/payers/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete payer");

      // Remove the payer from the local state
      setPayers(payers.filter((payer) => payer.id !== id));
      // router.push('/?refresh=' + new Date().getTime());
    } catch (err) {
      setError("Failed to delete payer.");
    }
  };

  // Function to move payer up
  const movePayerUp = (index: number) => {
    if (index === 0) return; // Can't move the first item up
    const updatedPayers = [...payers];
    [updatedPayers[index], updatedPayers[index - 1]] = [updatedPayers[index - 1], updatedPayers[index]];
    setPayers(updatedPayers);
  };

  // Function to move payer down
  const movePayerDown = (index: number) => {
    if (index === payers.length - 1) return; // Can't move the last item down
    const updatedPayers = [...payers];
    [updatedPayers[index], updatedPayers[index + 1]] = [updatedPayers[index + 1], updatedPayers[index]];
    setPayers(updatedPayers);
  };

  if (loading) return <p>Loading payers...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto mt-12 p-6 bg-gray-100 rounded-lg shadow-xl">
      <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-8">Payer Management</h1>

      {/* Add Payer Form */}
      <form onSubmit={handleAddPayer} className="mb-10">
        <div className="relative mb-6">
          <input
            type="text"
            id="payerName"
            value={payerName}
            onChange={(e) => setPayerName(e.target.value)}
            placeholder="Enter payer name"
            className="w-full px-4 py-3 bg-white text-gray-900 placeholder-gray-500 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-300"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-400 to-green-400 text-white py-3 px-6 rounded-lg font-bold shadow-lg hover:from-blue-500 hover:to-green-500 transition-all duration-300"
        >
          Add Payer
        </button>
      </form>

      {/* Payer List */}
      <div className="space-y-6">
        {payers.length === 0 ? (
          <p className="text-gray-700 text-center">No payers found.</p>
        ) : (
          payers.map((payer, index) => (
            <div
              key={payer.id}
              className={`p-6 rounded-lg shadow-lg flex justify-between items-center transition-all duration-300 ${
                index === 0
                  ? "bg-green-100 border-2 border-green-500 hover:bg-green-50" // Highlight the top payer
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-4">
                <FaUserCircle className="text-blue-400 text-5xl" />
                <div>
                  <p className="text-xl font-bold text-gray-900">{payer.payerName}</p>
                </div>
              </div>

              {/* Order Badge */}
              <div className="flex items-center space-x-4">
                <span
                  className={`inline-block text-white font-bold text-sm px-4 py-2 rounded-full ${
                    index === 0
                      ? "bg-green-500" // Top payer gets a green order badge
                      : "bg-gray-400"
                  }`}
                >
                  {index + 1}
                </span>

                {/* Move Up Button */}
                <button
                  onClick={() => movePayerUp(index)}
                  disabled={index === 0}
                  className={`text-green-400 hover:text-green-600 transition duration-200 ${index === 0 && "opacity-50 cursor-not-allowed"}`}
                >
                  <FaArrowUp size={20} />
                </button>

                {/* Move Down Button */}
                <button
                  onClick={() => movePayerDown(index)}
                  disabled={index === payers.length - 1}
                  className={`text-green-400 hover:text-green-600 transition duration-200 ${index === payers.length - 1 && "opacity-50 cursor-not-allowed"}`}
                >
                  <FaArrowDown size={20} />
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => handleDeletePayer(payer.id)}
                  className="text-red-400 hover:text-red-600 transition duration-200"
                >
                  <FaTrashAlt size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Back to Home Button - Now at the Bottom */}
      <div className="mt-10">
        <Link href="/">
          <div className="inline-block bg-gradient-to-r from-purple-400 to-pink-400 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:from-purple-500 hover:to-pink-500 transition-all duration-300 w-full text-center">
            Back to Home
          </div>
        </Link>
      </div>
    </div>
  );
}