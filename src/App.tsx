import { BrowserRouter } from "react-router-dom";
import AppRouter from "@/router";
import { Toaster } from "@components/ui/sonner";

const App = () => {
  return (
    <BrowserRouter>
      <Toaster />
      <AppRouter />
    </BrowserRouter>
  );
};

export default App;
