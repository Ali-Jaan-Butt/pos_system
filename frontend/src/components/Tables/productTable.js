import React, { useEffect, useState } from "react";
import { Table, Card, Tag, Image, Button, Space, Popconfirm, message } from "antd";
import { ReloadOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const ProductTable = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  // Dummy fetch simulation
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    setLoading(true);

    setTimeout(() => {
      setProducts([
        {
          key: 1,
          name: "Full Cream Milk",
          price: 120,
          size: 1000,
          branded: "yes",
          image: "https://via.placeholder.com/60",
        },
        {
          key: 2,
          name: "Yogurt Cup",
          price: 40,
          size: 240,
          branded: "no",
          image: "https://via.placeholder.com/60",
        },
      ]);
      setLoading(false);
    }, 1000);
  };

  const handleEdit = (record) => {
    message.info(`Editing ${record.name}`);
  };

  const handleDelete = (key) => {
    setProducts(products.filter((item) => item.key !== key));
    message.success("Deleted successfully");
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Price (₨)", dataIndex: "price", key: "price" },
    { title: "Size (ML)", dataIndex: "size", key: "size" },
    {
      title: "Branded",
      dataIndex: "branded",
      key: "branded",
      render: (value) =>
        value === "yes" ? (
          <Tag color="green">Yes</Tag>
        ) : (
          <Tag color="volcano">No</Tag>
        ),
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (img) =>
        img ? (
          <Image src={img} width={45} height={45} style={{ borderRadius: 8 }} />
        ) : (
          <Tag>No Image</Tag>
        ),
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
            <Button
              icon={<DeleteOutlined />}
              type="primary"
              danger
              size="small"
            >
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
      className="w-full shadow-xl rounded-xl"
      style={{ borderRadius: 16, overflow: "hidden" }}
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
