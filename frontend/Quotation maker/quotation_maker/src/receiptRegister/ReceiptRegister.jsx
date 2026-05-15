import { useState, useEffect, useMemo } from "react";
import Navbar from "../Navbar/Navbar";
import api from "../axios/axios"; // Axios instance with baseURL and auth headers

const STATUS_CLS = {
  Paid:    "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Partial: "bg-blue-50 text-blue-700 border border-blue-200",
  Pending: "bg-amber-50 text-amber-700 border border-amber-200",
  Overdue: "bg-red-50 text-red-600 border border-red-200",
};

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function fmtDate(d) {
  if (!d) return "";
  const [y, m, day] = d.split("-");
  return `${day} ${MONTHS[+m - 1]} ${y}`;
}

function fmtAmt(n) {
  return "₹" + Number(n || 0).toLocaleString("en-IN");
}

// Sheet columns: S.no, ID, CurrentDate, ChequeDate, ChequeNumber, Bank, Amount, PartyName, TypeOfPayment, Status
function parseRows(raw) {
  if (!Array.isArray(raw) || raw.length < 2) return [];
  return raw.slice(1).map((r) => ({
    sno:           r[0] || "",
    id:            r[1] || "",
    date:          r[2] || "",
    chequeDate:    r[3] || "",
    cheque:        r[4] || "",
    bank:          r[5] || "",
    amount:        r[6] || "",
    customer:      r[7] || "",
    modeOfPayment: r[8] || "",
    status:        r[9] || "",
  }));
}

const EMPTY_FORM = {
  currentDate: "", chequeDate: "", chequeNumber: "",
  bank: "", amount: "", partyName: "",
  typeOfPayment: "", status: "",
};

// ── Icons ──────────────────────────────────────────────
const IconPlus    = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>;
const IconClose   = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>;
const IconEdit    = () => <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2a2 2 0 01.586-1.414z"/></svg>;
const IconTrash   = () => <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4h6v3M3 7h18"/></svg>;
const IconWarn    = () => <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" d="M12 8v4m0 4h.01"/></svg>;
const IconRefresh = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582M20 20v-5h-.582M5.635 19A9 9 0 104.582 9H4"/></svg>;
const IconSpinner = () => <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>;

// ── Field wrapper ──────────────────────────────────────
const inputCls = "w-full px-3 py-2 text-sm border border-slate-200 rounded-xl text-slate-700 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none bg-white";

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

// ── Toast ──────────────────────────────────────────────
function Toast({ msg, type }) {
  if (!msg) return null;
  const cls = type === "error"
    ? "bg-red-50 border-red-200 text-red-700"
    : "bg-emerald-50 border-emerald-200 text-emerald-700";
  return (
    <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium shadow-lg ${cls}`}>
      {msg}
    </div>
  );
}

// ── Add / Edit Modal ───────────────────────────────────
function ReceiptModal({ mode, row, onClose, onSaved, showToast }) {
  const isEdit = mode === "edit";
  const [form, setForm] = useState(
    isEdit
      ? {
          currentDate:   row.date,
          chequeDate:    row.chequeDate,
          chequeNumber:  row.cheque,
          bank:          row.bank,
          amount:        row.amount,
          partyName:     row.customer,
          typeOfPayment: row.modeOfPayment,
          status:        row.status,
        }
      : { ...EMPTY_FORM }
  );
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.currentDate || !form.amount || !form.partyName || !form.bank || !form.typeOfPayment) {
      showToast("Please fill all required fields.", "error");
      return;
    }
    setLoading(true);
    try {
      isEdit
        ? await api.put(`/reciept/${row.id}`, form)
        : await api.post("/reciept", form);

      showToast(isEdit ? "Receipt updated!" : "Receipt added!", "success");
      onSaved();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Something went wrong";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-md shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">{isEdit ? `Edit — ${row.id}` : "Add New Receipt"}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><IconClose /></button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Current Date *">
              <input type="date" value={form.currentDate} onChange={set("currentDate")} className={inputCls} />
            </Field>
            <Field label="Cheque Date">
              <input type="date" value={form.chequeDate} onChange={set("chequeDate")} className={inputCls} />
            </Field>
          </div>

          <Field label="Party Name *">
            <input type="text" value={form.partyName} onChange={set("partyName")} placeholder="e.g. Raj Enterprises" className={inputCls} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Amount (₹) *">
              <input type="number" value={form.amount} onChange={set("amount")} placeholder="0" className={inputCls} />
            </Field>
            <Field label="Cheque No.">
              <input type="text" value={form.chequeNumber} onChange={set("chequeNumber")} placeholder="Optional" className={inputCls} />
            </Field>
          </div>

          <Field label="Bank *">
            <input type="text" value={form.bank} onChange={set("bank")} placeholder="e.g. HDFC Bank" className={inputCls} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Type of Payment *">
              <select value={form.typeOfPayment} onChange={set("typeOfPayment")} className={inputCls}>
                <option value="">Select</option>
                {["NEFT","UPI","Cheque","Cash","RTGS","IMPS"].map((m) => <option key={m}>{m}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select value={form.status} onChange={set("status")} className={inputCls}>
                <option value="">Select</option>
                {["Pending","Paid","Partial","Overdue"].map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 rounded-xl transition-colors">
            {loading && <IconSpinner />}
            {isEdit ? "Save changes" : "Add Receipt"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Delete Modal ───────────────────────────────────────
function DeleteModal({ row, onClose, onDeleted, showToast }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/reciept/${row.id}`);
      showToast("Receipt deleted.", "success");
      onDeleted();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Delete failed";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-sm shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">Delete Receipt</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><IconClose /></button>
        </div>
        <div className="px-6 py-5">
          <div className="flex gap-3 items-start bg-red-50 border border-red-100 rounded-xl p-4">
            <IconWarn />
            <p className="text-sm text-red-700">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{row.id} ({row.customer})</span>?
              This action cannot be undone.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
            Cancel
          </button>
          <button onClick={handleDelete} disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-60 rounded-xl transition-colors">
            {loading && <IconSpinner />}
            Yes, delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────
export default function ReceiptRegister() {
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [statusF, setStatusF] = useState("");
  const [methodF, setMethodF] = useState("");
  const [modal, setModal]     = useState(null);
  const [toast, setToast]     = useState({ msg: "", type: "" });

  // ── Fetch ────────────────────────────────────────────
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/reciept/");
      setRows(parseRows(data));
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to load data";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // ── Toast ────────────────────────────────────────────
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 3000);
  };

  const onSaved = () => { setModal(null); fetchData(); };

  // ── Filters ──────────────────────────────────────────
  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return rows.filter((r) =>
      (!s || r.customer.toLowerCase().includes(s) || r.id.toLowerCase().includes(s) || r.cheque.toLowerCase().includes(s)) &&
      (!statusF || r.status === statusF) &&
      (!methodF || r.modeOfPayment === methodF)
    );
  }, [rows, search, statusF, methodF]);

  // ── Stats ────────────────────────────────────────────
  const totalCollected = rows.filter(r => r.status === "Paid").reduce((a, r) => a + (+r.amount || 0), 0);
  const totalPending   = rows.filter(r => r.status === "Pending").reduce((a, r) => a + (+r.amount || 0), 0);
  const totalOverdue   = rows.filter(r => r.status === "Overdue").reduce((a, r) => a + (+r.amount || 0), 0);

  return (
    <div className="bg-slate-50 min-h-screen p-6 lg:p-10 font-sans">
      <Navbar />
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">Receipt Register</h1>
            <p className="text-sm text-slate-400 mt-0.5">Track and manage all incoming receipts</p>
          </div>
          <button
            onClick={() => setModal({ mode: "add" })}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors"
          >
            <IconPlus /> New Receipt
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Collected", val: fmtAmt(totalCollected), sub: "Paid entries",    subCls: "text-emerald-600" },
            { label: "Pending",         val: fmtAmt(totalPending),   sub: `${rows.filter(r=>r.status==="Pending").length} invoices`, subCls: "text-amber-500" },
            { label: "Overdue",         val: fmtAmt(totalOverdue),   sub: `${rows.filter(r=>r.status==="Overdue").length} accounts`, subCls: "text-red-500" },
            { label: "Transactions",    val: rows.length,             sub: "Total records",   subCls: "text-slate-400" },
          ].map((c) => (
            <div key={c.label} className="bg-white rounded-2xl border border-slate-100 p-5">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">{c.label}</p>
              <p className="text-2xl font-semibold text-slate-800">{c.val}</p>
              <p className={`text-xs font-medium mt-1 ${c.subCls}`}>{c.sub}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search by party name, ID or cheque…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none"
            />
          </div>
          <select value={statusF} onChange={(e) => setStatusF(e.target.value)}
            className="px-3 py-2 text-sm border border-slate-200 rounded-xl text-slate-700 focus:border-indigo-400 outline-none bg-white">
            <option value="">All status</option>
            {["Paid","Partial","Pending","Overdue"].map((s) => <option key={s}>{s}</option>)}
          </select>
          <select value={methodF} onChange={(e) => setMethodF(e.target.value)}
            className="px-3 py-2 text-sm border border-slate-200 rounded-xl text-slate-700 focus:border-indigo-400 outline-none bg-white">
            <option value="">All methods</option>
            {["NEFT","UPI","Cheque","Cash","RTGS","IMPS"].map((m) => <option key={m}>{m}</option>)}
          </select>
          <button onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors whitespace-nowrap">
            {loading ? <IconSpinner /> : <IconRefresh />} Refresh
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {["S.No","ID","Date","Cheque Date","Cheque No.","Bank","Amount","Party Name","Mode","Status","Actions"].map((h) => (
                    <th key={h} className="text-left px-4 py-3.5 text-xs font-medium text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={11} className="px-5 py-14 text-center">
                      <div className="flex flex-col items-center gap-3 text-slate-400">
                        <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                        <span className="text-sm">Loading receipts…</span>
                      </div>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-5 py-12 text-center text-sm text-slate-400">
                      No receipts found.
                    </td>
                  </tr>
                ) : filtered.map((r) => (
                  <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors last:border-0">
                    <td className="px-4 py-3.5 text-xs text-slate-400">{r.sno}</td>
                    <td className="px-4 py-3.5 font-mono text-xs text-slate-400">{r.id}</td>
                    <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">{fmtDate(r.date)}</td>
                    <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">{fmtDate(r.chequeDate)}</td>
                    <td className="px-4 py-3.5 font-mono text-xs text-slate-500">{r.cheque || "—"}</td>
                    <td className="px-4 py-3.5 text-slate-500">{r.bank}</td>
                    <td className="px-4 py-3.5 font-semibold text-slate-800 whitespace-nowrap">{fmtAmt(r.amount)}</td>
                    <td className="px-4 py-3.5 font-medium text-slate-800">{r.customer}</td>
                    <td className="px-4 py-3.5 text-slate-500">{r.modeOfPayment}</td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_CLS[r.status] || "bg-slate-100 text-slate-600 border border-slate-200"}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setModal({ mode: "edit", row: r })}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors active:scale-95"
                        >
                          <IconEdit /> Edit
                        </button>
                        <button
                          onClick={() => setModal({ mode: "delete", row: r })}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors active:scale-95"
                        >
                          <IconTrash /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!loading && filtered.length > 0 && (
            <div className="px-5 py-3 border-t border-slate-50">
              <p className="text-xs text-slate-400">Showing {filtered.length} of {rows.length} records</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {modal?.mode === "add" && (
        <ReceiptModal mode="add" onClose={() => setModal(null)} onSaved={onSaved} showToast={showToast} />
      )}
      {modal?.mode === "edit" && (
        <ReceiptModal mode="edit" row={modal.row} onClose={() => setModal(null)} onSaved={onSaved} showToast={showToast} />
      )}
      {modal?.mode === "delete" && (
        <DeleteModal row={modal.row} onClose={() => setModal(null)} onDeleted={onSaved} showToast={showToast} />
      )}

      <Toast msg={toast.msg} type={toast.type} />
    </div>
  );
}