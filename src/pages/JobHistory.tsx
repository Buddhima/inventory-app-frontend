import React from 'react';
import {
  IonPage,
  IonContent
} from '@ionic/react';
import { AppHeader } from '../components/AppHeader';

import JobList from '../components/JobList';

const JobHistory = () => {
  const reload = 0;

  return (
    <IonPage>
      <AppHeader title="Job History" />

      <IonContent className="ion-padding">
        
        <JobList reload={reload} />
      </IonContent>
    </IonPage>
  );
};

export default JobHistory;
