import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../pages/playerDetail.css";

import { fetchMLBPlayerDetails } from "../api/mlbDetailsApi";
import type { MLBExpandedStats } from "../api/mlbDetailsApi";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);


export default function MLBExpandedPage() {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<MLBExpandedStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!name) return;

    setLoading(true);
    setError("");

    const last = name.split(" ").slice(-1)[0]; 

    fetchMLBPlayerDetails(last)
      .then((d) => setData(d))
      .catch(() => setError("Player detail not found"))
      .finally(() => setLoading(false));
  }, [name]);

  const pct = (v: number | null | undefined) =>
    v == null ? "—" : `${(v * 100).toFixed(1)}%`;

  return (
    <div className="detail-page">
      <header className="detail-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
           Back
        </button>
        <h1 className="detail-title">MLB Player Details</h1>
      </header>

      {loading && <p className="detail-status">Loading...</p>}
      {error && <p className="detail-error">{error}</p>}

      {data && (
        <>
          <section className="detail-card">
            <div className="detail-main">
              <h2 className="detail-name">{data.name}</h2>
              <p className="detail-team">{data.team}</p>
              <p className="detail-meta">
                Age: <strong>{data.age}</strong> · Games:{" "}
                <strong>{data.games}</strong>
              </p>
            </div>

            <div className="detail-grid">
              <div className="detail-box">
                <h3>AVG</h3>
                <p className="detail-value">{data.battingAverage.toFixed(3)}</p>
              </div>
              <div className="detail-box">
                <h3>OBP</h3>
                <p className="detail-value">{data.obp.toFixed(3)}</p>
              </div>
              <div className="detail-box">
                <h3>SLG</h3>
                <p className="detail-value">{data.slg.toFixed(3)}</p>
              </div>
              <div className="detail-box">
                <h3>OPS</h3>
                <p className="detail-value">{data.ops.toFixed(3)}</p>
              </div>

              <div className="detail-box">
                <h3>Hits</h3>
                <p className="detail-value">{data.hits}</p>
              </div>
              <div className="detail-box">
                <h3>HR</h3>
                <p className="detail-value">{data.homeRuns}</p>
              </div>
              <div className="detail-box">
                <h3>Walks</h3>
                <p className="detail-value">{data.walks}</p>
              </div>
              <div className="detail-box">
                <h3>Strikeouts</h3>
                <p className="detail-value">{data.strikeouts}</p>
              </div>
            </div>
          </section>

          {/* GRAPH here */}
          <section className="detail-charts">
            <div className="chart-card">
              <h3>Power Metrics</h3>

              <div className="chart-row">
                <span>HR</span>
                <div className="chart-bar">
                  <div
                    className="chart-bar-fill"
                    style={{ width: `${Math.min(data.homeRuns * 2, 100)}%` }}
                  />
                </div>
                <span className="chart-label">{data.homeRuns}</span>
              </div>

              <div className="chart-row">
                <span>RBIs</span>
                <div className="chart-bar">
                  <div
                    className="chart-bar-fill"
                    style={{ width: `${Math.min(data.RBIs * 2, 100)}%` }}
                  />
                </div>
                <span className="chart-label">{data.RBIs}</span>
              </div>
            </div>

            <div className="chart-card">
              <h3>Contact Metrics</h3>

              <div className="chart-row">
                <span>Hits</span>
                <div className="chart-bar">
                  <div
                    className="chart-bar-fill"
                    style={{ width: `${Math.min(data.hits * 0.4, 100)}%` }}
                  />
                </div>
                <span className="chart-label">{data.hits}</span>
              </div>

              <div className="chart-row">
                <span>Walks</span>
                <div className="chart-bar">
                  <div
                    className="chart-bar-fill"
                    style={{ width: `${Math.min(data.walks * 1, 100)}%` }}
                  />
                </div>
                <span className="chart-label">{data.walks}</span>
              </div>
            </div>
          </section>

          
<section className="detail-charts">
  {/* GRAPH 1 – Hitting Power */}
  <div className="chart-card">
    <h3>Hitting Power</h3>

    <div className="chart-row">
      <span>Home Runs</span>
      <div className="chart-bar">
        <div
          className="chart-bar-fill"
          style={{ width: `${Math.min(data.homeRuns * 2, 100)}%` }}
        />
      </div>
      <span className="chart-label">{data.homeRuns}</span>
    </div>

    <div className="chart-row">
      <span>RBIs</span>
      <div className="chart-bar">
        <div
          className="chart-bar-fill"
          style={{ width: `${Math.min(data.RBIs * 0.5, 100)}%` }}
        />
      </div>
      <span className="chart-label">{data.RBIs}</span>
    </div>
  </div>

  {/* GRAPH 2 */}
  <div className="chart-card">
    <h3>Advanced Rates</h3>

    <div className="chart-row">
      <span>AVG</span>
      <div className="chart-bar">
        <div
          className="chart-bar-fill"
          style={{ width: `${(data.battingAverage ?? 0) * 300}%` }}
        />
      </div>
      <span className="chart-label">{data.battingAverage.toFixed(3)}</span>
    </div>

    <div className="chart-row">
      <span>OBP</span>
      <div className="chart-bar">
        <div
          className="chart-bar-fill"
          style={{ width: `${(data.obp ?? 0) * 250}%` }}
        />
      </div>
      <span className="chart-label">{data.obp.toFixed(3)}</span>
    </div>

    <div className="chart-row">
      <span>SLG</span>
      <div className="chart-bar">
        <div
          className="chart-bar-fill"
          style={{ width: `${(data.slg ?? 0) * 180}%` }}
        />
      </div>
      <span className="chart-label">{data.slg.toFixed(3)}</span>
    </div>
  </div>
</section>

<section className="detail-charts-mlb">

  {/* Chart 1 */}
  <div className="chart-card-mlb">
    <h3>Power Stats</h3>
    <Bar
      data={{
        labels: ["HR", "RBIs", "Doubles"],
        datasets: [
          {
            label: data.name,
            data: [data.homeRuns, data.RBIs, data.doubles],
            backgroundColor: ["green", "orange", "blue"],

          },
        ],
      }}
      options={{
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true },
        },
      }}
    />
  </div>

  {/* Chart 2 — efficiency chart */}
  <div className="chart-card-mlb">
    <h3>Efficiency</h3>
    <Bar
      data={{
        labels: ["AVG", "OBP", "SLG"],
        datasets: [
          {
            label: data.name,
            data: [
              data.battingAverage,
              data.obp,
              data.slg,
            ],
            backgroundColor: ["grey", "darkblue", "lime"],

          },
        ],
      }}
      options={{
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            max: 1, 
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
