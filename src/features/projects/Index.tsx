import { useParams } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Project from "@/features/projects/Project";
import Service from "@/features/projects/Service";
import Template from "@/features/projects/Template";

const Index = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="min-h-screen flex items-start justify-center py-10 px-4">
      <div className="w-full">
        <Tabs defaultValue="project" className="w-6xl mx-auto">
          <TabsList className="mb-6 w-100">
            <TabsTrigger value="project">Project</TabsTrigger>
            <TabsTrigger value="service">Service</TabsTrigger>
            <TabsTrigger value="template">Template</TabsTrigger>
          </TabsList>

          <div>
            <TabsContent value="project">
              <Project id={id!} />
            </TabsContent>
            <TabsContent value="service">
              <Service />
            </TabsContent>
            <TabsContent value="template">
              <Template />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
