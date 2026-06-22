import { useNavigate, useParams } from 'react-router-dom';
import { Button, Form, Input, message } from 'antd';
import { useEffect, useState } from 'react';
import { api } from '../api/client';
import type { Post } from '../types';

export function PostFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isEdit) return;

    const load = async () => {
      const { data } = await api.get<Post>(`/posts/${id}`);
      form.setFieldsValue({ title: data.title, content: data.content });
    };

    void load();
  }, [form, id, isEdit]);

  const onFinish = async (values: { title: string; content: string }) => {
    try {
      setLoading(true);
      if (isEdit) {
        await api.patch(`/posts/${id}`, values);
        message.success('수정되었습니다.');
        navigate(`/posts/${id}`);
      } else {
        const { data } = await api.post<Post>('/posts', values);
        message.success('등록되었습니다.');
        navigate(`/posts/${data.id}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-card">
      <h1 className="page-title">{isEdit ? '글 수정' : '글 작성'}</h1>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="제목"
          name="title"
          rules={[{ required: true, min: 2, message: '제목을 입력하세요.' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="내용"
          name="content"
          rules={[{ required: true, min: 2, message: '내용을 입력하세요.' }]}
        >
          <Input.TextArea rows={8} />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          {isEdit ? '수정하기' : '등록하기'}
        </Button>
      </Form>
    </section>
  );
}
