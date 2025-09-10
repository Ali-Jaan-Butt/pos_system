import React, { useState } from "react";
import BillForm from "./billform";
import BillInvoice from "./BillInvoice";
import Card from "antd/es/card/Card";
import { message } from "antd";

function Bill({ onInvoiceSaved }) {
  const [items, setItems] = useState([]);
  const [isBill, setIsBill] = useState(false);

  const handleGenerateBill = (item) => {
    setItems((prev) => [...prev, item]);
    setIsBill(true);
  };

  const handleUpdateItem = (itemName, newQty) => {
    setItems((prev) =>
      prev.map((i) => (i.name === itemName ? { ...i, qty: newQty } : i))
    );
  };

  const handleDeleteItem = (itemName) => {
    setItems((prev) => {
      const updated = prev.filter((i) => i.name !== itemName);
      if (updated.length === 0) setIsBill(false);
      return updated;
    });
  };

  const handleClearBill = () => {
    setItems([]);
    setIsBill(false);
  };

  const billData =
    items.length > 0
      ? {
          company: "My Dairy Shop",
          invoiceNo: Math.floor(Math.random() * 10000), // frontend preview only
          timestamp: new Date().toLocaleString(),
          items,
        }
      : null;

  // Save invoice to backend
  const handleSaveToDB = async () => {
    if (!billData) return;
    try {
      const res = await fetch("http://127.0.0.1:8000/api/invoices/create/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: billData.company,
          items: billData.items.map((i) => ({
            name: i.name,
            qty: i.qty,
            price: i.price,
          })),
        }),
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        message.success(`Invoice ${data.invoice.invoice_no} saved!`);
        handleClearBill();
        onInvoiceSaved && onInvoiceSaved(); // notify parent (DashHome) to refresh SalesTable
      } else {
        message.error(data.message || "Could not save invoice");
      }
    } catch (e) {
      console.error(e);
      message.error("Network error while saving invoice");
    }
  };

  return (
    <div className="flex gap-4 p-4 w-full">
      <div className="w-3/5">
        {isBill ? (
          <BillInvoice
            billData={billData}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
            onClearInvoice={handleClearBill}
            onSaveToDB={handleSaveToDB}
          />
        ) : (
          <Card className="shadow-lg rounded-xl flex items-center justify-center h-full">
            <div className="space-y-4 text-center">
              <div className="text-6xl">🧾</div>
              <h2 className="text-2xl font-bold text-gray-700">No Invoice Found</h2>
              <p className="text-gray-500 text-sm max-w-md">
                Generate your invoice by starting to create a bill and your
                invoices will appear here.
              </p>
            </div>
          </Card>
        )}
      </div>

      <div className="w-2/5">
        <BillForm onGenerateBill={handleGenerateBill} />
      </div>
    </div>
  );
}

export default Bill;
