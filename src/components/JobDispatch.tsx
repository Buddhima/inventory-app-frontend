import React, { useState, useEffect, FormEvent, useMemo } from "react";
import {
    IonButton,
    IonItem,
    IonLabel,
    IonList,
    IonToast,
    IonLoading,
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonContent,
    IonSearchbar,
} from "@ionic/react";
import { api } from '../api';

export interface JobSummary {
    jobNumber: string;
    jobName: string;
    jobUuid: string;
    createdAt: string;
    sk: string;
}

export interface TemplateSummary {
    bomHeader: string;
    bomHeaderDescription?: string;
    sk?: string;
}

export interface Template {
    id: string;
    data: unknown; // adjust if you know the structure
}

export interface FileGenerationResponse {
    fileName: string;
    fileUrl: string;
}

const JobDispatch: React.FC = () => {
    const [jobs, setJobs] = useState<JobSummary[]>([]);
    const [selectedId, setSelectedId] = useState<string>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [id, setId] = useState<string>("");
    const [showToast, setShowToast] = useState(false);
    const [asnLink, setAsnLink] = useState<string>("");
    const [asnFileName, setAsnFileName] = useState<string>("");

    useEffect(() => {
        loadTemplates();
    }, []);

    const loadTemplates = async () => {
        try {
            setLoading(true);
            const res = await api.get('/job-history');
            const data = res.data as JobSummary[];
            setJobs(data);
        } catch {
            setError('Failed to load jobs');
        } finally {
            setLoading(false);
        }
    };

    const generateASN = async () => {
        if (!selectedId) return;

        try {
            setLoading(true);

            const sk = encodeURIComponent(selectedId);

            const res = await api.post('/generate-asn', {
                params: { sk }
            });

            const data = res.data as FileGenerationResponse; // adjust according to file generation response
            
            const generatedFileLink = data.fileUrl;
            setAsnLink(generatedFileLink);
            setAsnFileName(data.fileName);

        } catch {
            setError('Failed to generate the file');
        } finally {
            setLoading(false);
        }
    };


    const [showModal, setShowModal] = useState(false);
    const [searchText, setSearchText] = useState('');

    const selectedJob = jobs.find(t => t.sk === selectedId);

    const filteredJobs = useMemo(() => {
        if (!searchText) return jobs;

        const q = searchText.toLowerCase();

        return jobs.filter(j =>
            j.jobNumber.toLowerCase().includes(q) ||
            j.jobName?.toLowerCase().includes(q)
        );
    }, [jobs, searchText]);


    return (
        <>

            <IonItem button onClick={() => setShowModal(true)}>
                <IonLabel>
                    <h3>Job</h3>
                    <p>
                        {selectedJob
                            ? `${selectedJob.jobNumber} - ${selectedJob.jobName}`
                            : 'Select a job'}
                    </p>
                </IonLabel>
            </IonItem>

            <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Select Job</IonTitle>
                        <IonButtons slot="end">
                            <IonButton onClick={() => setShowModal(false)}>Close</IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>

                <IonContent>
                    <IonSearchbar
                        value={searchText}
                        debounce={300}
                        placeholder="Search templates"
                        onIonInput={e => setSearchText(e.detail.value ?? '')}
                    />

                    <IonList>
                        {filteredJobs.map(t => (
                            <IonItem
                                key={t.sk}
                                button
                                onClick={() => {
                                    setSelectedId(t.sk);
                                    setShowModal(false);
                                }}
                            >
                                <IonLabel>
                                    <h2>{t.jobNumber}</h2>
                                    <p>{t.jobName}</p>
                                </IonLabel>
                            </IonItem>
                        ))}
                    </IonList>
                </IonContent>
            </IonModal>

            <IonButton
                expand="block"
                disabled={!selectedId}
                onClick={generateASN}
            >
                Generate ASN
            </IonButton>

            <IonLoading isOpen={loading} message="Loading..." />
            <IonToast
                isOpen={!!error}
                message={error}
                duration={3000}
                onDidDismiss={() => setError('')}
            />

            <IonLabel hidden={id.length > 0} color="danger">
                <strong>Please select a job and click &quot;Generate ASN&quot; to download ASN file.</strong>
            </IonLabel>

            {asnLink && (
                <IonButton
                    expand="block"
                    href={asnLink}
                    color="success"
                    target="_blank"
                    hidden={!asnLink}
                    className="ion-margin-top"
                >
                    Download ASN File - {asnFileName}
                </IonButton>

            )}

        </>

    );

};

export default JobDispatch;
