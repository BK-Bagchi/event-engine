import { useParams } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Service from "@/features/services/Service";
import Templates from "@/features/services/Templates";
//prettier-ignore
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

const Index = () => {
  const { projectId, serviceId } = useParams<{
    projectId: string;
    serviceId: string;
  }>();

  //   empty state
  if (!projectId || !serviceId) {
    return (
      <Empty className="col-span-3 border-[#2A3550] bg-[#1A2235]/50">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <AlertCircle className="text-zinc-600" />
          </EmptyMedia>
          <EmptyTitle className="text-zinc-400">
            Project or Service not found
          </EmptyTitle>
          <EmptyDescription className="text-zinc-600">
            The project ID or service ID is missing or invalid. Please check the
            URL and try again.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="min-h-screen flex items-start justify-center py-10 px-4">
      <div className="w-full">
        <Tabs defaultValue="service" className="w-6xl mx-auto">
          <TabsList className="mb-6 w-100">
            <TabsTrigger value="service">Service</TabsTrigger>
            <TabsTrigger value="template">Templates</TabsTrigger>
          </TabsList>

          <div>
            <TabsContent value="service">
              <Service projectId={projectId} serviceId={serviceId} />
            </TabsContent>
            <TabsContent value="template">
              <Templates projectId={projectId} serviceId={serviceId} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
