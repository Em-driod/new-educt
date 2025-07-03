// src/Pages/AdminDashboard.tsx
import React from "react";
import ContentManagement from "../components/ContentManagement.tsx";
import ArtistTalentManagement from "../components/ArtistTalentManagement.tsx";
import UserManagement from "../components/UserManagement.tsx";
import AnalysticsReports from "../components/SummaryCard.tsx";
import MarketingPromotions from "../components/ContactsList.tsx";
import EventManagement from "../components/ProjectProgress.tsx";
import MonetizationManagement from "../components/MonetizationManagement.tsx";
import RightsLicensingManagement from "../components/RightsLicensingManagement.tsx";
import SecuritySettings from "../components/ServerStatus.tsx";
import FeedbackReview from "../components/EmailStatistics.tsx"; // Ensure the file exists at this path
import InternalCommunication from "../components/TagList.tsx";
// import A // Remove or complete this line if needed

// Uncomment when you create these components
// import AIRecommendations from "../components/Admin/AIRecommendations";
// import CastingAudition from "../components/Admin/CastingAudition";
// import PodcastManagement from "../components/Admin/PodcastManagement";
// import MerchandiseStore from "../components/Admin/MerchandiseStore";

const Dashboard: React.FC = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Core Management Sections */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ContentManagement />
        <ArtistTalentManagement />
        <UserManagement />
        <AnalysticsReports />
        <MarketingPromotions />
        <EventManagement />
        <MonetizationManagement />
        <RightsLicensingManagement />
     
        <SecuritySettings />
        <FeedbackReview />
        <InternalCommunication />
      </section>

      {/* Optional Extras */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">Optional Extras</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Uncomment when ready */}
          {/* <MerchandiseStore /> */}
          {/* <CastingAudition /> */}
          {/* <PodcastManagement /> */}
          {/* <AIRecommendations /> */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

