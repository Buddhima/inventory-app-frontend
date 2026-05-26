import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import {
  IonBadge,
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSpinner
} from '@ionic/react';
import { arrowBackOutline } from 'ionicons/icons';
import { AppHeader } from '../components/AppHeader';
import { api } from '../api';
import './InventoryMovements.css';

interface InventoryMovement {
  id: string;
  name?: string | null;
  type?: 'ADDED' | 'CONSUMED';
  quantity?: number;
  createdAt?: number;
  source?: 'STOCK' | 'CONSUME';
  jobNumber?: string | null;
}

interface RouteParams {
  id: string;
}

interface MovementLocationState {
  itemName?: string;
}

const formatMovementDate = (createdAt?: number) => {
  if (!createdAt) return 'Date unavailable';

  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return 'Date unavailable';

  return date.toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const InventoryMovements: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const location = useLocation<MovementLocationState>();
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const itemName = location.state?.itemName || movements[0]?.name || id;

  useEffect(() => {
    const fetchMovements = async () => {
      setLoading(true);
      setError('');

      try {
        const res = await api.get<InventoryMovement[]>('/inventory-movements', {
          params: { id },
        });
        setMovements(res.data);
      } catch {
        setMovements([]);
        setError('Unable to load movement history.');
      }

      setLoading(false);
    };

    fetchMovements();
  }, [id]);

  return (
    <IonPage>
      <AppHeader title="Inventory Movements" />

      <IonContent className="ion-padding">
        <IonButton fill="clear" routerLink="/home" className="movements-back-button">
          <IonIcon icon={arrowBackOutline} slot="start" />
          Inventory
        </IonButton>

        <section className="movements-heading">
          <h2>{itemName}</h2>
          <p>Component ID: {id}</p>
        </section>

        {loading && (
          <div className="movements-state">
            <IonSpinner name="crescent" />
          </div>
        )}

        {!loading && error && (
          <p className="movements-state error">{error}</p>
        )}

        {!loading && !error && movements.length === 0 && (
          <p className="movements-state">No movements recorded for this item.</p>
        )}

        {!loading && !error && movements.length > 0 && (
          <IonList className="movements-list">
            {movements.map((movement, index) => {
              const isAdded = movement.type === 'ADDED';

              return (
                <IonItem key={`${movement.createdAt}-${movement.type}-${index}`} lines="full">
                  <IonLabel>
                    <div className="movement-row">
                      <div>
                        <h3>{formatMovementDate(movement.createdAt)}</h3>
                        {movement.jobNumber && <p>Job: {movement.jobNumber}</p>}
                      </div>

                      <div className="movement-summary">
                        <IonBadge color={isAdded ? 'success' : 'warning'}>
                          {isAdded ? 'Added' : 'Consumed'}
                        </IonBadge>
                        <strong className={isAdded ? 'movement-added' : 'movement-consumed'}>
                          {isAdded ? '+' : '-'}{movement.quantity ?? 0}
                        </strong>
                      </div>
                    </div>
                  </IonLabel>
                </IonItem>
              );
            })}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default InventoryMovements;
