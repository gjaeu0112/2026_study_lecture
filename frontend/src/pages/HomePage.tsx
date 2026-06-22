import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function HomePage() {
  const { user } = useAuth();

  return (
    <section className="page-card">
      <h1 className="page-title">강의 평가 시스템</h1>
      <p>React + NestJS + TypeORM + MySQL + JWT 기반의 간단한 게시판 예제입니다.</p>
      <ul>
        <li>회원가입 / 로그인 (JWT 인증)</li>
        <li>게시판 CRUD + 댓글</li>
        <li>마이페이지 (프로필 수정, 내 글 목록)</li>
        <li>관리자 페이지 (회원/게시글 관리)</li>
      </ul>
      <p>
        {user ? (
          <>
            <Link to="/posts">게시판 바로가기</Link>
          </>
        ) : (
          <>
            <Link to="/register">회원가입</Link> 후 게시판을 이용해 보세요.
          </>
        )}
      </p>
    </section>
  );
}
