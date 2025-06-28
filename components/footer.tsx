import Link from "next/link"
import { Rocket, Instagram, Twitter, Youtube, Twitch } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-dark-gray/50 border-t border-white/10 py-12 px-4">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-gray-400">
        <div className="col-span-1 md:col-span-1">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <Rocket className="w-7 h-7 text-primary" />
            <span className="text-2xl font-bold text-white">ViralVortex</span>
          </Link>
          <p className="text-sm">
            The future of social media growth. &copy; {new Date().getFullYear()}. All Rights Reserved.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-white mb-4">Services</h4>
          <ul className="space-y-2">
            <li>
              <Link href="#" className="hover:text-primary transition-colors">
                Instagram Growth
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primary transition-colors">
                YouTube Boost
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primary transition-colors">
                Twitter Engagement
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primary transition-colors">
                Twitch Expansion
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-white mb-4">Company</h4>
          <ul className="space-y-2">
            <li>
              <Link href="#" className="hover:text-primary transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primary transition-colors">
                Contact
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-white mb-4">Connect</h4>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-primary transition-colors">
              <Instagram />
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              <Twitter />
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              <Youtube />
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              <Twitch />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
