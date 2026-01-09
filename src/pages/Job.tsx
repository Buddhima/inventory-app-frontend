import React from 'react';
import {
  IonPage,
  IonContent,
} from '@ionic/react';

import JobForm from '../components/JobForm';
import { AppHeader } from '../components/AppHeader';

const Job = () => {

  return (
    <IonPage>
      
      <AppHeader title="Create Job" />

      <IonContent className="ion-padding">
        <JobForm />
      </IonContent>
    </IonPage>
  );
};

export default Job;
