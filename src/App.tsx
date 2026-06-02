import React, { useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { homeOutline, layersOutline, cloudUploadOutline, cubeOutline, briefcaseOutline, boatOutline } from 'ionicons/icons';
import Home from './pages/Home';


/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import Stock from './pages/Stock';
import JobTemplate from './pages/JobTemplate';
import LoginPage from './pages/LoginPage';
import JobTemplateUpload from './pages/JobTemplateUpload';
import JobHistory from './pages/JobHistory';
import Dispatch from './pages/Dispatch';
import InventoryMovements from './pages/InventoryMovements';

import { ProtectedRoute } from './ProtectedRoute';
import { isInGroup } from './auth';

setupIonicReact();

const ADMIN_GROUP = 'admin';

const AppContent: React.FC = () => {
  const [adminLoading, setAdminLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;

    isInGroup(ADMIN_GROUP).then((result) => {
      if (mounted) {
        setIsAdmin(result);
        setAdminLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/login" >
              <LoginPage />
            </Route>
            <Route exact path="/">
              <LoginPage />
            </Route>

            <ProtectedRoute path="/home" exact >
              <Home />
            </ProtectedRoute>
            <ProtectedRoute path="/inventory/:id/movements" exact >
              <InventoryMovements />
            </ProtectedRoute>
            <ProtectedRoute path="/job-template" exact >
              <JobTemplate />
            </ProtectedRoute>
            <ProtectedRoute path="/upload-template" exact >
              {adminLoading ? null : isAdmin ? <JobTemplateUpload /> : <Redirect to="/home" />}
            </ProtectedRoute>
            <ProtectedRoute path="/stock" exact >
              <Stock />
            </ProtectedRoute>
            <ProtectedRoute path="/job-history" exact >
              <JobHistory />
            </ProtectedRoute>
            <ProtectedRoute path="/dispatch" exact >
              <Dispatch />
            </ProtectedRoute>
          </IonRouterOutlet>

          <IonTabBar slot="bottom">
            <IonTabButton tab="home" href="/home">
              <IonIcon aria-hidden="true" icon={homeOutline} />
              <IonLabel>Inventory</IonLabel>
            </IonTabButton>
            <IonTabButton tab="job-template" href="/job-template">
              <IonIcon aria-hidden="true" icon={layersOutline} />
              <IonLabel>JobTemplate</IonLabel>
            </IonTabButton>
            {isAdmin && (
              <IonTabButton tab="upload-template" href="/upload-template">
                <IonIcon aria-hidden="true" icon={cloudUploadOutline} />
                <IonLabel>JobTemplateUpload</IonLabel>
              </IonTabButton>
            )}
            <IonTabButton tab="stock" href="/stock">
              <IonIcon aria-hidden="true" icon={cubeOutline} />
              <IonLabel>Stock/Consume</IonLabel>
            </IonTabButton>
            <IonTabButton tab="job-history" href="/job-history">
              <IonIcon aria-hidden="true" icon={briefcaseOutline} />
              <IonLabel>Job History</IonLabel>
            </IonTabButton>
            <IonTabButton tab="dispatch" href="/dispatch">
              <IonIcon aria-hidden="true" icon={boatOutline} />
              <IonLabel>Dispatch</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

const App: React.FC = () => (
  <Authenticator>

    <AppContent />

  </Authenticator>
);

export default App;
