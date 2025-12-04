import BotControls from "@/components/BotControls";
import StatsDisplay from "@/components/StatsDisplay";

export default function Home() {
  return (
    <div className="space-y-8">
      <BotControls />
      <StatsDisplay />
    </div>
  );
}
