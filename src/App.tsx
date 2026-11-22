import { ClimbExperience } from './climb/ClimbExperience'
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion'
import { StaticPortfolio } from './static/StaticPortfolio'

export default function App() {
  const reducedMotion = usePrefersReducedMotion()
  return reducedMotion ? <StaticPortfolio /> : <ClimbExperience />
}
