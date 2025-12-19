
import React, { useState, useEffect } from 'react';
import { COLORS } from '../constants';

const PROFILE_STORAGE_KEY = 'dak_tnt_profile_v1';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  nationality: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  idNumber: string;
  memberSince: string;
  lastUpdated: string;
  submissionDate: string;
  status: 'Verified' | 'Pending' | 'Unverified';
}

const Profile: React.FC = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [tempProfile, setTempProfile] = useState<UserProfile | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'warning' } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      setProfile(data);
      setTempProfile(data);
    } else {
      const initialProfile: UserProfile = {
        firstName: 'Văn A',
        lastName: 'Nguyễn',
        email: 'vna.nguyen@example.com',
        phone: '0901234567',
        dateOfBirth: '1995-10-20',
        nationality: 'VN',
        address: '123 Đường ABC, Quận 1',
        city: 'Hồ Chí Minh',
        state: 'Hồ Chí Minh',
        zipCode: '70000',
        idNumber: '079195000123',
        memberSince: '15/05/2023',
        lastUpdated: '01/01/2024',
        submissionDate: '15/05/2023',
        status: 'Verified'
      };
      setProfile(initialProfile);
      setTempProfile(initialProfile);
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(initialProfile));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!tempProfile) return;
    const { id, value } = e.target;
    setTempProfile({ ...tempProfile, [id]: value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempProfile) return;

    setIsSaving(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const updatedProfile = { 
      ...tempProfile, 
      lastUpdated: new Date().toLocaleDateString('vi-VN') 
    };
    
    setProfile(updatedProfile);
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updatedProfile));
    setIsEditMode(false);
    setIsSaving(false);
    showNotification('Cập nhật thông tin thành công!', 'success');
  };

  const showNotification = (message: string, type: 'success' | 'warning') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000);
  };

  if (!profile || !tempProfile) return <div className="p-8 text-[#848e9c]">Đang tải...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Thông tin tài khoản</h1>
        <p className="text-[#848e9c]">Quản lý thông tin cá nhân và trạng thái xác thực danh tính (KYC).</p>
      </div>

      {/* Alert Notification */}
      {alert && (
        <div className={`p-4 rounded-lg flex items-center gap-3 animate-in slide-in-from-top duration-300 ${
          alert.type === 'success' ? 'bg-[#0ecb81]/10 text-[#0ecb81]' : 'bg-[#f0b90b]/10 text-[#f0b90b]'
        }`}>
          <i className={`bi ${alert.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'}`}></i>
          <span className="text-sm font-medium">{alert.message}</span>
        </div>
      )}

      {/* Verification Status Card */}
      <div className="bg-[#1e2329] border border-[#2b3139] rounded-xl overflow-hidden">
        <div className="px-6 py-4 bg-[#2b3139] border-b border-[#2b3139] flex items-center gap-2 font-bold">
          <i className="bi bi-shield-check-fill text-[#f0b90b]"></i>
          Trạng thái xác minh
        </div>
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-[#2b3139]">
            <span className="text-[#848e9c]">Xác thực danh tính</span>
            <span className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-2 ${
              profile.status === 'Verified' ? 'bg-[#0ecb81]/20 text-[#0ecb81]' : 'bg-[#f0b90b]/20 text-[#f0b90b]'
            }`}>
              <i className="bi bi-check-circle-fill"></i>
              {profile.status === 'Verified' ? 'Đã xác minh' : 'Đang chờ'}
            </span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-[#2b3139]">
            <span className="text-[#848e9c]">Ngày tham gia</span>
            <span className="font-medium">{profile.memberSince}</span>
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="text-[#848e9c]">Cập nhật lần cuối</span>
            <span className="font-medium">{profile.lastUpdated}</span>
          </div>
        </div>
      </div>

      {/* Personal Information Card */}
      <div className="bg-[#1e2329] border border-[#2b3139] rounded-xl overflow-hidden">
        <div className="px-6 py-4 bg-[#2b3139] border-b border-[#2b3139] flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold">
            <i className="bi bi-person-fill text-[#f0b90b]"></i>
            Thông tin cá nhân
          </div>
          <button 
            onClick={() => {
              if (isEditMode) setTempProfile(profile);
              setIsEditMode(!isEditMode);
            }}
            className="text-xs font-bold bg-[#1e2329] px-3 py-1.5 rounded border border-[#2b3139] hover:border-[#f0b90b] transition-all flex items-center gap-2"
          >
            <i className={`bi ${isEditMode ? 'bi-x-circle' : 'bi-pencil-fill'}`}></i>
            {isEditMode ? 'Hủy' : 'Chỉnh sửa'}
          </button>
        </div>
        <div className="p-6">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs text-[#848e9c] font-bold uppercase">Họ</label>
                <input 
                  type="text" id="lastName"
                  disabled={!isEditMode}
                  value={tempProfile.lastName}
                  onChange={handleInputChange}
                  className="w-full bg-[#0b0e11] border border-[#2b3139] rounded-lg p-3 outline-none focus:border-[#f0b90b] disabled:opacity-60 transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-[#848e9c] font-bold uppercase">Tên</label>
                <input 
                  type="text" id="firstName"
                  disabled={!isEditMode}
                  value={tempProfile.firstName}
                  onChange={handleInputChange}
                  className="w-full bg-[#0b0e11] border border-[#2b3139] rounded-lg p-3 outline-none focus:border-[#f0b90b] disabled:opacity-60 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs text-[#848e9c] font-bold uppercase">Email</label>
                <input 
                  type="email" id="email"
                  disabled={true} // Email typically fixed in these systems
                  value={tempProfile.email}
                  className="w-full bg-[#2b3139]/50 border border-[#2b3139] rounded-lg p-3 text-[#848e9c] cursor-not-allowed"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-[#848e9c] font-bold uppercase">Số điện thoại</label>
                <input 
                  type="tel" id="phone"
                  disabled={!isEditMode}
                  value={tempProfile.phone}
                  onChange={handleInputChange}
                  className="w-full bg-[#0b0e11] border border-[#2b3139] rounded-lg p-3 outline-none focus:border-[#f0b90b] disabled:opacity-60 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs text-[#848e9c] font-bold uppercase">Ngày sinh</label>
                <input 
                  type="date" id="dateOfBirth"
                  disabled={!isEditMode}
                  value={tempProfile.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full bg-[#0b0e11] border border-[#2b3139] rounded-lg p-3 outline-none focus:border-[#f0b90b] disabled:opacity-60 transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-[#848e9c] font-bold uppercase">Quốc tịch</label>
                <select 
                  id="nationality"
                  disabled={!isEditMode}
                  value={tempProfile.nationality}
                  onChange={handleInputChange}
                  className="w-full bg-[#0b0e11] border border-[#2b3139] rounded-lg p-3 outline-none focus:border-[#f0b90b] disabled:opacity-60 transition-all"
                >
                  <option value="VN">Việt Nam</option>
                  <option value="US">Hoa Kỳ</option>
                  <option value="SG">Singapore</option>
                  <option value="JP">Nhật Bản</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-[#848e9c] font-bold uppercase">Địa chỉ cư trú</label>
              <input 
                type="text" id="address"
                disabled={!isEditMode}
                value={tempProfile.address}
                onChange={handleInputChange}
                className="w-full bg-[#0b0e11] border border-[#2b3139] rounded-lg p-3 outline-none focus:border-[#f0b90b] disabled:opacity-60 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="text-xs text-[#848e9c] font-bold uppercase">Thành phố</label>
                <input 
                  type="text" id="city"
                  disabled={!isEditMode}
                  value={tempProfile.city}
                  onChange={handleInputChange}
                  className="w-full bg-[#0b0e11] border border-[#2b3139] rounded-lg p-3 outline-none focus:border-[#f0b90b] disabled:opacity-60 transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-[#848e9c] font-bold uppercase">Tỉnh/Trạng</label>
                <input 
                  type="text" id="state"
                  disabled={!isEditMode}
                  value={tempProfile.state}
                  onChange={handleInputChange}
                  className="w-full bg-[#0b0e11] border border-[#2b3139] rounded-lg p-3 outline-none focus:border-[#f0b90b] disabled:opacity-60 transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-[#848e9c] font-bold uppercase">Mã bưu chính</label>
                <input 
                  type="text" id="zipCode"
                  disabled={!isEditMode}
                  value={tempProfile.zipCode}
                  onChange={handleInputChange}
                  className="w-full bg-[#0b0e11] border border-[#2b3139] rounded-lg p-3 outline-none focus:border-[#f0b90b] disabled:opacity-60 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-[#848e9c] font-bold uppercase">Số CMND/CCCD/Hộ chiếu</label>
              <input 
                type="text" id="idNumber"
                disabled={true} // ID number fixed after verification
                value={tempProfile.idNumber}
                className="w-full bg-[#2b3139]/50 border border-[#2b3139] rounded-lg p-3 text-[#848e9c] cursor-not-allowed"
              />
            </div>

            {isEditMode && (
              <div className="pt-4 border-t border-[#2b3139] flex gap-4">
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-[#f0b90b] text-[#0b0e11] py-3 rounded-lg font-bold hover:bg-[#f0b90b]/90 transition-all flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <span className="w-5 h-5 border-2 border-[#0b0e11] border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <i className="bi bi-check-lg"></i>
                  )}
                  Lưu thay đổi
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setTempProfile(profile);
                    setIsEditMode(false);
                  }}
                  className="flex-1 border border-[#2b3139] text-[#eaecef] py-3 rounded-lg font-bold hover:bg-[#2b3139] transition-all"
                >
                  Hủy bỏ
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Identity Documents Card */}
      <div className="bg-[#1e2329] border border-[#2b3139] rounded-xl overflow-hidden">
        <div className="px-6 py-4 bg-[#2b3139] border-b border-[#2b3139] flex items-center gap-2 font-bold">
          <i className="bi bi-file-earmark-text-fill text-[#f0b90b]"></i>
          Tài liệu định danh
        </div>
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-[#2b3139]">
            <span className="text-[#848e9c]">Loại tài liệu</span>
            <span className="font-medium">Căn cước công dân</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-[#2b3139]">
            <span className="text-[#848e9c]">Trạng thái tài liệu</span>
            <span className="text-[#0ecb81] font-bold flex items-center gap-2">
              <i className="bi bi-patch-check-fill"></i>
              Hợp lệ
            </span>
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="text-[#848e9c]">Ngày gửi yêu cầu</span>
            <span className="font-medium">{profile.submissionDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
