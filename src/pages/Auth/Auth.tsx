import banner from "@assets/event-engine-banner.png";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@components/ui/tabs";
import Login from "./Login";
import Register from "./Register";

const Auth = () => {
  return (
    <div className="min-h-screen bg-bg-main flex flex-col items-center justify-center px-4">
      <img
        src={banner}
        alt="Event Engine"
        className="w-full max-w-md mb-8 object-contain"
      />

      <Tabs defaultValue="login" className="w-full max-w-md">
        <TabsList className="w-full">
          <TabsTrigger value="login" className="flex-1">
            Login
          </TabsTrigger>
          <TabsTrigger value="register" className="flex-1">
            Register
          </TabsTrigger>
        </TabsList>

        <TabsContent value="login" className="mt-4">
          <Login />
        </TabsContent>

        <TabsContent value="register" className="mt-4">
          <Register />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Auth;
