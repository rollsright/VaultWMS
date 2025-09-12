function Home() {
  return (
    <div className="warehouse-dashboard">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Warehouse Dashboard</h1>
        <p className="dashboard-subtitle">Manage your warehouse operations and inventory</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-card-orange">
          <div className="stat-icon">🛒</div>
          <div className="stat-content">
            <div className="stat-number">127</div>
            <div className="stat-label">Pending Orders</div>
            <div className="stat-change">+12% from last week</div>
          </div>
        </div>

        <div className="stat-card stat-card-green">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <div className="stat-number">2,847</div>
            <div className="stat-label">Items in Stock</div>
            <div className="stat-change">Across all warehouses</div>
          </div>
        </div>

        <div className="stat-card stat-card-blue">
          <div className="stat-icon">🚚</div>
          <div className="stat-content">
            <div className="stat-number">43</div>
            <div className="stat-label">Active Shipments</div>
            <div className="stat-change">In transit</div>
          </div>
        </div>

        <div className="stat-card stat-card-red">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <div className="stat-number">8</div>
            <div className="stat-label">Low Stock Alerts</div>
            <div className="stat-change">Items need restocking</div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="content-grid">
        {/* Quick Actions */}
        <div className="card">
          <h2 className="card-title">Quick Actions</h2>
          <p className="card-subtitle">Common warehouse management tasks</p>
          
          <div className="quick-actions-grid">
            <div className="quick-action-item">
              <div className="quick-action-icon quick-action-blue">👥</div>
              <div className="quick-action-content">
                <div className="quick-action-title">Manage Customers</div>
                <div className="quick-action-desc">Add or update customer info</div>
              </div>
            </div>

            <div className="quick-action-item">
              <div className="quick-action-icon quick-action-green">✅</div>
              <div className="quick-action-content">
                <div className="quick-action-title">Inventory Check</div>
                <div className="quick-action-desc">Review stock levels</div>
              </div>
            </div>

            <div className="quick-action-item">
              <div className="quick-action-icon quick-action-purple">🏭</div>
              <div className="quick-action-content">
                <div className="quick-action-title">Warehouse Setup</div>
                <div className="quick-action-desc">Configure locations</div>
              </div>
            </div>

            <div className="quick-action-item">
              <div className="quick-action-icon quick-action-orange">📊</div>
              <div className="quick-action-content">
                <div className="quick-action-title">View Reports</div>
                <div className="quick-action-desc">Analytics & insights</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h2 className="card-title">Recent Activity</h2>
          <p className="card-subtitle">Latest warehouse operations</p>
          
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon activity-green">✅</div>
              <div className="activity-content">
                <div className="activity-title">Order #1234 shipped</div>
                <div className="activity-time">2 hours ago</div>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon activity-blue">🔄</div>
              <div className="activity-content">
                <div className="activity-title">Inventory updated for SKU-001</div>
                <div className="activity-time">4 hours ago</div>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon activity-purple">👤</div>
              <div className="activity-content">
                <div className="activity-title">New customer added</div>
                <div className="activity-time">6 hours ago</div>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon activity-orange">📦</div>
              <div className="activity-content">
                <div className="activity-title">Shipment received</div>
                <div className="activity-time">1 day ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
