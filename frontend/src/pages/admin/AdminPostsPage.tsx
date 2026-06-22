import { Button, Table, message } from 'antd';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import type { Post } from '../../types';

export function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);

  const load = async () => {
    const { data } = await api.get<Post[]>('/admin/posts');
    setPosts(data);
  };

  useEffect(() => {
    void load();
  }, []);

  const removePost = async (id: number) => {
    if (!window.confirm('게시글을 삭제할까요?')) return;
    await api.delete(`/admin/posts/${id}`);
    message.success('삭제되었습니다.');
    await load();
  };

  return (
    <Table
      rowKey="id"
      dataSource={posts}
      columns={[
        {
          title: '제목',
          dataIndex: 'title',
          render: (title: string, record) => <Link to={`/posts/${record.id}`}>{title}</Link>,
        },
        { title: '작성자', render: (_, record) => record.author?.name ?? '-' },
        {
          title: '작성일',
          dataIndex: 'createdAt',
          render: (value: string) => new Date(value).toLocaleString(),
        },
        {
          title: '관리',
          render: (_, record) => (
            <Button danger size="small" onClick={() => removePost(record.id)}>
              삭제
            </Button>
          ),
        },
      ]}
    />
  );
}
