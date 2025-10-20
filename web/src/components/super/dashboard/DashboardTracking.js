import React from 'react';
import style from './dashboard.module.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

// Lightweight dashboard that fetches Matomo-derived data from a local proxy.
// Expects endpoints on the same origin under /matomo/* (see README or proxy server).

function getPreviousDay() {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const year = yesterday.getFullYear();
  const month = ('0' + (yesterday.getMonth() + 1)).slice(-2);
  const day = ('0' + yesterday.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}

function parseLast12MonthXml(xmlString) {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    const results = Array.from(xmlDoc.getElementsByTagName('result'));
    return results.map(result => {
      const date = result.getAttribute('date') || '';
      const nbVisitsElem = result.getElementsByTagName('nb_visits')[0];
      const nb_visits = nbVisitsElem ? parseInt(nbVisitsElem.textContent || '0', 10) : 0;
      return { name: date, value: nb_visits };
    });
  } catch (e) {
    console.error('Failed to parse XML', e);
    return [];
  }
}

class DashboardTracking extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      liveVisits: 0,
      visits: 0,
      series: [],
      cities: [],
      loading: true,
      error: null
    };
    this.map = null;
  }

  componentDidMount() {
    const prevDate = getPreviousDay();
    const fetchLive = fetch(`/matomo/visits/last1day?date=${encodeURIComponent(prevDate)}`).then(r => r.json());
    const fetchSummary = fetch(`/matomo/visits/summary?date=${encodeURIComponent(prevDate)}`).then(r => r.json());
    const fetchMonths = fetch(`/matomo/visits/last12months`).then(r => r.text());
    const fetchCities = fetch(`/matomo/cities?date=${encodeURIComponent(prevDate)}`).then(r => r.json());

    Promise.allSettled([fetchLive, fetchSummary, fetchMonths, fetchCities])
      .then(results => {
        const newState = {};

        if (results[0].status === 'fulfilled') {
          const data = results[0].value;
          if (data && typeof data.nb_visits !== 'undefined') newState.liveVisits = Number(data.nb_visits);
        }

        if (results[1].status === 'fulfilled') {
          const data = results[1].value;
          if (data && typeof data.nb_visits !== 'undefined') newState.visits = Number(data.nb_visits);
        }

        if (results[2].status === 'fulfilled') {
          const xmlString = results[2].value;
          newState.series = parseLast12MonthXml(xmlString);
        }

        if (results[3].status === 'fulfilled') {
          const data = results[3].value || [];
          const mapped = data.map(item => ({
            label: item.label || item.city_name || '',
            visitors: item.sum_daily_nb_uniq_visitors || item.nb_visits || 0,
            lat: item.lat || item.latitude || 0,
            long: item.long || item.longitude || 0,
            city_name: item.city_name || '',
            region_name: item.region_name || '',
            country_name: item.country_name || ''
          }));
          newState.cities = mapped;
        }

        this.setState(Object.assign({ loading: false }, newState), () => {
          // initialize map if we have city data
          if (this.state.cities && this.state.cities.length > 0) {
            this.initMap();
          }
        });
      })
      .catch(err => {
        console.error('Error fetching dashboard data', err);
        this.setState({ error: String(err), loading: false });
      });
  }

  componentWillUnmount() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  initMap() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }

    this.map = L.map('dashboard-map', { center: [0, 0], zoom: 2 });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    (this.state.cities || []).forEach(city => {
      const lat = Number(city.lat);
      const lng = Number(city.long);
      if (!lat || !lng) return;
      const marker = L.circleMarker([lat, lng], { color: 'green', radius: 4 }).addTo(this.map);
      marker.bindPopup(`<strong>${city.label}</strong><br/>Visitors: ${city.visitors}`);
    });
  }

  renderLineChart(series) {
    if (!series || series.length === 0) return (<div style={{ color: '#777' }}>No monthly data available</div>);

    // Recharts expects an array of { name, value }
    const data = series.map(s => ({ name: s.name, Visits: Number(s.value || 0) }));

    return (
      <div style={{ width: '100%', height: 250 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="Visits" stroke="#2c7b29" strokeWidth={2} dot={{ r: 2 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  render() {
    const { liveVisits, visits, series, cities, loading, error } = this.state;

    return (
      <div>
        <div className="page-title-bar">
          <p className="page-title">Traffic Dashboard</p>
        </div>
        <div style={{ margin: '2%' }}>
          <div className="row justify-content-between">
            <div className="col-sm-6 box">
              <p className="subtitle" style={{ paddingLeft: 0 }}>Visits in the Past 24 Hours</p>
              <p>{liveVisits}</p>
            </div>
            <div className="col-sm-6 box">
              <p className="subtitle" style={{ paddingLeft: 0 }}>Total Visits</p>
              <p>{visits}</p>
            </div>
          </div>

          <div className="box1">
            <p className="subtitle">Visits for Last 12 Months</p>
            {this.renderLineChart(series)}
          </div>

          <div className="box2">
            <p className="subtitle">Visitor Map</p>
            <div id="dashboard-map" style={{ height: 400 }} />
          </div>
        </div>
      </div>
              
    );
  }
}

export default DashboardTracking;
