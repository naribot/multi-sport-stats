import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../pages/playerDetail.css";
import { fetchNFLPlayerDetails } from "../api/nflApi";
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



export default function NFLExpandedPage() {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState(null as any);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!name) return;

    setLoading(true);
    setError("");

    const last = name.split(" ").slice(-1)[0]; 

    fetchNFLPlayerDetails(last)
      .then((stats) => setData(stats))
      .catch(() => setError("Player detail not found"))
      .finally(() => setLoading(false));
  }, [name]);

  const val = (v: number | null) =>
    v === null || v === undefined ? "—" : v;

  return (
    <div className="detail-page">
      <header className="detail-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
           Back
        </button>
        <h1 className="detail-title">NFL Player Details</h1>
      </header>

      {loading && <p className="detail-status">Loading...</p>}
      {error && <p className="detail-error">{error}</p>}

      {data && (
        <>
          <section className="detail-card">
            <div className="detail-main">
              <h2 className="detail-name">{data.name}</h2>
              <p className="detail-team">Age: {val(data.age)}</p>
            </div>

            <div className="detail-grid">

              <div className="detail-box">
                <h3>Rushing Yards</h3>
                <p className="detail-value">{val(data.rushingYards)}</p>
              </div>

              <div className="detail-box">
                <h3>Attempts</h3>
                <p className="detail-value">{val(data.rushingAttempts)}</p>
              </div>

              <div className="detail-box">
                <h3>Rush TD</h3>
                <p className="detail-value">{val(data.rushingTD)}</p>
              </div>

              <div className="detail-box">
                <h3>Receiving Yards</h3>
                <p className="detail-value">{val(data.receivingYards)}</p>
              </div>

              <div className="detail-box">
                <h3>Receptions</h3>
                <p className="detail-value">{val(data.receptions)}</p>
              </div>

              <div className="detail-box">
                <h3>Receiving TD</h3>
                <p className="detail-value">{val(data.receivingTD)}</p>
              </div>

              <div className="detail-box">
                <h3>Fumbles</h3>
                <p className="detail-value">{val(data.fumbles)}</p>
              </div>
            </div>
          </section>

          <section className="detail-charts">

            <div className="chart-card">
              <h3>Rushing Impact</h3>

              <div className="chart-row">
                <span>Yards</span>
                <div className="chart-bar">
                  <div
                    className="chart-bar-fill"
                    style={{ width: `${Math.min(data.rushingYards / 15, 100)}%` }}
                  />
                </div>
                <span className="chart-label">{data.rushingYards}</span>
              </div>

              <div className="chart-row">
                <span>Attempts</span>
                <div className="chart-bar">
                  <div
                    className="chart-bar-fill"
                    style={{ width: `${Math.min(data.rushingAttempts / 2, 100)}%` }}
                  />
                </div>
                <span className="chart-label">{data.rushingAttempts}</span>
              </div>
            </div>

            <div className="chart-card">
              <h3>Receiving Impact</h3>

              <div className="chart-row">
                <span>Yards</span>
                <div className="chart-bar">
                  <div
                    className="chart-bar-fill"
                    style={{ width: `${Math.min(data.receivingYards / 15, 100)}%` }}
                  />
                </div>
                <span className="chart-label">{data.receivingYards}</span>
              </div>

              <div className="chart-row">
                <span>Receptions</span>
                <div className="chart-bar">
                  <div
                    className="chart-bar-fill"
                    style={{ width: `${Math.min(data.receptions * 5, 100)}%` }}
                  />
                </div>
                <span className="chart-label">{data.receptions}</span>
              </div>
            </div>
          </section>

<section className="detail-charts">
  {/* GRAPH 1 – Rushing Profile */}
  <div className="chart-card">
    <h3>Rushing Profile</h3>

    <div className="chart-row">
      <span>Rushing Yards</span>
      <div className="chart-bar">
        <div
          className="chart-bar-fill"
          style={{
            width: `${Math.min((data.rushingYards ?? 0) / 20, 100)}%`,
          }}
        />
      </div>
      <span className="chart-label">{data.rushingYards}</span>
    </div>

    <div className="chart-row">
      <span>Attempts</span>
      <div className="chart-bar">
        <div
          className="chart-bar-fill"
          style={{
            width: `${Math.min((data.rushingAttempts ?? 0) / 3, 100)}%`,
          }}
        />
      </div>
      <span className="chart-label">{data.rushingAttempts}</span>
    </div>

    <div className="chart-row">
      <span>Rush TD</span>
      <div className="chart-bar">
        <div
          className="chart-bar-fill"
          style={{
            width: `${Math.min((data.rushingTD ?? 0) * 12, 100)}%`,
          }}
        />
      </div>
      <span className="chart-label">{data.rushingTD}</span>
    </div>
  </div>

  <div className="chart-card">
    <h3>Receiving Profile</h3>

    <div className="chart-row">
      <span>Receiving Yards</span>
      <div className="chart-bar">
        <div
          className="chart-bar-fill"
          style={{
            width: `${Math.min((data.receivingYards ?? 0) / 20, 100)}%`,
          }}
        />
      </div>
      <span className="chart-label">{data.receivingYards}</span>
    </div>

    <div className="chart-row">
      <span>Receptions</span>
      <div className="chart-bar">
        <div
          className="chart-bar-fill"
          style={{
            width: `${Math.min((data.receptions ?? 0) * 3, 100)}%`,
          }}
        />
      </div>
      <span className="chart-label">{data.receptions}</span>
    </div>

    <div className="chart-row">
      <span>Rec TD</span>
      <div className="chart-bar">
        <div
          className="chart-bar-fill"
          style={{
            width: `${Math.min((data.receivingTD ?? 0) * 12, 100)}%`,
          }}
        />
      </div>
      <span className="chart-label">{data.receivingTD}</span>
    </div>
  </div>
</section>

<section className="detail-charts-mlb">
  <div className="chart-card-mlb">
    <h3>Production</h3>
    <Bar
      data={{
        labels: ["Rush Yds", "Rec Yds", "Total TD"],
        datasets: [
          {
            label: data.name,
            data: [
              data.rushingYards ?? 0,
              data.receivingYards ?? 0,
              (data.rushingTD ?? 0) + (data.receivingTD ?? 0),
            ],
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

  {/* Chart 2 efficiency and usage as welk */}
  <div className="chart-card-mlb">
    <h3>Usage & Efficiency</h3>
    <Bar
      data={{
        labels: ["Rush Att", "Receptions", "Yds / Rush"],
        datasets: [
          {
            label: data.name,
            data: [
              data.rushingAttempts ?? 0,
              data.receptions ?? 0,
              data.yardsPerRush ?? 0,
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
