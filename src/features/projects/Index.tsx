import { useParams } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Project from "@/features/projects/Project";
import Services from "@/features/projects/Services";
import Templates from "@/features/projects/Templates";
import IndexEmpty from "@/components/empty/IndexEmpty";

const Index = () => {
  const { id } = useParams<{ id: string }>();
  //   empty state
  if (!id)
    return (
      <IndexEmpty
        emptyTitle="Project not found"
        emptyDescription="The project ID is missing or invalid. Please check the URL and try again."
      />
    );

  return (
    <div className="min-h-screen flex items-start justify-center py-10 px-4">
      <div className="w-full">
        <Tabs defaultValue="project" className="w-6xl mx-auto">
          <TabsList className="mb-6 w-100">
            <TabsTrigger value="project">Project</TabsTrigger>
            <TabsTrigger value="service">Services</TabsTrigger>
            <TabsTrigger value="template">Templates</TabsTrigger>
          </TabsList>

          <div>
            <TabsContent value="project">
              <Project projectId={id} />
            </TabsContent>
            <TabsContent value="service">
              <Services projectId={id} />
            </TabsContent>
            <TabsContent value="template">
              <Templates projectId={id} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
