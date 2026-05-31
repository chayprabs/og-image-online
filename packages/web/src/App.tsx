import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import LegalPage from "./pages/LegalPage";
import SeoLandingPage from "./pages/SeoLandingPage";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/privacy" element={<LegalPage kind="privacy" />} />
        <Route path="/terms" element={<LegalPage kind="terms" />} />
        <Route path="/license" element={<LegalPage kind="license" />} />
        <Route path="/og-image-generator" element={<SeoLandingPage slug="og-image-generator" />} />
        <Route path="/code-screenshot" element={<SeoLandingPage slug="code-screenshot" />} />
        <Route path="/twitter-card-maker" element={<SeoLandingPage slug="twitter-card-maker" />} />
        <Route
          path="/linkedin-preview-image"
          element={<SeoLandingPage slug="linkedin-preview-image" />}
        />
        <Route path="/code-to-image" element={<SeoLandingPage slug="code-to-image" />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Layout>
  );
}
