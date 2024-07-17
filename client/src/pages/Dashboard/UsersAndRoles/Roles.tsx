import React from 'react';
import Table from '../../../components/Tables/Table';
import TableSkeleton from '../../../components/Skeleton/TableSk';
import { useFetchRoles } from '../../../constants/Roles';
import { Role } from '../../../types/interfaces';

const Roles: React.FC = () => {
  const { roles, loading, error } = useFetchRoles();

  const columns = [
    { header: 'Role ID', accessor: 'id' },
    {
      header: 'Role Name',
      accessor: (row: Role) => (
        <span style={{ color: row.color }}>{row.name}</span>
      ),
    },
    { header: 'Owned By', accessor: 'users_count' },
  ];

  return (
    <div>
      <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
        <div className="mx-auto max-w-screen-xl px-4">
          <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            {loading ? (
              <TableSkeleton />
            ) : error ? (
              <p>{error}</p>
            ) : (
              <Table columns={columns} data={roles} />
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Roles;
