import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import ErrorBoundary from "./components/ErrorBoundary";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home/Home";
import History from "./pages/History/History";
import AuthPage from "./pages/Auth/Auth";

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="history" element={<History />} />
            <Route path="auth" element={<AuthPage />} />
          </Route>
        </Routes>
        <Toaster richColors position="bottom-right" />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
