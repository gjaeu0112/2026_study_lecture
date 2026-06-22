import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import type { Post } from '../types';

export function PostListPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get<Post[]>('/posts');
      setPosts(data);
    };
    void load();
  }, []);

  return (
    <section className="page-card">
      <div className="page-actions">
        {user && (
          <Link to="/posts/new">
            <Button type="primary">글 작성</Button>
          </Link>
        )}
      </div>
      <h1 className="page-title">게시판</h1>
      <ul className="post-list">
        {posts.map((post) => (
          <li key={post.id} className="post-item">
            <Link to={`/posts/${post.id}`}>{post.title}</Link>
            <div className="post-meta">
              {post.author?.name ?? '익명'} · {new Date(post.createdAt).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
      {posts.length === 0 && <p>등록된 게시글이 없습니다.</p>}
    </section>
  );
}
