import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';

import { AppHeader } from '../components/AppHeader';
import JobTemplateUploadForm from '../components/JobTemplateUploadForm';

const JobTemplateUpload = () => {
  const [reload, setReload] = useState(0);

  return (
    <IonPage>
      <AppHeader title="Job Template Upload" />

      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow>
            <IonCol size="12" sizeMd="6">
              <h2>Job Template Upload</h2>
              <JobTemplateUploadForm onItemAdded={() => setReload(reload + 1)} />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default JobTemplateUpload;
