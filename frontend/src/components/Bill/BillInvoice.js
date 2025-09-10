import React from "react";
import {
  Table,
  Button,
  Typography,
  Card,
  Popconfirm,
  InputNumber,
  Space,
  Tooltip,
  message,
} from "antd";
import {
  DeleteOutlined,
  DownloadOutlined,
  DatabaseOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const { Title, Text } = Typography;

export default function BillInvoice({
  billData,
  onUpdateItem,
  onDeleteItem,
  onClearInvoice,
}) {
  if (!billData) return null;

  const { company, invoiceNo, items, timestamp } = billData;

  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  // PDF Download
  const handleDownload = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(company, 14, 20);
    doc.setFontSize(12);
    doc.text(`Invoice No: ${invoiceNo}`, 14, 30);
    doc.text(`Date: ${timestamp}`, 14, 36);

    autoTable(doc, {
      startY: 45,
      head: [["Item", "Quantity", "Price", "Total"]],
      body: items.map((item) => [
        item.name,
        item.qty,
        item.price,
        item.price * item.qty,
      ]),
    });

    doc.text(
      `Grand Total: Rs. ${totalAmount}`,
      14,
      doc.lastAutoTable.finalY + 10
    );
    doc.save(`Invoice_${invoiceNo}.pdf`);
  };

  const columns = [
    { title: "Item", dataIndex: "name", key: "name" },
    { title: "Quantity", dataIndex: "qty", key: "qty" },
    { title: "Price", dataIndex: "price", key: "price" },
    {
      title: "Total",
      key: "total",
      render: (_, record) => <Text strong>{record.price * record.qty}</Text>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <InputNumber
            min={1}
            defaultValue={record.qty}
            onChange={(val) => onUpdateItem(record.name, val)}
            size="small"
          />
          <Popconfirm
            title="Are you sure to delete this item?"
            onConfirm={() => onDeleteItem(record.name)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleSaveToDB = async () => {
  try {
    const payload = {
      invoiceNo,
      company,
      timestamp,
      items,
      totalAmount,
    };

    const response = await fetch("http://localhost:8000/api/invoices/create/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      message.success("Invoice saved to database successfully!");
    } else {
      message.error("Failed to save invoice!");
    }
  } catch (error) {
    console.error("Error saving invoice:", error);
    message.error("Error saving invoice. Please try again.");
  }
};


  return (
    <Card className="shadow-lg rounded-xl h-full flex flex-col">
      {/* Header */}
      <div className="border-b bg-white p-4">
        <div className="flex justify-between items-center">
          <Title level={4} className="!mb-0">
            {company}
          </Title>
          <Text strong>Invoice No: {invoiceNo}</Text>
        </div>
        <Text type="secondary">Date: {timestamp}</Text>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto p-4">
        <Table
          columns={columns}
          dataSource={items}
          pagination={false}
          rowKey="name"
          bordered
        />
      </div>

      {/* Footer */}
      <div className="p-4 border-t bg-white flex justify-between items-center">
        <Text strong className="text-lg">
          Grand Total: Rs. {totalAmount}
        </Text>

        <Space>
          <Tooltip title="Clear Invoice">
            <Popconfirm
              title="Are you sure to clear this invoice?"
              onConfirm={onClearInvoice}
              okText="Yes"
              cancelText="No"
            >
              <Button danger shape="circle" icon={<ClearOutlined />} />
            </Popconfirm>
          </Tooltip>

          <Tooltip title="Download PDF">
            <Button
              type="primary"
              shape="circle"
              icon={<DownloadOutlined />}
              onClick={handleDownload}
            />
          </Tooltip>

          <Tooltip title="Save to Database">
            <Button
              type="default"
              shape="circle"
              icon={<DatabaseOutlined />}
              onClick={handleSaveToDB}
            />
          </Tooltip>
        </Space>
      </div>
    </Card>
  );
}
