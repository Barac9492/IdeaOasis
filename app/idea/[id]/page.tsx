import { getIdea } from '@/lib/db';
import { notFound } from 'next/navigation';
import { IdeaDetailView } from '@/features/idea-detail/ui/IdeaDetailView';

export default async function IdeaDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const idea = await getIdea(params.id);
  
  if (!idea) {
    notFound();
  }
  
  return <IdeaDetailView idea={idea} />;
}