import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Parking Slots", path: "/parkingslots" },
    { name: "Bookings", path: "/bookings" },
    ...(user?.role === "admin"
      ? [{ name: "Admin Panel", path: "/admin-panel" }]
      : []),
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  };

  return (
    <>
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-linear-to-br from-[#191919] via-[#0f0f0f] to-[#191919] ${
          isScrolled
            ? "backdrop-blur-xl bg-[#191919]/90 border-b border-[#1B42CB]/20"
            : "backdrop-blur-lg bg-[#191919]/70"
        }`}
      >
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center group relative">
              <img
                src="/logo.png"
                alt="SmartPark"
                className="h-11 md:h-15 w-auto object-contain transition-all duration-300 group-hover:scale-110"
                style={{
                  filter:
                    "brightness(0) invert(1) drop-shadow(0 0 8px rgba(27,66,203,0.5))",
                }}
              />

              {/* Glow Effect - image ke peeche */}
              <div className="absolute inset-0 bg-linear-to-r from-[#1B42CB] to-[#FF2F6C] rounded-full blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-300 -z-10"></div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`relative px-6 py-3 rounded-xl font-medium transition-all duration-300 group ${
                    isActive(item.path)
                      ? "bg-linear-to-r from-[#1B42CB]/20 to-[#FF2F6C]/20 text-[#EEECF6]"
                      : "text-[#EEECF6]/70 hover:text-[#EEECF6] hover:bg-[#1B42CB]/10"
                  }`}
                >
                  <span className="relative z-10">{item.name}</span>
                  {isActive(item.path) && (
                    <div className="absolute inset-0 border border-[#1B42CB]/30 rounded-xl"></div>
                  )}
                  {!isActive(item.path) && (
                    <div className="absolute inset-0 border border-transparent group-hover:border-[#1B42CB]/20 rounded-xl transition-all duration-300"></div>
                  )}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-linear-to-r from-[#1B42CB] to-[#FF2F6C] group-hover:w-3/4 transition-all duration-300"></div>
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                // User dropdown
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-3 px-4 py-2 rounded-xl bg-[#191919] border border-[#1B42CB]/30 hover:bg-[#1B42CB]/10 transition-all duration-300 cursor-pointer"
                  >
                    <div className=" flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {user.name?.toUpperCase() || "USER"}
                      </span>
                    </div>

                    <svg
                      className={`w-4 h-4 text-[#EEECF6]/70 transition-transform duration-300 ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0"
                        onClick={() => setIsDropdownOpen(false)}
                      ></div>
                      <div className="absolute right-0 mt-2 w-48 rounded-xl backdrop-blur-xl bg-[#191919]/95 border border-[#1B42CB]/30 shadow-lg overflow-hidden z-50">
                        <div className="px-4 py-3 border-b border-[#1B42CB]/20">
                          <div className="text-sm font-medium text-[#EEECF6]">
                            {user.name}
                          </div>
                          <div className="text-xs text-[#EEECF6]/60">
                            {user.role === "admin" ? "Administrator" : "USER"}
                          </div>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center justify-between px-4 py-3 text-sm text-[#FF2F6C] hover:bg-[#FF2F6C]/10 transition-all duration-300"
                        >
                          <span>Logout</span>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="px-4 py-2 rounded-xl bg-[#191919] border border-[#1B42CB]/30 text-[#EEECF6] flex items-center justify-center hover:bg-[#1B42CB]/10 transition-all duration-300 cursor-pointer"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate("/signup")}
                    className="px-4 py-2 rounded-xl bg-linear-to-br from-[#1B42CB] to-[#FF2F6C] text-white flex items-center justify-center hover:shadow-lg hover:shadow-[#FF2F6C]/20 transition-all duration-300 cursor-pointer"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-xl bg-[#191919] border border-[#1B42CB]/30 flex items-center justify-center text-[#EEECF6]"
            >
              {isMobileMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden backdrop-blur-xl bg-[#191919]/95 border-t border-[#1B42CB]/20">
            <div className="px-4 pt-2 pb-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    isActive(item.path)
                      ? "bg-linear-to-r from-[#1B42CB]/20 to-[#FF2F6C]/20 text-[#EEECF6]"
                      : "text-[#EEECF6]/70 hover:text-[#EEECF6] hover:bg-[#1B42CB]/10"
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              <div className="pt-4 border-t border-[#1B42CB]/20">
                {user ? (
                  <>
                    {/* User Info */}
                    <div className="flex items-center space-x-3 px-4 py-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#1B42CB] to-[#FF2F6C] flex items-center justify-center">
                        <span className="text-white font-medium">
                          {user.name?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-[#EEECF6]">
                          {user.name}
                        </div>
                        <div className="text-xs text-[#EEECF6]/60">
                          {user.role === "admin" ? "Administrator" : "User"}
                        </div>
                      </div>
                    </div>

                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-[#191919] border border-[#FF2F6C]/30 text-[#FF2F6C] font-medium hover:bg-[#FF2F6C]/10 transition-all duration-300"
                    >
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  // Mobile menu when user is NOT logged in
                  <>
                    <button
                      onClick={() => {
                        navigate("/login");
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-[#191919] border border-[#1B42CB]/30 text-[#EEECF6] font-medium hover:bg-[#1B42CB]/10 transition-all duration-300 mb-2"
                    >
                      <span>Login</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate("/signup");
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-linear-to-r from-[#1B42CB] to-[#FF2F6C] text-white font-medium hover:shadow-lg hover:shadow-[#FF2F6C]/20 transition-all duration-300"
                    >
                      <span>Sign Up</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16 md:h-20"></div>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#1B42CB]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FF2F6C]/5 rounded-full blur-3xl"></div>
      </div>
    </>
  );
};

export default Navbar;
