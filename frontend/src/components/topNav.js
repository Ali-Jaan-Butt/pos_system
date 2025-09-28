import { useState } from "react";
import { Link } from "react-router-dom";
function TopNav() {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center w-full bg-[#4caf50] px-10 py-4 text-white shadow-lg">
      {/* Logo / Brand */}
      <h1 className="text-2xl font-extrabold tracking-wider cursor-pointer flex items-center gap-2">
        🥛 <span className="text-white">S&R Traders</span>
      </h1>

      {/* Navigation */}
      <ul className="flex gap-x-8 relative font-medium my-auto">
        {/* Home */}
        <li>
          <Link to="/dashboard">
            <button className="hover:text-[#fffbea] transition">Home</button>
          </Link>
        </li>

        {/* Products */}
        <li>
          <Link to="/dashboard/products">
            <button className="hover:text-[#fffbea] transition">Products</button>
          </Link>
        </li>

        {/* Stock Dropdown */}
        <li className="relative group">
          <Link to="/dashboard/stock">
            <button
              className="flex items-center gap-1 hover:text-[#fffbea] transition"
            >
              Stock
            </button>
          </Link>
        </li>

        {/* About Dropdown */}
        <li className="relative group">
          <button
            onClick={() => toggleDropdown("about")}
            className="flex items-center gap-1 hover:text-[#fffbea] transition"
          >
            About Us
            <span className="text-sm">▼</span>
          </button>
          {openDropdown === "about" && (
            <ul className="absolute left-0 mt-3 w-48 bg-white text-gray-800 rounded-xl shadow-xl overflow-hidden animate-fadeIn">
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Company Info
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Our Team
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Careers
              </li>
            </ul>
          )}
        </li>


      </ul>

      {/* Logout Button */}
      <div>
        <button className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-lg shadow-md font-semibold transition">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default TopNav;
