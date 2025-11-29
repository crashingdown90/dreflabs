'use client'

import React from 'react'
import { BentoGrid, BentoGridItem } from '@/components/ui/BentoGrid'
import {
    IconClipboardCopy,
    IconFileBroken,
    IconSignature,
    IconTableColumn,
} from '@tabler/icons-react'
import ScrollReveal from '@/components/animations/ScrollReveal'
import Image from 'next/image'

export default function BentoFeaturedProjects() {
    return (
        <section className="relative py-20 md:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <ScrollReveal>
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-white mb-4">
                            Featured Projects
                        </h2>
                        <div className="w-20 h-1 bg-gradient-primary mx-auto mb-6"></div>
                        <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
                            A selection of key projects demonstrating expertise in Big Data, AI, and Digital
                            Transformation.
                        </p>
                    </div>
                </ScrollReveal>

                <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[20rem]">
                    {items.map((item, i) => (
                        <BentoGridItem
                            key={i}
                            title={item.title}
                            description={item.description}
                            header={item.header}
                            className={i === 3 || i === 6 ? 'md:col-span-2' : ''}
                            icon={item.icon}
                        />
                    ))}
                </BentoGrid>
            </div>
        </section>
    )
}

const Skeleton = ({ img }: { img: string }) => (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl overflow-hidden relative">
        <Image
            src={img}
            alt="project-image"
            fill
            className="object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/20 hover:bg-transparent transition-colors duration-300" />
    </div>
)

const items = [
    {
        title: 'National Data Center',
        description: 'Architecting the national big data infrastructure for government.',
        header: <Skeleton img="/images/projects/project1.jpg" />, // Placeholder
        icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
    },
    {
        title: 'AI Traffic Control',
        description: 'Smart city solution using computer vision for traffic management.',
        header: <Skeleton img="/images/projects/project2.jpg" />, // Placeholder
        icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
    },
    {
        title: 'Cyber Defense Grid',
        description: 'Enterprise-grade security monitoring system.',
        header: <Skeleton img="/images/projects/project3.jpg" />, // Placeholder
        icon: <IconSignature className="h-4 w-4 text-neutral-500" />,
    },
    {
        title: 'E-Gov Super App',
        description:
            'Integrated public service application serving millions of citizens. Features biometric auth and secure payments.',
        header: <Skeleton img="/images/projects/project4.jpg" />, // Placeholder
        icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
    },
]
