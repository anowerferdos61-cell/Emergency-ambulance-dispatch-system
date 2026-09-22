import { useAdmin } from '../../layouts/AdminLayout';
import { FaUsers } from 'react-icons/fa';

export const AdminUsers = () => {
  const { usersList } = useAdmin();

  return (
    <div className="bg-base-200 border border-base-300 rounded-3xl p-4 sm:p-6 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-extrabold text-base sm:text-lg flex items-center gap-2">
          <FaUsers className="text-primary" /> Registered User Accounts ({usersList.length})
        </h3>
      </div>

      <div className="overflow-x-auto bg-base-100 rounded-2xl border border-base-300">
        <table className="table table-zebra table-sm sm:table-md w-full text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-base-300">
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {usersList.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-8 opacity-60">
                  No registered users found.
                </td>
              </tr>
            ) : (
              usersList.map((u) => (
                <tr key={u.id} className="hover">
                  <td className="font-mono text-base-content/50">#{u.id}</td>
                  <td className="font-bold">{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.phone_number || 'N/A'}</td>
                  <td>
                    <span
                      className={`badge badge-sm font-bold uppercase ${
                        u.role === 'admin'
                          ? 'badge-error text-white'
                          : u.role === 'driver'
                          ? 'badge-warning text-red-900'
                          : 'badge-primary badge-outline'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
