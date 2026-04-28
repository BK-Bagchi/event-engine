import { useParams } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
//prettier-ignore
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import Information from "@/features/templates/Information";
import Body from "@/features/templates/Body";
import Config from "@/features/templates/Config";
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

  //   api response mock for template details
  //   template= message: "Template retrieved successfully",
  //     data: {
  //       id: template._id,
  //       userId: template.userId,
  //       projectId: template.projectId,
  //       serviceId: template.serviceId,
  //       name: template.name,
  //       description: template.description,
  //       category: template.category,
  //       status: template.status,
  //       subjectTemplate: template.subjectTemplate,
  //       htmlTemplate: template.htmlTemplate,
  //       textTemplate: template.textTemplate,
  //       variables: template.variables,
  //       deliveryConfig: template.deliveryConfig,
  //       autoReplyConfig: template.autoReplyConfig,
  //       saveSubmission: template.saveSubmission,
  //       webhookConfig: template.webhookConfig,
  //       createdAt: template.createdAt,
  //       updatedAt: template.updatedAt,
  //     },

  // this is the template schema for reference when building the UI{
  //   userId: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "User",
  //     required: true,
  //   },
  //   projectId: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Project",
  //     required: true,
  //   },
  //   serviceId: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Service",
  //   },
  //   name: String,
  //   templateKey: String, // e.g. "contact_form"
  //   description: String,
  //   status: {
  //     type: String, // ACTIVE, DRAFT, ARCHIVED
  //     enum: ["ACTIVE", "DRAFT", "ARCHIVED"],
  //     default: "DRAFT",
  //   },
  //   category: {
  //     type: String, // CONTACT, AUTO_REPLY, SUPPORT, BOOKING, CUSTOM
  //     enum: ["CONTACT", "AUTO_REPLY", "SUPPORT", "BOOKING", "CUSTOM"],
  //     default: "CUSTOM",
  //   },
  //   subjectTemplate: String,
  //   htmlTemplate: String,
  //   textTemplate: String,
  //   variables: [
  //     {
  //       type: String, // TEXT, EMAIL, TEXTAREA, NUMBER, SELECT, FILE
  //       enum: ["TEXT", "EMAIL", "TEXTAREA", "NUMBER", "SELECT", "FILE"],
  //       key: String, // name, email, message
  //       label: String,
  //       required: Boolean,
  //       placeholder: String,
  //       defaultValue: String,
  //       validation: {
  //         minLength: Number,
  //         maxLength: Number,
  //         regex: String,
  //         allowedValues: [String],
  //       },
  //     },
  //   ],
  //   deliveryConfig: {
  //     to: [String], // can contain static emails or variable placeholders
  //     cc: [String],
  //     bcc: [String],
  //     replyToField: String, // e.g. "email"
  //   },
  //   autoReplyConfig: {
  //     enabled: {
  //       type: Boolean,
  //       default: false,
  //     },
  //   },
  //   saveSubmission: {
  //     type: Boolean,
  //     default: true,
  //   },
  //   webhookConfig: {
  //     enabled: Boolean,
  //     webhookId: {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: "Webhook",
  //     },
  //   },
  // },

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
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
