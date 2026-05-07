import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/bg5.jpeg";
import "../styles/tagging.css";

const OldComplaintTagging: React.FC = () => {
  const [complaintNo, setComplaintNo] = useState("");
  const [result, setResult] = useState<any>(null);
  const [tags, setTags] = useState<any[]>([]);
  const [similarComplaints, setSimilarComplaints] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!complaintNo.trim()) {
      setError("Please enter complaint number");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setTags([]);
    setSimilarComplaints([]);

    try {
      const cleanedComplaintNo = complaintNo.trim();

      // =========================
      // FETCH TAG DETAILS
      // =========================
      const res = await fetch(
        `http://localhost:8080/api/complaints/tag-details/${cleanedComplaintNo}`
      );

      if (!res.ok) {
        throw new Error("Complaint not found");
      }

      const data = await res.json();

      setResult({
        senderName: data.senderName,
        complaintNo: data.complaintNo,
      });

      setTags(data.tags || []);

      // =========================
      // FETCH SIMILAR COMPLAINTS
      // =========================
      const similarRes = await fetch(
        `http://localhost:8080/api/complaints/similar-from-complaint/${cleanedComplaintNo}`
      );

      if (similarRes.ok) {
        const similarData = await similarRes.json();

        const filtered = similarData.filter(
          (item: any) => item.similarity >= 30
        );

        setSimilarComplaints(filtered);
      }

    } catch (err) {
      setError("Complaint not found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="tagging-container"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <div className="tagging-card">

        {/* CLOSE BUTTON */}
        <button
          className="close-btn"
          onClick={() => navigate("/")}
        >
          ✕
        </button>

        {/* TITLE */}
        <h1>Old Complaint Tagging</h1>

        {/* SEARCH INPUT */}
        <input
          type="text"
          placeholder="Enter Complaint Number"
          value={complaintNo}
          onChange={(e) => setComplaintNo(e.target.value)}
        />

        {/* SEARCH BUTTON */}
        <button
          className="search-btn"
          onClick={handleSearch}
        >
          {loading ? "Searching..." : "Search"}
        </button>

        {/* ERROR */}
        {error && (
          <p className="error">
            {error}
          </p>
        )}

        {/* RESULTS */}
        {result && (
          <div className="result-box">

            {/* BASIC INFO */}
            <div className="complaint-info">
              <p>
                <strong>Name:</strong> {result.senderName}
              </p>

              <p>
                <strong>Complaint No:</strong> {result.complaintNo}
              </p>
            </div>

            {/* ========================================= */}
            {/* OLD TAGGING TABLE */}
            {/* ========================================= */}

            <div className="section-title">
              Existing Complaint Tags
            </div>

            <div className="tags-table">

              <div className="table-header">
                <span>Complaint ID</span>
                <span>Similarity</span>
                <span>Tag</span>
              </div>

              {tags.length > 0 ? (
                tags.map((tag, index) => (

                  <div
                    className="table-row"
                    key={index}
                  >

                    <span>
                      {tag.sourceComplaintId === tag.targetComplaintId
                        ? tag.sourceComplaintId
                        : tag.targetComplaintId}
                    </span>

                    <span>
                      {tag.similarityPercent?.toFixed(1)}%
                    </span>

                    <span>
                      {tag.similarityTag}
                    </span>

                  </div>

                ))
              ) : (
                <p className="no-data">
                  No related tags found.
                </p>
              )}

            </div>

            {/* ========================================= */}
            {/* SIMILAR COMPLAINTS TABLE */}
            {/* ========================================= */}

            <div className="section-title similar-title">
              Similar Complaints
            </div>

            {similarComplaints.length > 0 ? (

              <div className="similarity-table">

                <div className="similarity-header">
                  <span>Complaint ID</span>
                  <span>Subject</span>
                  <span>Match</span>
                </div>

                {similarComplaints.map((item, index) => (

                  <div
                    className="similarity-row"
                    key={index}
                  >

                    <span className="complaint-id">
                      {item.complaintNo}
                    </span>

                    <span className="subject-cell">
                      {item.subject}
                    </span>

                    <span className="match-badge">
                      {item.similarity?.toFixed(1)}%
                    </span>

                  </div>

                ))}

              </div>

            ) : (

              <div className="empty-similarity">
                No similar complaints found.
              </div>

            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default OldComplaintTagging;