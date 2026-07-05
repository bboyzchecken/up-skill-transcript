import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { ActivitiesList } from './pages/staff/ActivitiesList'
import { ActivityEditor } from './pages/staff/ActivityEditor'
import { ActivityDetail } from './pages/staff/ActivityDetail'
import { JoinPage } from './pages/join/JoinPage'
import { TranscriptPage } from './pages/me/TranscriptPage'
import { Dashboard } from './pages/dashboard/Dashboard'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/staff" element={<ActivitiesList />} />
        <Route path="/staff/new" element={<ActivityEditor />} />
        <Route path="/staff/:id" element={<ActivityDetail />} />
        <Route path="/staff/:id/edit" element={<ActivityEditor />} />
        <Route path="/join" element={<JoinPage />} />
        <Route path="/join/:code" element={<JoinPage />} />
        <Route path="/me" element={<TranscriptPage />} />
        <Route path="/me/:studentId" element={<TranscriptPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Layout>
  )
}
