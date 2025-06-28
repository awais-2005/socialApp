"use client"

import { useRef } from "react"
import { ShieldCheck, Star, Users, Award, Zap, Clock } from "lucide-react"
import { useAnimeOnScroll } from "@/hooks/use-anime-on-scroll"

const trustFeatures = [
	{
		icon: ShieldCheck,
		title: "Secure & Confidential",
		description:
			"Your privacy is our top priority. All transactions are encrypted and anonymous.",
		color: "text-secondary",
	},
	{
		icon: Star,
		title: "Premium Quality",
		description:
			"High-quality engagement and genuine subscription accounts with full access.",
		color: "text-accent-pink",
	},
	{
		icon: Users,
		title: "500,000+ Happy Clients",
		description:
			"Join a growing community trusting us for social growth and entertainment needs.",
		color: "text-primary",
	},
	{
		icon: Award,
		title: "Money-Back Guarantee",
		description: "Not satisfied with your order? We offer a 100% money-back guarantee.",
		color: "text-accent-green",
	},
	{
		icon: Zap,
		title: "Instant Delivery",
		description:
			"Social media services start within minutes. Subscriptions activated immediately.",
		color: "text-secondary",
	},
	{
		icon: Clock,
		title: "24/7 Support",
		description:
			"Round-the-clock customer support for all your social and subscription needs.",
		color: "text-primary",
	},
]

const TrustCard = ({
	feature,
	index,
}: {
	feature: (typeof trustFeatures)[0]
	index: number
}) => {
	const cardRef = useRef<HTMLDivElement>(null)
	useAnimeOnScroll(cardRef as React.RefObject<HTMLElement>, {
		scale: [0.7, 1],
		opacity: [0, 1],
		duration: 800,
		delay: index * 150,
	})

	return (
		<div ref={cardRef} className="trust-card opacity-0 text-center p-6">
			<div
				className={`inline-flex p-4 bg-dark-gray rounded-full border border-white/10 mb-4 ${feature.color}`}
			>
				<feature.icon className="w-8 h-8" />
			</div>
			<h3 className="text-xl font-bold text-white mb-2">
				{feature.title}
			</h3>
			<p className="text-gray-400">{feature.description}</p>
		</div>
	)
}

export default function TrustSection() {
	const titleRef = useRef<HTMLDivElement>(null)
	useAnimeOnScroll(titleRef as React.RefObject<HTMLElement>, {
		translateY: [50, 0],
		opacity: [0, 1],
		duration: 1000,
	})

	return (
		<section id="about" className="py-24 px-4 bg-dark-gray/30">
			<div className="container mx-auto">
				<div ref={titleRef} className="text-center mb-16 opacity-0">
					<h2 className="text-4xl md:text-5xl font-extrabold text-white">
						Built on{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
							Trust
						</span>{" "}
						and{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent-pink">
							Quality
						</span>
					</h2>
					<p className="max-w-2xl mx-auto mt-4 text-lg text-gray-400">
						We are committed to providing reliable services that deliver real
						results for both social growth and entertainment access.
					</p>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
					{trustFeatures.map((feature, index) => (
						<TrustCard key={feature.title} feature={feature} index={index} />
					))}
				</div>
			</div>
		</section>
	)
}
