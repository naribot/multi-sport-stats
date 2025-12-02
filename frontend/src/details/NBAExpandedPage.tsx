// src/pages/NBAExpandedPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../pages/playerDetail.css";
import { fetchNBAPlayerDetails } from "../api/nbaDetailsApi";
import type { NBAExpandedStats } from "../api/nbaDetailsApi";

import { Bar } from "react-chartjs-2";
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);


export default function NBAExpandedPage() {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<NBAExpandedStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!name) return;

    setLoading(true);
    setError("");

    const raw = name;
const lastName = raw.split(" ").slice(-1)[0];

fetchNBAPlayerDetails(lastName)
  .then((d) => setData(d))
  .catch(() => setError("Player detail not found"))
  .finally(() => setLoading(false));
  }, [name]);

  const pct = (v: number | null | undefined) =>
    v === null || v === undefined ? "—" : `${(v * 100).toFixed(1)}%`;

  return (
    <div className="detail-page">
      <header className="detail-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
           Back
        </button>
        <h1 className="detail-title">NBA Player Details</h1>
      </header>

      {loading && <p className="detail-status">Loading...</p>}
      {error && <p className="detail-error">{error}</p>}

      {data && (
        <>
          {/* Main card */}
          <section className="detail-card">
            <div className="detail-main">
              <h2 className="detail-name">{data.name}</h2>
              <p className="detail-team">{data.team}</p>
              <p className="detail-meta">
                Age: <strong>{data.age ?? "—"}</strong> ·{" "}
                Minutes: <strong>{data.minutes.toFixed(1)}</strong> per game
              </p>
            </div>

            <div className="detail-grid">
              <div className="detail-box">
                <h3>FG%</h3>
                <p className="detail-value">{pct(data.fg_pct)}</p>
              </div>
              <div className="detail-box">
                <h3>3P%</h3>
                <p className="detail-value">{pct(data.fg3_pct)}</p>
              </div>
              <div className="detail-box">
                <h3>FT%</h3>
                <p className="detail-value">{pct(data.ft_pct)}</p>
              </div>
              <div className="detail-box">
                <h3>Steals</h3>
                <p className="detail-value">{data.steals.toFixed(1)}</p>
              </div>
              <div className="detail-box">
                <h3>Blocks</h3>
                <p className="detail-value">{data.blocks.toFixed(1)}</p>
              </div>
              <div className="detail-box">
                <h3>Turnovers</h3>
                <p className="detail-value">{data.turnovers.toFixed(1)}</p>
              </div>
            </div>
          </section>

          <section className="detail-charts">
            <div className="chart-card">
              <h3>Shooting Split</h3>

              <div className="chart-row">
                <span>FG%</span>
                <div className="chart-bar">
                  <div
                    className="chart-bar-fill"
                    style={{ width: `${(data.fg_pct ?? 0) * 100}%` }}
                  />
                </div>
                <span className="chart-label">{pct(data.fg_pct)}</span>
              </div>

              <div className="chart-row">
                <span>3P%</span>
                <div className="chart-bar">
                  <div
                    className="chart-bar-fill"
                    style={{ width: `${(data.fg3_pct ?? 0) * 100}%` }}
                  />
                </div>
                <span className="chart-label">{pct(data.fg3_pct)}</span>
              </div>

              <div className="chart-row">
                <span>FT%</span>
                <div className="chart-bar">
                  <div
                    className="chart-bar-fill"
                    style={{ width: `${(data.ft_pct ?? 0) * 100}%` }}
                  />
                </div>
                <span className="chart-label">{pct(data.ft_pct)}</span>
              </div>
            </div>

            <div className="chart-card">
              <h3>Defense & Turnovers</h3>

              <div className="chart-row">
                <span>Steals</span>
                <div className="chart-bar">
                  <div
                    className="chart-bar-fill"
                    style={{
                      width: `${Math.min(data.steals * 25, 100)}%`,
                    }}
                  />
                </div>
                <span className="chart-label">
                  {data.steals.toFixed(1)}
                </span>
              </div>

              <div className="chart-row">
                <span>Blocks</span>
                <div className="chart-bar">
                  <div
                    className="chart-bar-fill"
                    style={{
                      width: `${Math.min(data.blocks * 25, 100)}%`,
                    }}
                  />
                </div>
                <span className="chart-label">
                  {data.blocks.toFixed(1)}
                </span>
              </div>

              <div className="chart-row">
                <span>Turnovers</span>
                <div className="chart-bar">
                  <div
                    className="chart-bar-fill chart-bar-negative"
                    style={{
                      width: `${Math.min(data.turnovers * 25, 100)}%`,
                    }}
                  />
                </div>
                <span className="chart-label">
                  {data.turnovers.toFixed(1)}
                </span>
              </div>
            </div>
          </section>


<section className="real-charts">
  <div className="chart-wrapper">
    <h2 className="chart-title">Shooting Percentages</h2>
    <Bar
      data={{
        labels: ["FG%", "3P%", "FT%"],
        datasets: [
          {
            label: "Percentage",
            data: [
              (data.fg_pct ?? 0) * 100,
              (data.fg3_pct ?? 0) * 100,
              (data.ft_pct ?? 0) * 100,
            ],
            backgroundColor: ["#3b82f6", "#8b5cf6", "#10b981"],
            borderWidth: 0.5,
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 1,
            ticks: { color: "#fff" },
          },
          x: {
            ticks: { color: "#fff" },
          },
        },
      }}
    />
  </div>

  <div className="chart-wrapper">
    <h2 className="chart-title">Defense & Turnovers</h2>
    <Bar
      data={{
        labels: ["Steals", "Blocks", "Turnovers"],
        datasets: [
          {
            label: "Per Game",
            data: [data.steals, data.blocks, data.turnovers],
            backgroundColor: ["#facc15", "#f87171", "#fb923c"],
            borderWidth: 0.5,
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: "#fff" },
          },
          x: {
            ticks: { color: "#fff" },
          },
        },
      }}
    />
  </div>
</section>
        </>
      )}
    </div>
  );
}
