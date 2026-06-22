import { Link, Outlet, useLocation } from 'react-router-dom';

export function AdminLayout() {
  const location = useLocation();

  return (
    <section className="page-card">
      <h1 className="page-title">관리자</h1>
      <nav style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>
          대시보드
        </Link>
        <Link
          to="/admin/users"
          className={location.pathname.startsWith('/admin/users') ? 'active' : ''}
        >
          회원 관리
        </Link>
        <Link
          to="/admin/posts"
          className={location.pathname.startsWith('/admin/posts') ? 'active' : ''}
        >
          게시글 관리
        </Link>
      </nav>
      <Outlet />
    </section>
  );
}
