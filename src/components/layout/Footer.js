export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="h-auto sm:h-12 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm text-gray-500">

          {/* Left */}
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} Software House Management System
          </p>

          {/* Right */}
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">All Rights Reserved</span>
            <span className="text-gray-400">v1.0.0</span>
          </div>

        </div>
      </div>
    </footer>
  )
}
