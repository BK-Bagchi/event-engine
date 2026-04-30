import { useParams } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
//prettier-ignore
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import Information from "@/features/templates/Information";
import Body from "@/features/templates/Body";
import Config from "@/features/templates/Config";
import Workflow from "@/features/templates/Workflow";
import { useTemplate } from "@/hooks/queries/template";

const Index = () => {
  const { projectId, templateId } = useParams<{
    projectId: string;
    templateId: string;
  }>();

  const { template, loadingTemplate } = useTemplate({
    projectId: projectId!,
    templateId: templateId!,
  });

  //   empty state
  if (!projectId || !templateId) {
    return (
      <Empty className="col-span-3 border-[#2A3550] bg-[#1A2235]/50">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <AlertCircle className="text-zinc-600" />
          </EmptyMedia>
          <EmptyTitle className="text-zinc-400">
            Project or Template not found
          </EmptyTitle>
          <EmptyDescription className="text-zinc-600">
            The project ID or template ID is missing or invalid. Please check
            the URL and try again.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="min-h-screen flex items-start justify-center py-10 px-4">
      <div className="w-full">
        <Tabs defaultValue="information" className="w-6xl mx-auto">
          <TabsList className="mb-6 w-100">
            <TabsTrigger value="information">Information</TabsTrigger>
            <TabsTrigger value="body">Body</TabsTrigger>
            <TabsTrigger value="config">Config</TabsTrigger>
            <TabsTrigger value="workflow">Work Flow</TabsTrigger>
          </TabsList>
          <div>
            <TabsContent value="information">
              <Information {...{ template, loadingTemplate }} />
            </TabsContent>
            <TabsContent value="body">
              <Body {...{ template, loadingTemplate }} />
            </TabsContent>
            <TabsContent value="config">
              <Config {...{ template, loadingTemplate }} />
            </TabsContent>
            <TabsContent value="workflow">
              <Workflow {...{ template, loadingTemplate }} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
