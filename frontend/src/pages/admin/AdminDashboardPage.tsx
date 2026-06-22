import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import type { DashboardStats } from '../../types';

export function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get<DashboardStats>('/admin/dashboard');
      setStats(data);
    };
    void load();
  }, []);

  if (!stats) {
    return <div>불러오는 중...</div>;
  }

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <strong>{stats.userCount}</strong>
        <span>회원 수</span>
      </div>
      <div className="stat-card">
        <strong>{stats.postCount}</strong>
        <span>게시글 수</span>
      </div>
      <div className="stat-card">
        <strong>{stats.commentCount}</strong>
        <span>댓글 수</span>
      </div>
    </div>
  );
}
