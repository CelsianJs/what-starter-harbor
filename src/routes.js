import Activity from './pages/Activity.jsx';
import AppShell from './components/AppShell.jsx';
import Build from './pages/Build.jsx';
import Deploys from './pages/Deploys.jsx';
import Home from './pages/Home.jsx';
import IncidentDetail from './pages/IncidentDetail.jsx';
import Incidents from './pages/Incidents.jsx';
import NotFound from './pages/NotFound.jsx';
import Services from './pages/Services.jsx';

const withShell = (path, component) => ({ path, component, layout: AppShell });

export const routes = [
  withShell('/', Home),
  withShell('/incidents', Incidents),
  withShell('/incidents/:id', IncidentDetail),
  withShell('/services', Services),
  withShell('/deploys', Deploys),
  withShell('/activity', Activity),
  withShell('/build', Build),
  withShell('/404', NotFound),
  withShell('/*', NotFound),
];
