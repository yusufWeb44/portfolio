// demo.tsx

import {
  ServiceCarousel,
  type Service,
} from "@/components/ui/services-card";
import { Palette, Code, Search } from "lucide-react"; // Example icons

// Define the data for the services
const services: Service[] = [
  {
    number: "001",
    title: "Branding",
    description:
      "We craft logos and brand systems that leave a lasting impression.",
    icon: Palette,
    gradient: "from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50",
  },
  {
    number: "002",
    title: "Development",
    description:
      "Beautiful and functional websites built with purpose and precision.",
    icon: Code,
    gradient: "from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50",
  },
  {
    number: "003",
    title: "SEO Optimization",
    description:
      "Get found faster with tailored SEO strategies backed by real data.",
    icon: Search,
    gradient: "from-red-100 to-red-200 dark:from-red-900/50 dark:to-red-800/50",
  },
  {
    number: "004",
    title: "UI/UX Design",
    description:
      "Intuitive and engaging user interfaces designed for seamless user experiences.",
    icon: Palette,
    gradient: "from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50",
  },
];

// The demo component
export default function AnimatedServiceCardDemo() {
  return (
    <div className="w-full bg-background flex flex-col items-center justify-center p-8">
      <div className="text-left w-full max-w-6xl mb-12">
        <h1 className="text-6xl font-bold tracking-tighter">Services.</h1>
      </div>
      <ServiceCarousel services={services} />
    </div>
  );
}
