import React from 'react';

const AdminDashboard: React.FC = () => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* 통계 카드들 */}
        {[
          { title: '총 사용자', value: '1,234', change: '+12%', icon: '👥' },
          { title: '총 주문', value: '5,678', change: '+8%', icon: '📋' },
          { title: '총 상품', value: '2,345', change: '+15%', icon: '📦' },
          { title: '총 매출', value: '₩12,345,678', change: '+23%', icon: '💰' },
        ].map((stat) => (
          <div key={stat.title} className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-green-600">{stat.change}</p>
              </div>
              <div className="text-3xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-bold mb-4">관리자 대시보드</h2>
        <p className="text-gray-500">🚧 5단계에서 상세 기능이 구현됩니다</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
