import { Link } from 'react-router-dom';
import { Button, Form, Input, message } from 'antd';
import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import type { Post, User } from '../types';

export function MyPage() {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState<User | null>(user);
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [profileRes, postsRes] = await Promise.all([
        api.get<User>('/users/me'),
        api.get<Post[]>('/users/me/posts'),
      ]);
      setProfile(profileRes.data);
      setMyPosts(postsRes.data);
    };
    void load();
  }, []);

  const onFinish = async (values: { name?: string; password?: string }) => {
    try {
      setLoading(true);
      const payload = {
        ...(values.name ? { name: values.name } : {}),
        ...(values.password ? { password: values.password } : {}),
      };
      await api.patch('/users/me', payload);
      await refreshUser();
      message.success('프로필이 수정되었습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-card">
      <h1 className="page-title">마이페이지</h1>
      <p>이메일: {profile?.email}</p>
      <p>가입일: {profile ? new Date(profile.createdAt).toLocaleString() : '-'}</p>

      <h2>프로필 수정</h2>
      <Form layout="vertical" onFinish={onFinish} initialValues={{ name: profile?.name }}>
        <Form.Item label="이름" name="name">
          <Input />
        </Form.Item>
        <Form.Item label="새 비밀번호" name="password">
          <Input.Password placeholder="변경할 때만 입력" />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          저장
        </Button>
      </Form>

      <h2 style={{ marginTop: '2rem' }}>내가 작성한 글</h2>
      <ul className="post-list">
        {myPosts.map((post) => (
          <li key={post.id} className="post-item">
            <Link to={`/posts/${post.id}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
      {myPosts.length === 0 && <p>작성한 글이 없습니다.</p>}
    </section>
  );
}
