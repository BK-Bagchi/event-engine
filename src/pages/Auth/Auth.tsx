import { useState } from "react";
import banner from "@/assets/event-engine-banner.png";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@components/ui/tabs";
import Login from "@pages/Auth/Login";
import Register from "@pages/Auth/Register";
import ForgotPassword from "@pages/Auth/ForgotPassword";

const Auth = () => {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="h-[90vh] bg-bg-main flex items-center justify-center px-4">
      <div className="w-full max-w-md flex flex-col items-center">
        <img
          src={banner}
          alt="Event Engine"
          className="w-full mb-8 object-contain"
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="login" className="flex-1">
              Login
            </TabsTrigger>
            <TabsTrigger value="register" className="flex-1">
              Register
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-4">
            <Login {...{ setActiveTab }} />
          </TabsContent>

          <TabsContent value="register" className="mt-4">
            <Register {...{ setActiveTab }} />
          </TabsContent>

          <TabsContent value="forgot-password" className="mt-4">
            <ForgotPassword {...{ setActiveTab }} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
