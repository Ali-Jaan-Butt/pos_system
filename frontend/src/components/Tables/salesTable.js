import React, { useEffect, useState } from "react";
import { Card, Table, DatePicker, Space, Typography, message } from "antd";
import dayjs from "dayjs";

const { Text, Title } = Typography;

export default function SalesTable({ refreshToken }) {
  const [date, setDate] = useState(dayjs());
  const [rows, setRows] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchDaily = async (d) => {
    const iso = d.format("YYYY-MM-DD");
    setLoading(true);
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/sales/daily/?date=${iso}`
      );
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setRows(data.rows);
        setGrandTotal(data.grand_total);
      } else {
        message.error(data.message || "Failed to load daily sales");
      }
    } catch (e) {
      console.error(e);
      message.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDaily(date);
  }, [date]);

  useEffect(() => {
    if (refreshToken) fetchDaily(date);
  }, [refreshToken]);

  const columns = [
    { title: "Time", dataIndex: "time", key: "time", width: 90 },
    { title: "Invoice #", dataIndex: "invoice_no", key: "invoice_no" },
    { title: "Item", dataIndex: "item_name", key: "item_name" },
    { title: "Qty", dataIndex: "qty", key: "qty", width: 70 },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (v) => `Rs. ${v}`,
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (v) => <Text strong>{`Rs. ${v}`}</Text>,
    },
  ];

  return (
    <Card
      title={
        <Space>
          <Title level={4} className="!mb-0">
            📊 Daily Sales
          </Title>
          <DatePicker
            value={date}
            onChange={(d) => d && setDate(d)}
            allowClear={false}
          />
        </Space>
      }
      extra={<Text strong>Grand Total: Rs. {grandTotal}</Text>}
      className="w-full shadow-xl rounded-xl"
    >
      <Table
        rowKey={(r, idx) => `${r.invoice_no}-${r.item_name}-${idx}`}
        columns={columns}
        dataSource={rows}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
}
