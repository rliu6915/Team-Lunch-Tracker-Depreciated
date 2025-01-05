"use client";

import { useState, useEffect } from "react";
import { FaHistory, FaUsers } from "react-icons/fa";
import { useRouter } from 'next/navigation';

export default function HomeComponent(): JSX.Element {
  const [currentPayer, setCurrentPayer] = useState("");
  const [nextPayer, setNextPayer] = useState("");
  const [notification, setNotification] = useState<string | null>(null);
  const [restaurantName, setRestaurantName] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/payers")
      .then((res) => res.json())
      .then((data) => {
        setCurrentPayer(data.currentPayer);
        setNextPayer(data.nextPayer);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  }, []);

  // useEffect(() => {
  //   fetch("/api/payment")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setCurrentPayer(data.currentPayer);
  //       setNextPayer(data.nextPayer);
  //     });
  // }, []);

  const handleNext = async () => {
    if (!restaurantName || !paymentAmount) {
      setNotification("Please enter both restaurant name and payment amount.");
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    const isConfirmed = window.confirm("Are you sure you are paying today?");
    if (!isConfirmed) return;

    const res = await fetch("/api/payment", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ restaurantName, paymentAmount })
    });
    const data = await res.json();
    setCurrentPayer(data.currentPayer);
    setNextPayer(data.nextPayer);
    setNotification(`Shifted to ${data.currentPayer}. Next payer: ${data.nextPayer}`);
    setTimeout(() => setNotification(null), 3000);
    setRestaurantName("");
    setPaymentAmount("");
  };

  const renderPayerInfo = (title: string, payer: string) => (
    <div className="text-center">
      <p className="text-2xl font-semibold text-gray-800 mb-2">{title}</p>
      {isLoading ? (
        <p className="text-3xl font-bold text-gray-400">Loading...</p>
      ) : payer ? (
        <p className={`text-2xl font-bold ${title === "Current Payer" ? "text-indigo-600" : "text-teal-500"}`}>
          {payer}
        </p>
      ) : (
        <p className="text-2xl font-bold text-gray-500">No payer found</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-lg">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">
          🍽️ Lunch Payer Tracker
        </h1>

        {/* <div className="flex justify-between mb-8">
          <div className="text-center">
            <p className="text-2xl font-semibold text-gray-800 mb-2">
              Current Payer
            </p>
            <p className="text-3xl font-bold text-indigo-600">
              {currentPayer || "Loading..."}
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-gray-800 mb-2">
              Next Payer
            </p>
            <p className="text-3xl font-bold text-teal-500">
              {nextPayer || "Loading..."}
            </p>
          </div>
        </div> */}

        <div className="flex justify-between mb-8">
          {renderPayerInfo("Current Payer", currentPayer)}
          {renderPayerInfo("Next Payer", nextPayer)}
        </div>

        {/* <div className="mb-6">
          <input
            type="text"
            placeholder="Restaurant Name"
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
            className="w-full px-4 py-2 mb-4 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
          />
          <input
            type="number"
            placeholder="Payment Amount"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            className="w-full px-4 py-2 mb-4 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
          />
        </div> */}

        {currentPayer && !isLoading && (
          <>
            <div className="mb-6">
              <input
                type="text"
                placeholder="Restaurant Name"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className="w-full px-4 py-2 mb-4 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
              />
              <input
                type="number"
                placeholder="Payment Amount"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="w-full px-4 py-2 mb-4 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-3 rounded-xl text-xl font-medium transition-transform transform hover:scale-105 duration-300"
            >
              Pay now
            </button>

            <button
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-3 rounded-xl text-xl font-medium transition-transform transform hover:scale-105 duration-300"
            >
            Pay now
          </button>
          </>
        )}

        {/* <button
          onClick={handleNext}
          className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-3 rounded-xl text-xl font-medium transition-transform transform hover:scale-105 duration-300"
        >
          Pay now
        </button> */}

        {notification && (
          <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center">
            {notification}
          </div>
        )}

        <div className="flex justify-center space-x-6 mt-12">
          <a
            href="/payment-history"
            className="inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-teal-400 text-white px-6 py-3 rounded-full text-lg font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <FaHistory className="mr-2" />
            View History
          </a>

          <a
            href="/payers"
            className="inline-flex items-center justify-center bg-gradient-to-r from-pink-500 to-orange-400 text-white px-6 py-3 rounded-full text-lg font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <FaUsers className="mr-2" />
            View Payer
          </a>
        </div>
      </div>
    </div>
  );
}