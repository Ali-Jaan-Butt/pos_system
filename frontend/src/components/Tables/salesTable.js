import React from "react";
import { Table } from "antd";

function SalesTable() {
  // Mock sales data (replace later with backend data)
  const dataSource = [
    {
      key: "1",
      invoiceNo: "INV-1001",
      customer: "Ali",
      totalAmount: 1500,
      date: new Date().toLocaleDateString(),
    },
    {
      key: "2",
      invoiceNo: "INV-1002",
      customer: "Ahmed",
      totalAmount: 2500,
      date: new Date().toLocaleDateString(),
    },
    {
      key: "3",
      invoiceNo: "INV-1003",
      customer: "Sara",
      totalAmount: 1800,
      date: new Date().toLocaleDateString(),
    },
  ];

  // Table columns
  const columns = [
    {
      title: "Invoice No",
      dataIndex: "invoiceNo",
      key: "invoiceNo",
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "Total Amount (PKR)",
      dataIndex: "totalAmount",
      key: "totalAmount",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
  ];

  return (
    <div className="p-4 bg-white shadow-md rounded-xl">
      <h2 className="text-xl font-bold mb-4">📊 Today's Sales</h2>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        bordered
      />
    </div>
  );
}

export default SalesTable;
