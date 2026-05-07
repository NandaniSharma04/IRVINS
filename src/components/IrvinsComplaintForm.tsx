import React, { useState } from "react";
import { useForm } from "react-hook-form";
import bgImage from "../assets/bg4.jpeg";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
  senderName: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .required("Sender name is required"),
  subject: yup
    .string()
    .min(5, "Subject must be at least 5 characters")
    .required("Subject is required"),
  details: yup
    .string()
    .min(5, "Details must be at least 5 characters")
    .required("Complaint details are required"),
  zone: yup.string().required("Zone is required"),
  division: yup.string().required("Division is required"),
});

type FormData = yup.InferType<typeof schema>;

type AIComplaint = {
  id: number | null;
  complaintNo: string;
  subject: string;
  details: string;
  senderName: string;
  similarityPercent: number;
};

const IrvinsComplaintForm: React.FC = () => {
  const [serviceId] = useState<string>(() => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
    const randomNum = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    return `IRV-${dateStr}-${randomNum}`;
  });

  const [similarComplaints, setSimilarComplaints] = useState<AIComplaint[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<AIComplaint | null>(null);
  const [currentComplaintId, setCurrentComplaintId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSaveComplaint = async (data: FormData) => {
    setSubmitting(true);
    setError(null);
    const complaintData = { ...data, serviceId };

    try {
      const response = await fetch("http://localhost:8080/api/complaints/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(complaintData),
      });

      if (!response.ok) throw new Error(await response.text());
      const id = await response.json();
      setCurrentComplaintId(id);
      alert("Complaint saved successfully!");
    } catch (err) {
      console.error(err);
      setError("Error saving complaint.");
    } finally {
      setSubmitting(false);
    }
  };

  const onSimilarComplaint = async () => {
    const subject = watch("subject")?.trim() || "";
    const details = watch("details")?.trim() || "";

    if (!subject || !details) {
      setError("Please fill Subject and Details before checking similarity.");
      return;
    }
    if (!currentComplaintId) {
      setError("Please save complaint first before checking similarity.");
      return;
    }

    const combinedText = `${subject}. ${details}`;
    setLoadingSimilar(true);
    setError(null);

    try {
      const res = await fetch(
        `http://localhost:8080/api/complaints/similar?text=${encodeURIComponent(
          combinedText
        )}&currentId=${currentComplaintId}&k=5`
      );

      if (!res.ok) throw new Error("Failed API");
      const data = await res.json();

      const processed = data.map((c: any) => {
        let similarityValue = c.similarity ?? 0;
        if (similarityValue <= 1) similarityValue = similarityValue * 100;

        return {
          id: c.masterId || 0,
          complaintNo: c.complaintNo || "",
          subject: c.subject || "",
          details: c.details || "",
          senderName: c.senderName || "",
          similarityPercent: similarityValue,
        };
      }).filter((c: any) => c.similarityPercent >= 30);

      setSimilarComplaints(processed);
      setShowSidebar(true);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch similar complaints.");
    } finally {
      setLoadingSimilar(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative flex items-center justify-center px-4 py-10"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      {/* FORM CARD */}
      <div className="relative z-10 w-full max-w-5xl bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] p-10">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">

  {/* LEFT SIDE → Title */}
  <div>
    <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
      IRVINS Complaint Form
    </h1>
    <p className="text-sm text-gray-300 mt-2">
      Computer ID: {serviceId}
    </p>
  </div>

  {/* RIGHT SIDE → LOGO */}
  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/30 shadow-lg">
    <img
      src="/src/assets/logo.png"
      alt="Logo"
      className="w-full h-full object-cover"
    />
  </div>

</div>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit(onSaveComplaint)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-1 text-white/90">Sender Name</label>
              <input
                {...register("senderName")}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              {errors.senderName && <p className="text-red-500 text-xs mt-1">{errors.senderName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-white/90">Subject</label>
              <input
                {...register("subject")}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-white/90">Zone</label>
              <select {...register("zone")} className="
              w-full px-4 py-3 
              bg-white/70 
              border border-white/20 
              rounded-xl 
              text-black
              focus:outline-none 
              focus:ring-2 focus:ring-green-400">
                <option value="">Select Zone</option>
                <option value="NR">Northern Railway (NR)</option>
                <option value="CR">Central Railway (CR)</option>
                <option value="WR">Western Railway (WR)</option>
                <option value="ER">Eastern Railway (ER)</option>
                <option value="SR">Southern Railway (SR)</option>
                <option value="NWR">North Western Railway (NWR)</option>
                <option value="NER">North Eastern Railway (NER)</option>
                <option value="SCR">South Central Railway (SCR)</option>
                <option value="ECR">East Central Railway (ECR)</option>
               <option value="WCR">West Central Railway (WCR)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-white/90">Division</label>
              <select {...register("division")} className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition">
                <option value="">Select Division</option>
                <option value="DLI">Delhi</option>
                <option value="BKN">Bikaner</option>
                <option value="DDU">Pt. Deen Dayal Upadhyaya Division (Mughalsarai)</option>
                <option value="PRYJ">Prayagraj Division</option>
                <option value="MB">Moradabad Division</option>
                <option value="JAT">Jammu Tawi Division</option>
                <option value="BSL">Bhusawal Division</option>
                <option value="RJT">Rajkot Division</option>
                <option value="MLDT">Malda Town Division</option>
                <option value="BB">Mumbai (BB / CSMT) Division</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-white/90">Details</label>
            <textarea
              rows={5}
              {...register("details")}
              className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            />
            {errors.details && <p className="text-red-500 text-xs mt-1">{errors.details.message}</p>}
          </div>

          <div className="flex justify-end gap-4 pt-6">

  {/* SECONDARY BUTTON */}
  <button
    type="button"
    onClick={onSimilarComplaint}
    disabled={!currentComplaintId}
    className="
      px-6 py-3 
      bg-white/10 text-white 
      border border-white/20 
      rounded-xl 
      backdrop-blur-md
      hover:bg-white/20 
      hover:scale-105
      active:scale-95
      transition-all duration-200
      shadow-md hover:shadow-xl
      disabled:opacity-40 disabled:cursor-not-allowed
    "
  >
    🔍 Check Similar
  </button>

  {/* PRIMARY BUTTON */}
  <button
    type="submit"
    disabled={submitting}
    className="
      px-7 py-3 
      bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 
      text-white font-semibold 
      rounded-xl
      shadow-lg shadow-green-500/30
      hover:shadow-green-500/50
      hover:scale-105
      active:scale-95
      transition-all duration-200
      disabled:opacity-50
    "
  >
    {submitting ? "Saving..." : "💾 Save Complaint"}
  </button>

</div>
        </form>
      </div>

      {/* SIDEBAR FOR SIMILAR COMPLAINTS */}
      {showSidebar && (
        <div className="fixed top-0 right-0 h-full w-full md:w-[400px] bg-slate-900/95 backdrop-blur-xl z-50 shadow-2xl p-6 overflow-y-auto border-l border-white/10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Similar Complaints</h3>
            <button
  onClick={() => setShowSidebar(false)}
  className="
    w-8 h-8 flex items-center justify-center
    rounded-full bg-white/10 
    hover:bg-red-500/20 
    transition
  "
>
  ❌
</button>
          </div>

          {loadingSimilar ? (
            <p>Loading...</p>
          ) : similarComplaints.length === 0 ? (
            <p>No similar complaints above 30%</p>
          ) : (
            
            <div className="space-y-4">
  {similarComplaints.map((c) => (
    <div
      key={c.complaintNo}
      className="bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 transition cursor-pointer"
    >
      {/* Complaint Number */}
      <p
        className="font-bold text-blue-400 cursor-pointer hover:underline"
        onClick={() => setSelectedComplaint(c)}
      >
        {c.complaintNo}
      </p>

      {/* Subject */}
      <p className="text-sm text-gray-300 mt-1">
        {c.subject}
      </p>

      {/* ✅ AI Badge (REPLACES old Match text) */}
      <span className="inline-block mt-2 px-2 py-1 text-xs font-bold bg-green-500/20 text-green-300 rounded-full">
        {c.similarityPercent.toFixed(1)}% Match
      </span>

      {/* Tag Dropdown */}
      <select
        className="mt-3 w-full text-xs bg-slate-800 border border-white/10 rounded p-2 text-white"
        onChange={async (e) => {
          const selectedTag = e.target.value;
          if (!selectedTag) return;

          try {
            const res = await fetch("http://localhost:8080/api/complaints/save-tag", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                sourceComplaintId: currentComplaintId,
                targetComplaintId: c.id,
                similarityPercent: c.similarityPercent,
                similarityTag: selectedTag,
              }),
            });

            if (res.ok) alert("Tag Saved");
          } catch (err) {
            alert("Failed to save tag");
          }
        }}
      >
        <option value="">Select Tag</option>
        <option value="FULL">Full Similar</option>
        <option value="PARTIAL">Partial Similar</option>
        <option value="NOT">Not Similar</option>
      </select>
    </div>
  ))}
</div>
          )}
        </div>
      )}

      {/* MODAL FOR DETAILS */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedComplaint(null)}>
          <div className="bg-slate-900 text-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-white/10" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h4 className="font-bold">Complaint Details</h4>
              <button onClick={() => setSelectedComplaint(null)}>❌</button>
            </div>
            <div className="space-y-2 text-sm">
              <p><strong>No:</strong> {selectedComplaint.complaintNo}</p>
              <p><strong>Sender:</strong> {selectedComplaint.senderName}</p>
              <p><strong>Subject:</strong> {selectedComplaint.subject}</p>
              <p><strong>Details:</strong> {selectedComplaint.details}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IrvinsComplaintForm;