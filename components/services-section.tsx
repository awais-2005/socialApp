"use client"

import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import { useAnimeOnScroll } from "@/hooks/use-anime-on-scroll"
import ServiceModal from "./service-modal"
import { getCurrencyInfo } from "./header"
import servicePrices from "@/lib/service-prices.json"

// Define types for platforms and prices
type Platform = "Instagram" | "YouTube" | "Twitter" | "Facebook" | "TikTok";


const socialServices: SocialService[] = [
	{
		platform: "Instagram",
		iconUrl: "/instagram.png?width=40",
		color: "from-primary to-secondary",
		description: "Boost your profile with followers, likes, and views.",
		category: "social",
	},
	{
		platform: "YouTube",
		iconUrl: "/youtube.png?width=40",
		color: "from-secondary to-accent-green",
		description: "Increase subscribers, video views, and watch time.",
		category: "social",
	},
	{
		platform: "Twitter",
		iconUrl: "/twitter.png?width=40",
		color: "from-accent-green to-primary",
		description: "Amplify your voice with followers, retweets, and likes.",
		category: "social",
	},
	{
		platform: "Facebook",
		iconUrl: "/facebook.png?height=40&width=40",
		color: "from-accent-pink to-secondary",
		description: "Grow your page with likes, followers, and post engagement.",
		category: "social",
	},
	{
		platform: "TikTok",
		iconUrl: "/tiktok.png?height=40&width=40",
		color: "from-primary to-accent-pink",
		description: "Go viral with followers, likes, and video views.",
		category: "social",
	},
];

interface SocialService {
	platform: Platform;
	iconUrl: string;
	color: string;
	description: string;
	category: string;
}

interface ServiceCardProps {
	service: SocialService;
	index: number;
	openModal: (service: SocialService) => void;
	prices: Record<string, number>;
}

const ServiceCard = ({
	service,
	index,
	openModal,
	prices,
}: ServiceCardProps) => {
	const cardRef = useRef(null)
	const [isVisible, setIsVisible] = useState(false)

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true)
					observer.unobserve(entry.target)
				}
			},
			{ threshold: 0.1 },
		)

		if (cardRef.current) {
			observer.observe(cardRef.current)
		}

		return () => observer.disconnect()
	}, [])

	const selectedCountry = (typeof window !== "undefined" &&
		localStorage.getItem("selectedCountry")) || "US"
	const { symbol, rate } = getCurrencyInfo(selectedCountry)

	// Determine the first metric label and key
	let firstMetricLabel = "Followers";
	let firstMetricKey: string = "follower";
	if (service.platform === "YouTube") {
		firstMetricLabel = "Subscribers";
		firstMetricKey = "subscriber";
	}

	return (
		<div
			ref={cardRef}
			className="bg-dark-gray/50 border border-white/10 rounded-2xl p-6 backdrop-blur-xl overflow-hidden relative group hover:border-primary/50 hover:-translate-y-2 cursor-pointer min-h-[280px]"
			onClick={() => openModal(service)}
			style={{ transitionDelay: `${index * 100}ms` }}
		>
			<div className={`transition-all duration-1000 ease-out transform ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-16 scale-95"}`}>
				<div className="flex flex-col h-full">
					<div className="flex items-center gap-4 mb-4">
						<div className="w-10 h-10 flex-shrink-0 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center">
							<Image
								src={service.iconUrl || "/placeholder.svg"}
								alt={`${service.platform} icon`}
								width={32}
								height={32}
								className={`w-8 h-8 object-contain${service.platform === "Facebook" ? " rounded" : ""}`}
								onError={(e) => {
									const target = e.target as HTMLImageElement;
									target.style.display = "none";
									const parent = target.parentElement;
									if (parent) {
										parent.innerHTML = `<div class='w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm'>${service.platform.charAt(0)}</div>`;
									}
								}}
							/>
						</div>
						<div className="min-w-0 flex-1">
							<h3 className="text-xl font-bold text-white">
								{service.platform}
							</h3>
							<span className="text-xs text-secondary uppercase tracking-wider">
								Social Growth
							</span>
						</div>
					</div>
					<p className="text-gray-400 flex-grow mb-4 text-sm leading-relaxed">
						{service.description}
					</p>
					<div className="space-y-2">
						<div className="flex justify-between items-center text-sm">
							<span className="text-gray-400">{firstMetricLabel}</span>
							<span className="text-primary font-semibold">
								From {symbol}
								{prices[firstMetricKey] !== undefined ? (prices[firstMetricKey] * rate).toLocaleString(undefined, { maximumFractionDigits: 3 }) : "-"}
							</span>
						</div>
						<div className="flex justify-between items-center text-sm">
							<span className="text-gray-400">Likes</span>
							<span className="text-primary font-semibold">
								From {symbol}
								{prices.like !== undefined ? (prices.like * rate).toLocaleString(undefined, { maximumFractionDigits: 3 }) : "-"}
							</span>
						</div>
						<div className="flex justify-between items-center text-sm">
							<span className="text-gray-400">Views</span>
							<span className="text-primary font-semibold">
								From {symbol}
								{prices.view !== undefined ? (prices.view * rate).toLocaleString(undefined, { maximumFractionDigits: 3 }) : "-"}
							</span>
						</div>
					</div>
					<div className="mt-4 pt-4 border-t border-white/10">
						<div className="text-xs text-gray-500 text-center">
							Tap to configure and order
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default function ServicesSection() {
	const titleRef = useRef<HTMLElement | null>(null);
	const socialTitleRef = useRef<HTMLElement | null>(null);

	const [isModalOpen, setIsModalOpen] = useState(false)
	const [selectedService, setSelectedService] = useState<SocialService | null>(null)

	const openModal = (service: SocialService) => {
		setSelectedService(service)
		setIsModalOpen(true)
	}

	const closeModal = () => {
		setIsModalOpen(false)
		setSelectedService(null)
	}

	// Move useAnimeOnScroll to the top level, not inside useEffect or callbacks
	useAnimeOnScroll(titleRef as React.RefObject<HTMLElement>);
	useAnimeOnScroll(socialTitleRef as React.RefObject<HTMLElement>);

	return (
		<section id="services" className="w-full py-16 md:py-24 px-4">
			<div className="w-full max-w-7xl mx-auto">
				<div
					ref={titleRef as React.RefObject<HTMLDivElement>}
					className="text-center mb-12 md:mb-16 opacity-0"
				>
					<h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
						Everything You Need to{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
							Grow
						</span>
					</h2>
					<p className="max-w-2xl mx-auto text-base md:text-lg text-gray-400 px-4">
						Boost your social media presence across all major platforms with
						real engagement.
					</p>
				</div>

				{/* Social Media Services */}
				<div ref={socialTitleRef as React.RefObject<HTMLDivElement>} className="opacity-100">
					<h3 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center">
						Social Media Growth
					</h3>
					<p className="text-gray-400 mb-8 md:mb-12 text-sm md:text-base text-center">
						Boost your presence across all major platforms
					</p>

					{/* Responsive Grid Layout */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
						{socialServices.map((service, index) => {
							const platform = service.platform as Platform;
							return (
								<ServiceCard
									key={service.platform}
									service={service}
									index={index}
									openModal={openModal}
									prices={servicePrices[platform] || {}}
								/>
							);
						})}
					</div>
				</div>
			</div>
			<ServiceModal
				isOpen={isModalOpen}
				onClose={closeModal}
				service={selectedService}
			/>
		</section>
	)
}
