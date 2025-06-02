
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Dashboard from "@/components/Dashboard";
import CampaignCreator from "@/components/CampaignCreator";
import CampaignHistory from "@/components/CampaignHistory";
import SegmentBuilder from "@/components/SegmentBuilder";
import Customers from "@/components/Customers";
import DataIngestionPage from "@/components/data/DataIngestionPage";
import Settings from "@/components/Settings";
import NotFound from "./NotFound";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/campaigns" element={<CampaignHistory />} />
            <Route path="/campaigns/new" element={<CampaignCreator />} />
            <Route path="/segments" element={<SegmentBuilder />} />
            {/* Legacy route redirect */}
            <Route path="/audience" element={<Navigate to="/segments" replace />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/data" element={<DataIngestionPage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Index;
