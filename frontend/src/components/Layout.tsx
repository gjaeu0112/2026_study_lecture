import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

export function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="layout">
      <header className="header">
        <Link to="/" className="logo">
          강의 평가 시스템
        </Link>
        <nav className="nav">
          <NavLink to="/posts">게시판</NavLink>
          {user && <NavLink to="/mypage">마이페이지</NavLink>}
          {user?.role === 'admin' && <NavLink to="/admin">관리자</NavLink>}
        </nav>
        <div className="auth-area">
          {user ? (
            <>
              <span className="user-name">{user.name}님</span>
              <button type="button" onClick={logout}>
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link to="/login">로그인</Link>
              <Link to="/register" className="btn-primary">
                회원가입
              </Link>
            </>
          )}
        </div>
      </header>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
