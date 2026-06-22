import { Button, Select, Table, message } from 'antd';
import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import type { Role, User } from '../../types';

export function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  const load = async () => {
    const { data } = await api.get<User[]>('/admin/users');
    setUsers(data);
  };

  useEffect(() => {
    void load();
  }, []);

  const updateRole = async (id: number, role: Role) => {
    await api.patch(`/admin/users/${id}/role`, { role });
    message.success('권한이 변경되었습니다.');
    await load();
  };

  const removeUser = async (id: number) => {
    if (!window.confirm('회원을 삭제할까요?')) return;
    await api.delete(`/admin/users/${id}`);
    message.success('삭제되었습니다.');
    await load();
  };

  return (
    <Table
      rowKey="id"
      dataSource={users}
      columns={[
        { title: 'ID', dataIndex: 'id', width: 80 },
        { title: '이름', dataIndex: 'name' },
        { title: '이메일', dataIndex: 'email' },
        {
          title: '권한',
          dataIndex: 'role',
          render: (role: Role, record) => (
            <Select
              value={role}
              style={{ width: 120 }}
              options={[
                { value: 'user', label: 'user' },
                { value: 'admin', label: 'admin' },
              ]}
              onChange={(value) => updateRole(record.id, value)}
            />
          ),
        },
        {
          title: '관리',
          render: (_, record) => (
            <Button danger size="small" onClick={() => removeUser(record.id)}>
              삭제
            </Button>
          ),
        },
      ]}
    />
  );
}
