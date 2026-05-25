import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { IonSpinner, IonList, IonItem, IonLabel, IonSearchbar, IonButton, IonIcon } from '@ionic/react';
import { downloadOutline } from "ionicons/icons";
import { api } from '../api';
import './JobDispatchList.css'

const JobDispatchList = ({ reload }) => {

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get('/asn-file-history');
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

  const handleDownload = async (sk) => {
    setLoading(true);

    console.log('Fetching file for sk:', sk);

    try {
      const res = await api.get('/asn-file-download-url', {
        params: { sk }
      });

      const { fileName, fileUrl } = res.data;

      // Start auto downloading the file
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (err) {
      console.error('Error fetching file URL:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [reload]);

  if (loading) return <IonSpinner />;

  return (
    <>
      <h1>Job Dispatch List</h1>
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
                <p>File Name: {item.fileName}</p>
              </IonLabel>

              {/* Right: Link to actual job */}
              <div slot="end">
                <IonButton
                  onClick={() => handleDownload(item.sk)}
                  target="_blank"
                  rel="noopener noreferrer"
                  shape="round"
                  fill="outline"
                >
                  <IonIcon slot="start" icon={downloadOutline} />
                  Download
                </IonButton>

              </div>

            </IonItem>
          );
        })}
      </IonList>
    </>

  );
};

JobDispatchList.propTypes = {
  reload: PropTypes.number,
};

export default JobDispatchList;