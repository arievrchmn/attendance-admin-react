/* eslint-disable @typescript-eslint/no-explicit-any */

// src/components/EmployeeModal.tsx

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Upload, Loader } from 'lucide-react';
import { employeeApi } from '../lib/api';
import type { Employee } from '../lib/api';
import toast from 'react-hot-toast';

interface EmployeeModalProps {
  employee?: Employee;
  onClose: () => void;
}

export const EmployeeModal = ({ employee, onClose }: EmployeeModalProps) => {
  const [formData, setFormData] = useState({
    name: employee?.name || '',
    email: employee?.email || '',
    position: employee?.position || '',
    phone: employee?.phone || '',
    password: '',
    photo_url: employee?.photo_url || '',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState('');

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const updateData: any = {};

      if (selectedFile) {
        try {
          const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
          const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

          const formDataUpload = new FormData();
          formDataUpload.append('file', selectedFile);
          formDataUpload.append('upload_preset', UPLOAD_PRESET);
          formDataUpload.append('folder', 'employee-photos');

          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            {
              method: 'POST',
              body: formDataUpload,
            }
          );

          const data = await response.json();

          if (data.secure_url) {
            updateData.photo_url = data.secure_url;
          } else {
            throw new Error('Upload gagal');
          }
        } catch (err) {
          toast.error('Gagal mengupload foto');
          throw err;
        }
      }

      if (employee) {
        if (formData.name !== employee.name) updateData.name = formData.name;
        if (formData.phone !== employee.phone) updateData.phone = formData.phone;
        if (formData.position !== employee.position) updateData.position = formData.position;
        if (formData.password) updateData.password = formData.password;

        return employeeApi.update(employee.id, updateData);
      } else {
        const createData = {
          name: formData.name,
          email: formData.email,
          position: formData.position,
          phone: formData.phone,
          password: formData.password,
          photo_url: updateData.photo_url || formData.photo_url,
        };
        return employeeApi.create(createData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success(employee ? 'Karyawan berhasil diupdate' : 'Karyawan berhasil ditambahkan');
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Terjadi kesalahan');
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Ukuran file maksimal 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setUploadError('File harus berupa gambar');
      return;
    }

    setUploadError('');

    // Create preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setSelectedFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  const displayUrl = previewUrl || formData.photo_url;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {employee ? 'Edit Karyawan' : 'Tambah Karyawan'}
              </h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Image Upload Section */}
            <div className="flex flex-col items-center">
              <div className="relative">
                {displayUrl ? (
                  <img
                    src={displayUrl}
                    alt="Preview"
                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
                  />
                ) : (
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-2xl">
                      {formData.name.charAt(0) || '?'}
                    </span>
                  </div>
                )}
              </div>

              <label
                htmlFor="photo-upload-modal"
                className="mt-3 flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
              >
                <Upload size={16} />
                <span>Ubah Foto</span>
              </label>
              <input
                id="photo-upload-modal"
                type="file"
                accept="image/jpeg,image/png,image/jpg,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />

              {uploadError && (
                <div className="mt-2 flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">
                  <X size={14} />
                  <span>{uploadError}</span>
                </div>
              )}

              <p className="mt-2 text-xs text-gray-500 text-center">
                Format: JPG, PNG, WEBP. Max 5MB.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={!!employee}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Posisi</label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {employee ? 'Reset Password (Kosongkan jika tidak ingin mengubah)' : 'Password'}
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={employee ? 'Kosongkan jika tidak ingin mengubah' : ''}
                required={!employee}
              />
            </div>

            <div className="pt-4 flex gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={mutation.isPending}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {mutation.isPending && <Loader className="w-4 h-4 animate-spin" />}
                {mutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
