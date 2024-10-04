"use client";

import { useState, useEffect } from "react";
import { FaUserCircle, FaTrashAlt } from "react-icons/fa";  // Import delete and user icons

type PayerHistoryEntry = {
  paymentAmount: number;
  restaurantName: string;
  id: number;  // Assuming each entry has a unique ID
  payer: string;
  time: string;
};

export default function PayerHistory() {
  const [payerHistory, setPayerHistory] = useState<PayerHistoryEntry[]>([]);

  useEffect(() => {
    // Fetch payer history from the API
    fetch("/api/payment")
      .then((res) => res.json())
      .then((data) => {
        setPayerHistory(data.payerHistory);
      });
  }, []);

  // Function to delete a payer history entry
  const handleDelete = async (id: number) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this entry?");
    
    if (!isConfirmed) {
      return;  // If user cancels, do nothing
    }

    // Optionally, send a delete request to the server (if you have a backend API)
    await fetch(`/api/payment/${id}`, {
      method: "DELETE",
    });

    // Remove the item from the local state
    setPayerHistory((prevHistory) => prevHistory.filter((entry) => entry.id !== id));
  };

  if (payerHistory.length === 0) {
    return (
      <p className="text-gray-500 text-xl text-center">
        No shifts recorded yet.
      </p>
    );
  }

  return (
    <div className="relative">
      {/* Vertical line of the timeline */}
      <div className="absolute left-4 top-0 w-1 bg-gray-300 h-full"></div>

      <div className="space-y-8">
        {payerHistory.map((entry) => (
          <div
            key={entry.id}
            className="relative flex items-center space-x-4"
          >
            {/* Timeline marker */}
            <div className="absolute -left-3 top-0 z-10 bg-blue-500 h-6 w-6 rounded-full border-4 border-white"></div>

            {/* Timeline card */}
            <div className="ml-10 p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 ease-in-out w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Icon for Payer */}
                  <FaUserCircle className="text-gray-400 text-4xl" />
                  <div>
                    <p className="text-xl font-bold text-gray-800">{entry.payer}</p>
                    <p className="text-sm text-gray-500">{entry.time}</p>
                    <p className="text-md text-gray-700">🍽️ {entry.restaurantName}</p>
                    <p className="text-md font-semibold text-green-600">💰 ${entry.paymentAmount}</p>
                  </div>
                </div>
                {/* Delete button */}
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="text-red-500 hover:text-red-700 transition duration-200"
                >
                  <FaTrashAlt size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}