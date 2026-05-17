import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart3, Layers, AlertCircle } from 'lucide-react';  // ✅ Removed 'Users'
import PieChartWidget from './PieChartWidget';
import '../../styles/dashboard/dashboard.css';
import '../../styles/dashboard/glassomorphism.css';

interface CategoryStats {
  mainCategory: string;
  count: number;
  percentage: number;
  priority: number;
  subcategories: Array<{
    subcategoryName: string;
    count: number;
    percentage: number;
  }>;
}

interface DashboardData {
  totalComplaints: number;
  totalZones: number;
  totalDivisions: number;
  categories: CategoryStats[];
  uncategorized: number;
}

interface ChartData {
  name: string;
  value: number;
  color: string;
  priority?: number;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [error, setError] = useState<string | null>(null);

  const CATEGORY_COLORS: { [key: string]: string } = {
    'Staff Misconduct': '#FF6B6B',
    'Theft / Robbery / Security': '#4ECDC4',
    'Food & Catering Issues': '#FFE66D',
    'Cleanliness & Hygiene': '#95E1D3',
    'Train Delay & Operational Issues': '#A8E6CF',
    'Ticketing & Reservation Problems': '#FFD3B6',
    'Women Safety Issues': '#FF8B94',
    'Uncategorized': '#808080',
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/complaints/dashboard/stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data: DashboardData = await response.json();
      setDashboardData(data);

      // Prepare pie chart data
      const pieData: ChartData[] = data.categories.map((cat) => ({
        name: cat.mainCategory,
        value: cat.count,
        color: CATEGORY_COLORS[cat.mainCategory] || '#999999',
        priority: cat.priority,
      }));

      // Add uncategorized if exists
      if (data.uncategorized > 0) {
        pieData.push({
          name: 'Uncategorized',
          value: data.uncategorized,
          color: '#808080',
        });
      }

      setChartData(pieData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-wrapper">
          <div style={{
            background: 'rgba(255, 107, 107, 0.2)',
            border: '1px solid rgba(255, 107, 107, 0.5)',
            borderRadius: '20px',
            padding: '32px',
            textAlign: 'center'
          }}>
            <AlertCircle size={48} style={{ margin: '0 auto 16px', color: '#FF6B6B' }} />
            <h2 style={{ fontSize: '1.5rem', marginBottom: '8px', color: '#FF6B6B' }}>
              Error Loading Dashboard
            </h2>
            <p style={{ color: '#b0b0c0', marginBottom: '24px' }}>{error}</p>
            <button
              onClick={() => navigate('/')}
              style={{
                background: 'linear-gradient(135deg, #FF6B6B, #FF5252)',
                color: 'white',
                padding: '12px 32px',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Go Back Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Glass Header */}
      <div className="glass-header">
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '10px 16px',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#e0e0e0' }}>
            📊 IRVINS Dashboard
          </h1>
          <div style={{ width: '100px' }}></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-wrapper">
        {/* Title Section */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Complaint Analytics</h1>
          <p className="dashboard-subtitle">Real-time overview of complaint categories and statistics</p>
        </div>

        {/* Stat Cards */}
        <div className="stat-cards-grid">
          <div className="stat-card">
            <div className="stat-card-icon">📬</div>
            <div className="stat-card-label">Total Complaints</div>
            <div className="stat-card-value">{dashboardData?.totalComplaints || 0}</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-icon">🗺️</div>
            <div className="stat-card-label">Total Zones</div>
            <div className="stat-card-value">{dashboardData?.totalZones || 0}</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-icon">🏢</div>
            <div className="stat-card-label">Total Divisions</div>
            <div className="stat-card-value">{dashboardData?.totalDivisions || 0}</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-icon">📋</div>
            <div className="stat-card-label">Categories</div>
            <div className="stat-card-value">{dashboardData?.categories.length || 0}</div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="chart-section">
          {/* Pie Chart */}
          <div className="chart-card">
            <h2 className="chart-title">Complaint Distribution</h2>
            <div style={{ height: '420px', width: '100%' }}>
            <PieChartWidget data={chartData} loading={loading} />
            </div>
          </div>

          {/* Priority Alert */}
          <div className="chart-card">
            <h2 className="chart-title">Quick Stats</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {dashboardData?.categories.map((cat: CategoryStats, idx: number) => (
                <div
                  key={idx}
                  style={{
                    padding: '16px',
                    background: 'rgba(0, 212, 255, 0.1)',
                    border: '1px solid rgba(0, 212, 255, 0.3)',
                    borderRadius: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '700', color: '#e0e0e0', marginBottom: '4px' }}>
                      {cat.priority === 2 && '🚨 '} {cat.mainCategory}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#a0a0b0' }}>
                      {cat.subcategories.length} subcategories
                    </div>
                  </div>
                  <div style={{
                    fontSize: '1.8rem',
                    fontWeight: '900',
                    color: '#00d4ff'
                  }}>
                    {cat.count}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="category-breakdown">
          {/* Main Categories */}
          <div className="breakdown-card">
            <div className="breakdown-title">
              <div className="breakdown-title-icon">
                <BarChart3 size={16} />
              </div>
              Main Categories
            </div>
            <div>
              {dashboardData?.categories.map((cat: CategoryStats, idx: number) => (
                <div key={idx} className="category-item">
                  <span className="category-item-name">
                    {cat.priority === 2 && '🚨 '}{cat.mainCategory}
                  </span>
                  <span className="category-item-count">{cat.count}</span>
                  <span className="category-item-percentage">{cat.percentage.toFixed(1)}%</span>
                </div>
              ))}
              {dashboardData?.uncategorized! > 0 && (
                <div className="category-item">
                  <span className="category-item-name">❓ Uncategorized</span>
                  <span className="category-item-count">{dashboardData?.uncategorized}</span>
                  <span className="category-item-percentage">
                    {((dashboardData?.uncategorized! / dashboardData?.totalComplaints!) * 100).toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Top Subcategories */}
          <div className="breakdown-card">
            <div className="breakdown-title">
              <div className="breakdown-title-icon">
                <Layers size={16} />
              </div>
              Top Subcategories
            </div>
            <div>
              {dashboardData?.categories
                .flatMap((cat) =>
                  cat.subcategories.map((subcat) => ({
                    ...subcat,
                    mainCategory: cat.mainCategory,
                  }))
                )
                .sort((a, b) => b.count - a.count)
                .slice(0, 10)
                .map((subcat: any, idx: number) => (
                  <div key={idx} className="category-item">
                    <span className="category-item-name">
                      └─ {subcat.subcategoryName}
                    </span>
                    <span className="category-item-count">{subcat.count}</span>
                    <span className="category-item-percentage">{subcat.percentage.toFixed(1)}%</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;