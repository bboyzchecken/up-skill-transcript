import { NavLink, useLocation } from 'react-router-dom'
import { getStore } from '../store'

function Logo() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden>
      <g fill="none" stroke="#e4c766" strokeWidth="2.4" strokeLinejoin="round">
        <polygon points="32,10 51,21 51,43 32,54 13,43 13,21" opacity="0.4" />
      </g>
      <polygon points="32,14 47,30 40,46 22,44 16,26" fill="#e4c766" opacity="0.95" />
      <circle cx="32" cy="32" r="3" fill="#4a1e6e" />
    </svg>
  )
}

const LINKS = [
  { to: '/staff', label: 'เจ้าหน้าที่/คณะ' },
  { to: '/join', label: 'นิสิต · เข้าร่วม' },
  { to: '/me', label: 'ทรานสคริปต์' },
  { to: '/dashboard', label: 'กองกิจการนิสิต' },
]

export function Layout({ children }: { children: React.ReactNode }) {
  const loc = useLocation()
  return (
    <div className="app">
      <header className="nav">
        <div className="container nav-inner">
          <NavLink to="/" className="brand">
            <span className="mark">
              <Logo />
            </span>
            <span className="brand-name">
              Skill Transcript
              <small>มหาวิทยาลัยพะเยา · คณะ BCA</small>
            </span>
          </NavLink>
          <nav className="nav-links">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={
                  loc.pathname.startsWith(l.to) ? 'active' : undefined
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="container page">{children}</main>

      <footer className="footer">
        <div className="container footer-inner">
          <span className="credit">
            พัฒนาโดย{' '}
            <a
              href="https://owldayhouse.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'underline' }}
            >
              <strong>Owl Day House</strong>
            </a>{' '}
            · ระบบจำลองเพื่อการนำเสนอ (ข้อมูลตัวอย่างทั้งหมด)
          </span>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => {
              if (
                confirm('รีเซ็ตข้อมูลเดโม่กลับเป็นชุดตัวอย่างเริ่มต้น?')
              ) {
                getStore().reset()
              }
            }}
          >
            รีเซ็ตข้อมูลเดโม่
          </button>
        </div>
      </footer>
    </div>
  )
}
