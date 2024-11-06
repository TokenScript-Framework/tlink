import { Chrome } from 'lucide-react'

export function InstallButton() {
  return (
    <a
      href="https://chromewebstore.google.com/detail/tlink/eblnpllcmmepkmpaalggpibindkplcjj"
      target="_blank"
      className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-400 to-cyan-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
    >
      <Chrome className="w-6 h-6" />
      <span className="text-lg">Install Tlink Extension</span>
    </a>
  )
}
