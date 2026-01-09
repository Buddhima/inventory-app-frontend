import React from 'react';
import {
  IonPage,
  IonContent,
} from '@ionic/react';

import { AppHeader } from '../components/AppHeader';
import JobTemplate from '../components/JobTemplate';

const Template = () => {

  return (
    <IonPage>
      <AppHeader title="Create Job - by a Template" />

      <IonContent className="ion-padding">
        <JobTemplate />
      </IonContent>
    </IonPage>
  );
};

export default Template;
