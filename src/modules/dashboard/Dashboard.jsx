import React, { useEffect, useState } from "react";
import SummaryStatsGrid from "./components/SummaryStatsGrid";
import ViewsImpressionsChart from "./components/ViewsImpressionsChart";
import RedemptionsChart from "./components/RedemptionsChart";
import TopOffersTable from "./components/TopOffersTable";
import ActivityFeed from "./components/ActivityFeed";
import Loading from "../../components/Loading";
import RuntimeErrorBoundary from "../../components/RuntimeErrorBoundary";
import {
  fetchDashboardSummary,
  fetchViewsAndImpressions,
  fetchRedemptions,
  fetchTopOffers,
  fetchActivityFeed,
} from "./api/dashboard.service";

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [viewsData, setViewsData] = useState([]);
  const [redemptionsData, setRedemptionsData] = useState([]);
  const [topOffers, setTopOffers] = useState([]);
  const [activityItems, setActivityItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();

    async function loadDashboardData() {
      try {
        setLoading(true);
        setError(null);

        const [summaryRes, viewsRes, redemptionsRes, topOffersRes, activityRes] = await Promise.all([
          fetchDashboardSummary(abortController.signal),
          fetchViewsAndImpressions(abortController.signal),
          fetchRedemptions(abortController.signal),
          fetchTopOffers({ limit: 5 }, abortController.signal),
          fetchActivityFeed({ limit: 10 }, abortController.signal),
        ]);

        setSummary(summaryRes);
        setViewsData(viewsRes);
        setRedemptionsData(redemptionsRes);
        setTopOffers(topOffersRes);
        setActivityItems(activityRes);
      } catch (err) {
        if (err.name !== "CanceledError" && err.name !== "AbortError") {
          setError("Failed to load dashboard data.");
          console.error("Dashboard loading error:", err);
        }
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();

    return () => {
      abortController.abort();
    };
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <SummaryStatsGrid summary={summary} />

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RuntimeErrorBoundary message="Failed to load Views & Impressions">
            <ViewsImpressionsChart data={viewsData} />
          </RuntimeErrorBoundary>
        </div>
        <div>
          <RuntimeErrorBoundary message="Failed to load Redemptions">
            <RedemptionsChart data={redemptionsData} />
          </RuntimeErrorBoundary>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RuntimeErrorBoundary message="Failed to load Top Offers">
            <TopOffersTable offers={topOffers} />
          </RuntimeErrorBoundary>
        </div>
        <div>
          <RuntimeErrorBoundary message="Failed to load Activity Feed">
            <ActivityFeed items={activityItems} />
          </RuntimeErrorBoundary>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
