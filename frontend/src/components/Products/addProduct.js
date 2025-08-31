import React, { useState } from "react";
import { Form, Input, InputNumber, Button, Select, Upload, Card } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const AddProduct = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    console.log("Form Data: ", values);

    // Later connect this to backend API
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="">
      <Card
        title="➕ Add New Product"
        className="w-full shadow-lg rounded-xl"
      >
        <Form layout="vertical" onFinish={onFinish}>
          {/* Product Name */}
          <Form.Item
            label="Product Name"
            name="name"
            rules={[{ required: true, message: "Please enter product name" }]}
          >
            <Input placeholder="Enter product name" />
          </Form.Item>

          {/* Price */}
          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Please enter price" }]}
          >
            <InputNumber
              className="w-full"
              min={1}
              placeholder="Enter price"
              prefix="₨"
            />
          </Form.Item>

          {/* Size in ML */}
          <Form.Item
            label="Size (ML)"
            name="size"
            rules={[{ required: true, message: "Please enter size in ML" }]}
          >
            <InputNumber
              className="w-full"
              min={50}
              step={50}
              placeholder="Enter size in ML (e.g., 500)"
            />
          </Form.Item>

          {/* Branded Yes/No */}
          <Form.Item
            label="Branded"
            name="branded"
            rules={[{ required: true, message: "Please select option" }]}
          >
            <Select placeholder="Is this branded?">
              <Select.Option value="yes">Yes</Select.Option>
              <Select.Option value="no">No</Select.Option>
            </Select>
          </Form.Item>

          {/* Upload Image (Optional) */}
          <Form.Item label="Upload Product Image (Optional)" name="image">
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className="rounded-lg"
            >
              Add Product
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddProduct;
