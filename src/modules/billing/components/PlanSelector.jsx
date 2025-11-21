import React from "react";

function PlanSelector({ plans, currentPlanId, onChangePlan }) {
  if (!plans || plans.length === 0) {
    return <p className="text-xs text-gray-500">No plans available.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {plans.map((plan) => {
        const selected = plan.id === currentPlanId;
        return (
          <div
            key={plan.id}
            className={`border rounded-xl p-3 text-xs cursor-pointer ${
              selected ? "border-blue-600 bg-blue-50" : "border-gray-200"
            }`}
            onClick={() => onChangePlan(plan)}
          >
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-semibold text-sm">{plan.name}</h3>
              {selected && (
                <span className="text-[10px] text-blue-600 font-semibold">
                  Current
                </span>
              )}
            </div>
            <p className="text-gray-600 mb-1">
              {plan.priceFormatted || `${plan.price}/month`}
            </p>
            {plan.description && (
              <p className="text-[11px] text-gray-500">{plan.description}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default PlanSelector;
