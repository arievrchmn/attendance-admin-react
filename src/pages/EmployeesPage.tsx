/* eslint-disable @typescript-eslint/no-explicit-any */

// src/pages/EmployeesPage.tsx

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Plus, Edit2, Trash2 } from "lucide-react";
import { employeeApi } from "../lib/api";
import toast from "react-hot-toast";
import { EmployeeModal } from "../components/EmployeeModal";
import type { Employee } from "../lib/api";

export const EmployeesPage = () => {
  const [searchName, setSearchName] = useState("");
  const [page, setPage] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["employees", page, searchName],
    queryFn: () => employeeApi.getAll({ page, limit: 10, name: searchName }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => employeeApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Data karyawan berhasil dihapus");
    },
    onError: (error: any) => {
      toast.error(error.message || "Gagal menghapus karyawan");
    },
  });

  const handleEdit = (emp: Employee) => {
    setSelectedEmployee(emp);
    setShowEditModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Yakin ingin menghapus karyawan ini?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Cari karyawan..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>Tambah Karyawan</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">Loading...</div>
        ) : (
          <>
            {/* Mobile View */}
            <div className="block md:hidden">
              <div className="divide-y divide-gray-200">
                {data?.data.map((emp) => (
                  <div key={emp.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 font-semibold">
                            {emp.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {emp.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {emp.position}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEdit(emp)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(emp.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-600">{emp.email}</p>
                      <p className="text-gray-600">{emp.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Posisi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Telepon
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data?.data.map((emp) => (
                    <tr key={emp.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-sm">
                              {emp.name.charAt(0)}
                            </span>
                          </div>
                          <span className="ml-3 text-sm font-medium text-gray-900">
                            {emp.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {emp.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {emp.position}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {emp.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(emp)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(emp.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {data?.meta && data.meta.total_pages > 1 && (
          <div className="p-4 border-t border-gray-200 flex justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-3 py-1">
              Page {page} of {data.meta.total_pages}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page === data.meta.total_pages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {showEditModal && selectedEmployee && (
        <EmployeeModal
          employee={selectedEmployee}
          onClose={() => {
            setShowEditModal(false);
            setSelectedEmployee(null);
          }}
        />
      )}

      {showAddModal && <EmployeeModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
};
