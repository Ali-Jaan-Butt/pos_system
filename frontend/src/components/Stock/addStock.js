import React, { useState } from "react";
import { message } from "antd";

export default function AddStockForm({ product, refreshStock }) {
  const [boxes, setBoxes] = useState(0);
  const [extraUnits, setExtraUnits] = useState(0);
  const [loading, setLoading] = useState(false);

  // Calculations
  const totalUnits =
    (parseInt(boxes) || 0) * (product?.unit_per_box || 0) +
    (parseInt(extraUnits) || 0);

  const totalValue = totalUnits * (product?.per_liter_value || 0);

  // Submit
  const handleSubmit = async () => {
    if (!product) {
      message.warning("Please select a product first");
      return;
    }

    const payload = {
      product_name: product.product_name,
      size: product.size,
      branded: product.branded ?? false,
      boxes: parseInt(boxes),
      extra_units: parseInt(extraUnits),
      unit_per_box: product.unit_per_box ?? 0,
      per_liter_value: product.per_liter_value ?? 0,
    };

    try {
      setLoading(true);
      const res = await fetch("http://127.0.0.1:8000/add-inventory-data/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.status === "success") {
        message.success("Stock added successfully!");
        setBoxes(0);
        setExtraUnits(0);

        // refresh stock table
        if (refreshStock) refreshStock();
      } else {
        message.error("Error: " + data.message);
      }
    } catch (err) {
      console.error("Error sending stock:", err);
      message.error("Something went wrong");
    } finally {
      setLoading(false);
    }
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
        Add Stock for{" "}
        <span className="text-green-600">
          {product.product_name} - {product.size} ML
        </span>
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
        disabled={loading}
        className="mt-6 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add Stock"}
      </button>
    </div>
  );
}
