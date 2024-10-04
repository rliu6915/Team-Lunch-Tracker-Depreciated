import Link from 'next/link';
import { FaHome, FaUsers, FaInfoCircle } from 'react-icons/fa'; // Import icons

export default function Navbar() {
  return (
    <nav className="bg-gray-900 p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <div className="text-white text-2xl font-bold flex items-center space-x-2">
          {/* <FaInfoCircle className="text-yellow-400" /> Icon for the logo */}
          <span>Team Lunch Tracker</span>
        </div>

        {/* Links Section */}
        <div className="space-x-4 flex">
          <Link href="/" className="group relative">
            <div className="text-white px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition duration-300 flex items-center space-x-2">
              <FaHome className="text-yellow-400" />
              <span className="group-hover:text-yellow-400 transition duration-300">Home</span>
            </div>
          </Link>

          <Link href="/payment-history" className="group relative">
            <div className="text-white px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition duration-300 flex items-center space-x-2">
              <FaUsers className="text-yellow-400" />
              <span className="group-hover:text-yellow-400 transition duration-300">History</span>
            </div>
          </Link>

          <Link href="/payers" className="group relative">
            <div className="text-white px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition duration-300 flex items-center space-x-2">
              <FaInfoCircle className="text-yellow-400" />
              <span className="group-hover:text-yellow-400 transition duration-300">Payers</span>
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}