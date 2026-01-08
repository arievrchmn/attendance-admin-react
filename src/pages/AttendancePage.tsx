// src/pages/AttendancePage.tsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { attendanceApi } from "../lib/api";
import dayjs from "dayjs";

export const AttendancePage = () => {
  const today = dayjs().format("YYYY-MM-DD");
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["attendances", page, startDate, endDate],
    queryFn: () =>
      attendanceApi.getAll({
        page,
        limit: 10,
        start_date: startDate,
        end_date: endDate,
      }),
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="flex gap-2 flex-1 min-w-0">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span className="flex items-center text-gray-500 px-2">-</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">Loading...</div>
        ) : (
          <>
            {/* Mobile View */}
            <div className="block md:hidden">
              <div className="divide-y divide-gray-200">
                {data?.data.map((att) => (
                  <div key={att.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-semibold">
                          {att.user.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {att.user.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {att.user.position}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {dayjs(att.date).format("DD MMM YYYY")}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Check In</p>
                        <p className="font-medium text-gray-900">
                          {dayjs(att.check_in).format("HH:mm")}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Check Out</p>
                        <p className="font-medium text-gray-900">
                          {att.check_out
                            ? dayjs(att.check_out).format("HH:mm")
                            : "-"}
                        </p>
                      </div>
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
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Check In
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Check Out
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data?.data.map((att) => (
                    <tr key={att.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-sm">
                              {att.user.name.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              {att.user.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {att.user.position}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {dayjs(att.date).format("DD MMM YYYY")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {dayjs(att.check_in).format("HH:mm")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {att.check_out
                          ? dayjs(att.check_out).format("HH:mm")
                          : "-"}
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
    </div>
  );
};
