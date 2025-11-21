import React from "react";

function ActivityFeed({ items }) {
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
      <ul className="space-y-2">
        {safeItems.map((item, idx) => {
          const id = item?.id ?? idx;
          const title = item?.title ?? "(no title)";
          const description = item?.description ?? "";
          const timeAgo = item?.timeAgo ?? "";
          return (
            <li key={id} className="flex justify-between text-xs">
              <div>
                <p className="font-medium text-gray-100">{title}</p>
                <p className="text-gray-300">{description}</p>
              </div>
              <span className="text-gray-400 whitespace-nowrap">{timeAgo}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ActivityFeed;
