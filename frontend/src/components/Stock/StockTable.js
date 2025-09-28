import React from "react";
import { Table, Card, Button, Space, Popconfirm, message, Tag } from "antd";
import { ReloadOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const StockTable = ({ stockData, loading, fetchStock }) => {
  const handleEdit = (record) => {
    message.info(`Editing stock of ${record.product_name}`);
    // Open Edit modal or navigate to edit page
  };

  const handleDelete = (key) => {
    message.success("Stock entry deleted successfully");
    // Call backend delete API and refresh
    fetchStock();
  };

  const columns = [
    { title: "Product Name", dataIndex: "product_name", key: "product_name" },
    { title: "Boxes", dataIndex: "boxes", key: "boxes" },
    { title: "Extra Units", dataIndex: "extra_units", key: "extra_units" },
    { title: "Total Units", dataIndex: "total_units", key: "total_units" },
    { 
      title: "Total Value", 
      dataIndex: "total_value", 
      key: "total_value",
      render: (val) => <Tag color="green">Rs. {val}</Tag>
    },
    { 
      title: "Timestamp", 
      dataIndex: "timestamp", 
      key: "timestamp",
      render: (val) => <span className="text-gray-500">{val}</span>
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            type="primary"
            ghost
            size="small"
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this stock entry?"
            onConfirm={() => handleDelete(record.key)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} type="primary" danger size="small">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="📦 Stock Entries"
      extra={
        <Button
          icon={<ReloadOutlined />}
          onClick={fetchStock}
          loading={loading}
          type="dashed"
        >
          Refresh
        </Button>
      }
      className="w-full shadow-xl rounded-xl h-full"
    >
      <Table
        columns={columns}
        dataSource={stockData}
        loading={loading}
        pagination={{ pageSize: 5 }}
        bordered={false}
        rowClassName="hover:bg-gray-50"
      />
    </Card>
  );
};

export default StockTable;
