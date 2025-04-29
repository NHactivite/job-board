"use client"

import Link from "next/link"
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-gradient-to-tr from-slate-900 to-slate-800 text-white py-10 mt-10  ">
      <div className="max-w-6xl mx-auto px-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4 relative inline-block">
              Company
              <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-violet-400"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="hover:text-violet-400 transition-colors duration-300 flex items-center gap-2">
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/membership"
                  className="hover:text-violet-400 transition-colors duration-300 flex items-center gap-2"
                >
                  Membership
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-violet-400 transition-colors duration-300 flex items-center gap-2">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-violet-400 transition-colors duration-300 flex items-center gap-2">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4 relative inline-block">
              Support
              <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-violet-400"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="hover:text-violet-400 transition-colors duration-300 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-violet-400 transition-colors duration-300 flex items-center gap-2">
                  Services
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-violet-400 transition-colors duration-300 flex items-center gap-2">
                  Help Center
                </Link>
              </li>
              <li className="pt-2">
                <div className="flex items-center gap-2 text-slate-400">
                  <Phone className="w-4 h-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
              </li>
              <li>
                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin className="w-4 h-4" />
                  <span>123 Job Street, Career City</span>
                </div>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4 relative inline-block">
              Connect
              <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-violet-400"></span>
            </h3>
            <p className="text-slate-400 mb-4">
              Follow us on social media and stay updated with the latest opportunities.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="bg-slate-800 p-2 rounded-full hover:bg-violet-500 transition-colors duration-300"
              >
                <Facebook className="w-5 h-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="#"
                className="bg-slate-800 p-2 rounded-full hover:bg-violet-500 transition-colors duration-300"
              >
                <Twitter className="w-5 h-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="#"
                className="bg-slate-800 p-2 rounded-full hover:bg-violet-500 transition-colors duration-300"
              >
                <Instagram className="w-5 h-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="#"
                className="bg-slate-800 p-2 rounded-full hover:bg-violet-500 transition-colors duration-300"
              >
                <Linkedin className="w-5 h-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>

            {/* <div className="mt-6 pt-6 border-t border-slate-700">
              <h4 className="text-sm font-medium mb-3">Subscribe to our newsletter</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="bg-slate-800 text-white px-4 py-2 rounded-l-md w-full focus:outline-none focus:ring-1 focus:ring-violet-400"
                />
                <button className="bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-r-md transition-colors duration-300">
                  Subscribe
                </button>
              </div>
            </div> */}
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
          <div>© {new Date().getFullYear()} Jobs Portal. Built with passion by awesome minds.</div>
          <div className="mt-4 md:mt-0">
            <Link href="#" className="hover:text-violet-400 transition-colors">
              Sitemap
            </Link>
            <span className="mx-2">•</span>
            <Link href="#" className="hover:text-violet-400 transition-colors">
              Careers
            </Link>
            <span className="mx-2">•</span>
            <Link href="#" className="hover:text-violet-400 transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
