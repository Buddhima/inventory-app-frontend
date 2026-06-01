import React, { useState } from 'react';
import {
  IonPage,
  IonContent, IonSegment, IonSegmentButton, IonLabel
} from '@ionic/react';
import { AppHeader } from '../components/AppHeader';

import JobDispatch from '../components/JobDispatch';
import JobDispatchList from '../components/JobDispatchList';

const Dispatch = () => {
  const reload = 0;
  const [selectedSegment, setSelectedSegment] = useState<string | number>("segment1");

  return (
    <IonPage>
      <AppHeader title="Dispatch" />

      <IonContent className="ion-padding">

        {/* <JobDispatch />
        <JobDispatchList reload={reload} /> */}

        <IonSegment
          value={selectedSegment}
          onIonChange={(e) => {
            const value = e.detail.value; // value can be string | undefined
            if (value) {
              console.log("Segment changed to:", value);
              setSelectedSegment(value); // only update if not undefined
            }
          }}
        >
          <IonSegmentButton value="segment1">
            <IonLabel>Generate New ASN File</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="segment2">
            <IonLabel>View Previous ASN Files</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {/* Display components conditionally */}
        <div style={{ marginTop: "20px" }}>
          {selectedSegment === "segment1" && <JobDispatch />}
          {selectedSegment === "segment2" && <JobDispatchList reload={reload} />}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Dispatch;
