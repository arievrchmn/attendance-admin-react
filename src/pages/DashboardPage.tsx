// src/pages/DashboardPage.tsx

import { Users } from "lucide-react";

export const DashboardPage = () => {
  const recentActivities = [
    {
      id: 1,
      name: "Siti Rahayu",
      action: "mengubah foto profil",
      time: "15 menit yang lalu",
      type: "photo",
    },
    {
      id: 2,
      name: "Ahmad Fauzi",
      action: "mengubah nomor telepon",
      time: "1 jam yang lalu",
      type: "phone",
    },
    {
      id: 3,
      name: "Budi Santoso",
      action: "mengubah password",
      time: "2 jam yang lalu",
      type: "password",
    },
    {
      id: 4,
      name: "Dewi Lestari",
      action: "mengubah foto profil",
      time: "3 jam yang lalu",
      type: "photo",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm mb-1">Total Karyawan</p>
            <p className="text-3xl font-bold text-gray-900">24</p>
          </div>
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
            <Users className="text-white" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            Aktivitas Perubahan Profil
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === "photo"
                      ? "bg-blue-500"
                      : activity.type === "phone"
                      ? "bg-green-500"
                      : "bg-yellow-500"
                  }`}
                ></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.name}</span>{" "}
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
