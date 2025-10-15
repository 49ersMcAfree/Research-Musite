import React from 'react';
import style from './dashboard.module.css';

class DashboardTracking extends React.Component {
  render() {
    return (
      <div>
        <div className="container">
          <div className={style.dashboard}>
            <h3 className="text-center" style={{marginTop:'10px'}}>Dashboard Tracking</h3>
            <div className={style.content}>
              <p className="text-left" style={{marginTop:'10px', fontSize: '14px'}}>
                Use this page to monitor jobs, recent activity and server-side processing for submitted sequences. Replace this
                placeholder with your dashboard widgets (charts, tables or summary cards) as needed.
              </p>
              {/* Add your dashboard components here, following the project's component patterns */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DashboardTracking;
