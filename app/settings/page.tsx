import SettingsClient from "@/components/SettingsClient"

export default function SettingsPage() {
  return (
    <main className="center-column">
      <div className="timeline-header">
        <div className="timeline-title">Settings</div>
      </div>

      <div className="page-panel">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">
          現段階で必要な匿名ID管理。
        </p>
      </div>

      <div className="page-panel">
        <SettingsClient />
      </div>
    </main>
  )
}