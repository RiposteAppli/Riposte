import ReportForm from "@/components/ReportForm"

export default function ReportsPage() {
  return (
    <main className="center-column">
      <div className="timeline-header">
        <div className="timeline-title">Reports</div>
      </div>

      <div className="page-panel">
        <h1 className="page-title">Reports</h1>
        <p className="page-subtitle">
          問題のあるArena / Riposteを通報する。
        </p>
      </div>

      <div className="page-panel">
        <ReportForm />
      </div>
    </main>
  )
}