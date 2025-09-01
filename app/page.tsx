import { getDailyIdeas } from '@/lib/db';
import { DailyIdeasLanding } from '@/features/landing/ui/DailyIdeasLanding';

export default async function HomePage() {
  // Get today's 2 ideas with execution data
  const ideas = await getDailyIdeas();
  
  return <DailyIdeasLanding ideas={ideas} />;
}