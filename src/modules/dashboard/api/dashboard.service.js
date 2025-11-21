import apiClient from "../../../shared/http/client";

const USE_MOCK = !import.meta.env.VITE_API_URL;

const sleep = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export async function fetchDashboardSummary(signal) {
  if (USE_MOCK) {
    await sleep();
    return {
      totalRetailers: 12,
      activeStores: 28,
      liveOffers: 7,
      totalViews: 12456,
      totalRedemptions: 342,
    };
  }

  const res = await apiClient.get("/dashboard/summary", { signal });
  return res.data;
}

export async function fetchViewsAndImpressions(signal) {
  if (USE_MOCK) {
    await sleep();
    // Seven days of sample data
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const data = days.map((d, i) => ({
      label: d,
      views: 100 + i * 20 + Math.round(Math.random() * 50),
      impressions: 300 + i * 40 + Math.round(Math.random() * 80),
    }));
    return data;
  }

  const res = await apiClient.get("/dashboard/views-impressions", { signal });
  return res.data;
}

export async function fetchRedemptions(signal) {
  if (USE_MOCK) {
    await sleep();
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const data = days.map((d, i) => ({
      label: d,
      redemptions: Math.max(0, Math.round(5 + i + Math.random() * 8)),
    }));
    return data;
  }

  const res = await apiClient.get("/dashboard/redemptions", { signal });
  return res.data;
}

export async function fetchTopOffers(params = {}, signal) {
  if (USE_MOCK) {
    await sleep();
    return [
      { id: "o_1", title: "50% off Coffee", redemptions: 120, views: 2400 },
      { id: "o_2", title: "Buy 1 Get 1 Pizza", redemptions: 98, views: 1800 },
      { id: "o_3", title: "20% off Electronics", redemptions: 74, views: 1500 },
    ];
  }

  const res = await apiClient.get("/dashboard/top-offers", {
    params,
    signal,
  });
  return res.data;
}

export async function fetchActivityFeed(params = {}, signal) {
  if (USE_MOCK) {
    await sleep();
    return [
      {
        id: "a1",
        title: "Offer created",
        description: "50% off Coffee",
        timeAgo: "2h",
      },
      {
        id: "a2",
        title: "Merchant signed up",
        description: "Joe's Diner",
        timeAgo: "6h",
      },
      {
        id: "a3",
        title: "Offer expired",
        description: "Free Dessert",
        timeAgo: "1d",
      },
    ];
  }

  const res = await apiClient.get("/dashboard/activity", {
    params,
    signal,
  });
  return res.data;
}
