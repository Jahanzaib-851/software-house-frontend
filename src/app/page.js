"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FiUsers,
  FiUserCheck,
  FiClock,
  FiDollarSign,
  FiBriefcase,
  FiHome,
  FiBox,
  FiUser,
  FiBell,
  FiActivity,
  FiFileText,
  FiSettings,
  FiShield,
  FiLogIn,
  FiUserPlus,
} from "react-icons/fi";

/* ================= MODULES ================= */
const modules = [
  { label: "Authentication", href: "/auth/login", icon: FiShield },
  { label: "Users", href: "/dashboard/users", icon: FiUser },
  { label: "Employees", href: "/dashboard/employees", icon: FiUsers },
  { label: "Attendance", href: "/dashboard/attendance", icon: FiClock },
  { label: "Payroll", href: "/dashboard/payroll", icon: FiDollarSign },
  { label: "Clients", href: "/dashboard/clients", icon: FiUserCheck },
  { label: "Projects", href: "/dashboard/projects", icon: FiBriefcase },
  { label: "Rooms", href: "/dashboard/rooms", icon: FiHome },
  { label: "Assets", href: "/dashboard/assets", icon: FiBox },
  { label: "Finance", href: "/dashboard/finance", icon: FiDollarSign },
  { label: "Notifications", href: "/dashboard/notifications", icon: FiBell },
  { label: "Activities", href: "/dashboard/activities", icon: FiActivity },
  { label: "Reports", href: "/dashboard/reports", icon: FiFileText },
  { label: "Settings", href: "/dashboard/settings", icon: FiSettings },
];

/* ================= IMAGES ================= */
const logoPath = "/images/logo.png";
const bannerPath = "/images/banner.png";

/* ================= PAGE ================= */
export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-800 via-blue-700 to-purple-700 text-white">

        {/* NAVBAR */}
        <nav className="relative z-10 max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-white/15 backdrop-blur rounded-xl shadow-lg">
              <Image
                src={logoPath}
                alt="Software House Logo"
                width={48}
                height={48}
                priority
                className="rounded-lg"
              />
            </div>
            <span className="text-lg sm:text-xl font-bold tracking-wide">
              Software House Management
            </span>
          </div>

          <div className="hidden md:flex gap-4">
            <Link
              href="/auth/login"
              className="flex items-center gap-1 border border-white/60 px-4 py-2 rounded-lg hover:bg-white hover:text-indigo-700 transition"
            >
              <FiLogIn /> Login
            </Link>
            <Link
              href="/auth/register"
              className="flex items-center gap-1 bg-white text-indigo-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              <FiUserPlus /> Register
            </Link>
          </div>
        </nav>

        {/* HERO CONTENT */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pt-12 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* TEXT */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
          >
            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold leading-tight mb-6">
              Enterprise-Grade <br />
              Software House Management
            </h1>

            <p className="text-indigo-100 text-base sm:text-lg mb-8 max-w-xl">
              One powerful system to manage employees, attendance, payroll,
              projects, assets, finance, reports and notifications —
              securely and efficiently.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/dashboard"
                className="bg-white text-indigo-700 font-semibold px-8 py-3 rounded-xl shadow-xl hover:bg-gray-100 transition text-center"
              >
                Go to Dashboard
              </Link>
              <Link
                href="#modules"
                className="border border-white/70 px-8 py-3 rounded-xl hover:bg-white hover:text-indigo-700 transition text-center"
              >
                Explore Modules
              </Link>
            </div>
          </motion.div>

          {/* BANNER */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9 }}
            className="relative"
          >
            <div className="
              relative
              max-w-[520px] lg:max-w-[620px] xl:max-w-[700px]
              mx-auto
            ">
              <Image
                src={bannerPath}
                alt="Dashboard Preview"
                width={900}
                height={600}
                priority
                className="
                  w-full h-auto
                  rounded-3xl
                  shadow-[0_40px_120px_rgba(0,0,0,0.35)]
                "
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= MODULES ================= */}
      <section id="modules" className="py-20 px-4 sm:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-14">
            Core Features & Modules
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {modules.map(({ label, href, icon: Icon }, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 260 }}
                className="
                  bg-white
                  rounded-2xl
                  shadow-md
                  hover:shadow-2xl
                  p-6
                "
              >
                <Link href={href} className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-indigo-100">
                    <Icon className="text-indigo-600 text-3xl" />
                  </div>
                  <p className="text-lg font-semibold">{label}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="bg-gradient-to-r from-indigo-700 to-blue-700 text-white py-20 px-4 sm:px-8 text-center">
        <h3 className="text-3xl sm:text-4xl font-bold mb-4">
          Build. Manage. Scale.
        </h3>
        <p className="text-indigo-100 max-w-2xl mx-auto mb-8">
          A complete management platform designed for modern software houses.
        </p>
        <Link
          href="/auth/register"
          className="inline-block bg-white text-indigo-700 px-10 py-4 rounded-xl font-semibold shadow-xl hover:bg-gray-100 transition"
        >
          Start Free Trial
        </Link>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-gray-900 text-gray-300 text-center py-8 text-sm">
        <div>© {new Date().getFullYear()} Software House Management</div>
        <div className="mt-1">
          📞 0312-3011213 | ✉️ jahanzaibhassab851@gmail.com
        </div>
      </footer>
    </div>
  );
}
