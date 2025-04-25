import ApiRepositoryDetail from '@/components/ApiRepositoryDetail';
import { sampleApiResponse } from '@/data/apiResponseData';

export default function SampleRepositoryPage() {
  return <ApiRepositoryDetail data={sampleApiResponse} />;
} 