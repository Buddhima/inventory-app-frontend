import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { IonSpinner, IonList, IonItem, IonLabel, IonSearchbar } from '@ionic/react';
import { api } from '../api';
import './JobList.css'

const workflowmaxUrlPrefix = 'https://app.workflowmax.com/organizations/9bc14f00-3883-4854-b10f-1924ab65b094/jobs/';
const workflowmaxUrlSuffix = '/information';


const JobList = ({ reload }) => {

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get('/job-history');
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const filteredItems = useMemo(() => {
    if (!searchText) return items;

    console.log('Filtering items with search text:', searchText);
    const query = searchText.toLowerCase();

    return items.filter(item =>
      item.jobName?.toLowerCase().includes(query) ||
      item.jobNumber?.toLowerCase().includes(query)
    );
  }, [items, searchText]);

  useEffect(() => {
    fetchItems();
  }, [reload]);

  if (loading) return <IonSpinner />;

  return (
    <>
      <IonSearchbar
        value={searchText}
        debounce={300}
        placeholder="Search items"
        onIonInput={e => setSearchText(e.detail.value ?? '')}
      />

      <IonList>
        {filteredItems.map((item) => {

          return (
            <IonItem key={item.sk} button>
              <IonLabel>
                <h2>{item.jobName}</h2>
                <p>Job Number: {item.jobNumber}</p>
                <p>Created Date: {new Intl.DateTimeFormat("en-NZ", {
                  timeZone: "Pacific/Auckland",
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(item.createdAt))}</p>
                {item.performedByName && <p>Performed By: {item.performedByName}</p>}
              </IonLabel>

              {/* Right: Link to actual job */}
              <div className="stock-info" slot="end">
                <h3 className="quantity">
                  <a href={`${workflowmaxUrlPrefix}${item.jobUuid}${workflowmaxUrlSuffix}`} className="job-link" target="_blank"
                    rel="noopener noreferrer">
                    {item.jobNumber}
                  </a>
                </h3>

              </div>

            </IonItem>
          );
        })}
      </IonList>
    </>

  );
};

JobList.propTypes = {
  reload: PropTypes.number,
};

export default JobList;
