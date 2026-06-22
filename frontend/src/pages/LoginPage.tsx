import { Link } from 'react-router-dom';
import { Button, Form, Input, message } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      setLoading(true);
      await login(values.email, values.password);
      message.success('로그인되었습니다.');
      navigate('/posts');
    } catch {
      message.error('로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-card form-narrow">
      <h1 className="page-title">로그인</h1>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="이메일"
          name="email"
          rules={[{ required: true, type: 'email', message: '이메일을 입력하세요.' }]}
        >
          <Input placeholder="user@example.com" />
        </Form.Item>
        <Form.Item
          label="비밀번호"
          name="password"
          rules={[{ required: true, message: '비밀번호를 입력하세요.' }]}
        >
          <Input.Password />
        </Form.Item>
        <Button type="primary" htmlType="submit" block loading={loading}>
          로그인
        </Button>
      </Form>
      <p style={{ marginTop: '1rem' }}>
        계정이 없으신가요? <Link to="/register">회원가입</Link>
      </p>
    </section>
  );
}
