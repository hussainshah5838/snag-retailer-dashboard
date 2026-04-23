import React from "react";

const ACTIVITY_TYPE_STYLES = {
  merchant: "text-blue-400",
  offer: "text-green-400", 
  redemption: "text-orange-400",
  default: "text-gray-400"
};

function ActivityFeed({ items }) {
  // Don't show anything if items is null/undefined (loading state)
  if (!items) {
    return (
      <div className="bg-gray-800 rounded-xl p-4 shadow-sm">
        <h3 className="text-sm font-semibold mb-3 text-gray-100">
          Recent Activity
        </h3>
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-400 text-sm">Loading activity...</div>
        </div>
      </div>
    );
  }

  const safeItems = Array.isArray(items) ? items.filter(Boolean) : [];

  if (safeItems.length === 0) {
    return (
      <div className="bg-gray-800 rounded-xl p-4 shadow-sm">
        <h3 className="text-sm font-semibold mb-3 text-gray-100">
          Recent Activity
        </h3>
        <p className="text-xs text-gray-300">No recent activity.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl p-4 shadow-sm">
      <h3 className="text-sm font-semibold mb-3 text-gray-100">
        Recent Activity
      </h3>
      <ul className="space-y-3">
        {safeItems.map((item, idx) => {
          const id = item?.id ?? idx;
          const title = item?.title ?? "(no title)";
          const description = item?.description ?? "";
          const timeAgo = item?.timeAgo ?? "";
          const type = item?.type ?? "default";
          const typeStyle = ACTIVITY_TYPE_STYLES[type] || ACTIVITY_TYPE_STYLES.default;
          
          return (
            <li key={id} className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-gray-500 mt-2 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-xs ${typeStyle}`}>{title}</p>
                    <p className="text-gray-300 text-xs truncate">{description}</p>
                  </div>
                  <span className="text-gray-400 text-xs whitespace-nowrap ml-2">{timeAgo}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ActivityFeed;
