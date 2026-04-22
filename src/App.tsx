import { BrowserRouter } from "react-router-dom";
import AppRouter from "@/router";
import { Toaster } from "@components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster />
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
