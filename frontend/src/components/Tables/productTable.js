import React from "react";
import { Table, Card, Tag, Button, Space, Popconfirm, message } from "antd";
import { ReloadOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";


const ProductTable = ({ products, loading, fetchProducts }) => {
  const handleEdit = (record) => {
    message.info(`Editing ${record.product_name}`);
  };

  const handleDelete = (key) => {
    message.success("Deleted successfully");
    // Here you can call backend delete API and then refresh
    fetchProducts();
  };

  const columns = [
    { title: "Name", dataIndex: "product_name", key: "name" },
    { title: "Size (ML)", dataIndex: "size", key: "size" },
    {
      title: "Branded", dataIndex: "branded", key: "branded",
      render: (value) => value === "yes" ? <Tag color="green">Yes</Tag> : <Tag color="volcano">No</Tag>
    },
    { title: "Unit/Box", dataIndex: "unit_per_box", key: "unit_per_box" },
    { title: "Per Liter Value", dataIndex: "per_liter_value", key: "per_liter_value" },
    {
      title: "Approved", dataIndex: "approved", key: "approved",
      render: (val) => val ? <Tag color="blue">Approved</Tag> : <Tag color="orange">Pending</Tag>
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
            title="Are you sure to delete?"
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
      title="📦 Products List"
      extra={
        <Button
          icon={<ReloadOutlined />}
          onClick={fetchProducts}
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
        dataSource={products}
        loading={loading}
        pagination={{ pageSize: 5 }}
        bordered={false}
        rowClassName="hover:bg-gray-50"
      />
    </Card>
  );
};

export default ProductTable;