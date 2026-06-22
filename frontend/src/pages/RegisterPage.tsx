import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Input, message } from "antd";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: {
    email: string;
    password: string;
    name: string;
  }) => {
    try {
      setLoading(true);
      await register(values.email, values.password, values.name);
      message.success("회원가입이 완료되었습니다.");
      navigate("/posts");
    } catch {
      message.error("회원가입에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-card form-narrow">
      <h1 className="page-title">회원가입</h1>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="이름"
          name="name"
          rules={[
            { required: true, min: 2, message: "이름을 2자 이상 입력하세요." },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="이메일"
          name="email"
          rules={[
            { required: true, type: "email", message: "이메일을 입력하세요." },
          ]}
        >
          <Input placeholder="user@example.com" />
        </Form.Item>
        <Form.Item
          label="비밀번호"
          name="password"
          rules={[
            { required: true, min: 8, message: "비밀번호는 8자 이상입니다." },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Button type="primary" htmlType="submit" block loading={loading}>
          가입하기
        </Button>
      </Form>
      <p style={{ marginTop: "1rem" }}>
        이미 계정이 있으신가요? <Link to="/login">로그인</Link>
      </p>
    </section>
  );
}
