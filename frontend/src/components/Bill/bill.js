import React, { useState } from "react";
import BillForm from "./billform";
import BillInvoice from "./BillInvoice";
import Card from "antd/es/card/Card";
import { Button } from "antd";

function Bill() {
    const [items, setItems] = useState([]);
    const [isBill, setIsBill] = useState(false);

    // Add new item to bill
    const handleGenerateBill = (item) => {
        setItems((prev) => [...prev, item]);
        setIsBill(true);
    };

    // Update item qty
    const handleUpdateItem = (itemName, newQty) => {
        setItems((prev) =>
            prev.map((i) =>
                i.name === itemName ? { ...i, qty: newQty } : i
            )
        );
    };

    // Delete item
    const handleDeleteItem = (itemName) => {
        setItems((prev) => {
            const updated = prev.filter((i) => i.name !== itemName);
            if (updated.length === 0) setIsBill(false); // Reset when no items left
            return updated;
        });
    };

    // Clear entire bill
    const handleClearBill = () => {
        setItems([]);
        setIsBill(false);
    };

    // Prepare invoice data
    const billData =
        items.length > 0
            ? {
                company: "My Dairy Shop",
                invoiceNo: Math.floor(Math.random() * 10000),
                timestamp: new Date().toLocaleString(),
                items: items,
            }
            : null;

    return (
        <div className="flex gap-4 p-4 w-full">
            {/* Invoice Preview */}
            <div className="w-3/5">
                {isBill ? (
                    <div className="h-full">
                        <BillInvoice
                            billData={billData}
                            onUpdateItem={handleUpdateItem}
                            onDeleteItem={handleDeleteItem}
                            onClearInvoice={handleClearBill}
                        />
                    </div>
                ) : (
                    <Card className="shadow-lg rounded-xl flex items-center justify-center h-full">
                        <div className="space-y-4 text-center">
                            <div className="text-6xl">🧾</div>
                            <h2 className="text-2xl font-bold text-gray-700">
                                No Invoice Found
                            </h2>
                            <p className="text-gray-500 text-sm max-w-md">
                                Generate your invoice by starting to create a
                                bill and your invoices will appear here.
                            </p>
                        </div>
                    </Card>
                )}
            </div>

            {/* Bill Form */}
            <div className="w-2/5">
                <BillForm onGenerateBill={handleGenerateBill} />
            </div>
        </div>
    );
}

export default Bill;
