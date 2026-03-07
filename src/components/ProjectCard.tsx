import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Rocket, ArrowRightLeft, Hammer, GitBranch } from "lucide-react";
import { sendSlackCommand } from "@/lib/slack";

interface ProjectCardProps {
  id: string;
  name: string;
}

export function ProjectCard({ id, name }: ProjectCardProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleAction = async (action: string, label: string) => {
    setLoading(action);
    try {
      await sendSlackCommand(id, action);
      toast.success(`✅ ${label} sent for ${name}`);
    } catch (err: any) {
      toast.error(`❌ Failed: ${err.message}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Button
          onClick={() => handleAction("full_deploy", "Full Deploy")}
          className="w-full"
          disabled={!!loading}
        >
          <Rocket className="mr-2 h-4 w-4" />
          {loading === "full_deploy" ? "Sending..." : "🔴 Full Deploy"}
        </Button>
        <Button
          variant="secondary"
          onClick={() => handleAction("cms", "CMS Transfer")}
          className="w-full"
          disabled={!!loading}
        >
          <ArrowRightLeft className="mr-2 h-4 w-4" />
          {loading === "cms" ? "Sending..." : "🔴 CMS Transfer"}
        </Button>
        <Button
          variant="outline"
          onClick={() => handleAction("deploy_master", "Deploy Master")}
          className="w-full"
          disabled={!!loading}
        >
          <Rocket className="mr-2 h-4 w-4" />
          {loading === "deploy_master" ? "Sending..." : "🟠 Deploy Master"}
        </Button>
        <Button
          variant="outline"
          onClick={() => handleAction("deploy_develop", "Deploy Develop")}
          className="w-full border-yellow-400 text-yellow-600 hover:bg-yellow-50"
          disabled={!!loading}
        >
          <GitBranch className="mr-2 h-4 w-4" />
          {loading === "deploy_develop" ? "Sending..." : "🟡 Deploy Develop"}
        </Button>
      </CardContent>
    </Card>
  );
}
