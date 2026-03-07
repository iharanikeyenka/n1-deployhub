import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Rocket, ArrowRightLeft, Hammer } from 'lucide-react';

interface ProjectCardProps {
  name: string;
}

export function ProjectCard({ name }: ProjectCardProps) {
  const handleAction = (action: string) => {
    toast.info(`Sending command ${action} for ${name} to Slack...`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Button onClick={() => handleAction('Full Deploy')} className="w-full">
          <Rocket className="mr-2 h-4 w-4" />
          Full Deploy
        </Button>
        <Button
          variant="secondary"
          onClick={() => handleAction('CMS Transfer')}
          className="w-full"
        >
          <ArrowRightLeft className="mr-2 h-4 w-4" />
          CMS Transfer
        </Button>
        <Button
          variant="outline"
          onClick={() => handleAction('Build')}
          className="w-full border-success text-success hover:bg-success/10"
        >
          <Hammer className="mr-2 h-4 w-4" />
          Build
        </Button>
      </CardContent>
    </Card>
  );
}
