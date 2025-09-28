import React, { useState } from "react";

export default function AddStockForm({ product }) {
    console.log("Product in AddStockForm:", product);
  const [boxes, setBoxes] = useState(0);
  const [extraUnits, setExtraUnits] = useState(0);

  // Calculations
  const totalUnits =
    (parseInt(boxes) || 0) * (product?.unitsPerBox || 0) +
    (parseInt(extraUnits) || 0);

  const totalValue = totalUnits * (product?.valuePerUnit || 0);

  // Submit
  const handleSubmit = () => {
    if (!product) {
      alert("No product selected");
      return;
    }
    const payload = {
      productId: product.id,
      boxes,
      extraUnits,
      totalUnits,
      totalValue,
    };
    console.log("Send to backend:", payload);
    // API call here
  };

  if (!product) {
    return (
      <p className="text-gray-500 text-center">
        Please select a product from stock page
      </p>
    );
  }

  return (
    <div className="mx-auto">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">
        Add Stock for <span className="text-green-600">{product.product_name} - {product.size} ML</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Boxes */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Boxes
          </label>
          <input
            type="number"
            value={boxes}
            onChange={(e) => setBoxes(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter no. of boxes"
          />
        </div>

        {/* Extra Units */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Extra Units
          </label>
          <input
            type="number"
            value={extraUnits}
            onChange={(e) => setExtraUnits(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter extra units"
          />
        </div>

        {/* Auto Calculated Fields */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Total Units
          </label>
          <input
            type="text"
            value={totalUnits}
            disabled
            className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Total Value
          </label>
          <input
            type="text"
            value={totalValue}
            disabled
            className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-lg p-2"
          />
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="mt-6 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
      >
        Add Stock
      </button>
    </div>
  );
}
