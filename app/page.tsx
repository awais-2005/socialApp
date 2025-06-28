import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import ServicesSection from "@/components/services-section"
import TrustSection from "@/components/trust-section"
import Footer from "@/components/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-rich-black text-gray-100 font-sans">
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50rem] h-[50rem] bg-primary/10 rounded-full filter blur-3xl opacity-50 animate-pulse-slow"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50rem] h-[50rem] bg-accent-pink/10 rounded-full filter blur-3xl opacity-50 animate-pulse-slow animation-delay-4000"></div>
        <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-secondary/5 rounded-full filter blur-3xl opacity-30 animate-pulse-slow animation-delay-2000"></div>
      </div>
      <main className="relative z-10 w-full">
        <Header />
        <HeroSection />
        <ServicesSection />
        <TrustSection />
        <Footer />
      </main>
    </div>
  )
}
