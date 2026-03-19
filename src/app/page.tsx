import ClubSection from "~/components/home/club-section";
import EventsSection from "~/components/home/events-section";
import HeroSection from "~/components/home/hero-section";
import NewsSection from "~/components/home/news-section";
import { HydrateClient } from "~/trpc/server";

export default function HomePage() {
  return (
    <HydrateClient>
      <div className="space-y-10 pb-2 sm:space-y-14">
        <HeroSection />
        <NewsSection />
        <EventsSection />
        <ClubSection />
      </div>
    </HydrateClient>
  );
}
