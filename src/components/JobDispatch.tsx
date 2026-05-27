import React, { useState, useEffect, useMemo } from "react";
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
    IonInput,
    IonGrid,
    IonRow,
    IonCol,
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

interface DispatchLine {
    batchNumber: string;
    quantity: number;
    deliveryQty: number;
    batch: string;
    batchQty: number;
    ssccQty: number;
    components: string;
    componentsQty: number;
}

const JobDispatch: React.FC = () => {
    const [jobs, setJobs] = useState<JobSummary[]>([]);
    const [selectedId, setSelectedId] = useState<string>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [purchasingDoc, setPurchasingDoc] = useState<string>("");
    const [plant, setPlant] = useState<string>("");
    const [poItem, setPoItem] = useState<string>("");
    const [material, setMaterial] = useState<string>("");
    const [supplier, setSupplier] = useState<string>("");
    const [deliveryQtyUnit, setDeliveryQtyUnit] = useState<string>("");
    const [deliveryNote, setDeliveryNote] = useState<string>("");
    const [deliveryDate, setDeliveryDate] = useState<string>("");
    const [shippingDate, setShippingDate] = useState<string>("");
    const [storageLocation, setStorageLocation] = useState<string>("");
    const [manufacturingDate, setManufacturingDate] = useState<string>("");
    const [packId, setPackId] = useState<string>("");
    const [qtyUnit, setQtyUnit] = useState<string>("");
    const [batchComponents, setBatchComponents] = useState<string>("");
    const [numberOfLines, setNumberOfLines] = useState<number>(0);
    const [dispatchLines, setDispatchLines] = useState<DispatchLine[]>([]);
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

    const buildDispatchLines = () => {
        if (numberOfLines < 1) {
            setError('Please enter the number of lines');
            return;
        }

        setDispatchLines((prev) =>
            Array.from({ length: numberOfLines }, (_, index) => ({
                batchNumber: prev[index]?.batchNumber ?? "",
                quantity: prev[index]?.quantity ?? 0,
                deliveryQty: prev[index]?.deliveryQty ?? 0,
                batch: prev[index]?.batch ?? "",
                batchQty: prev[index]?.batchQty ?? 0,
                ssccQty: prev[index]?.ssccQty ?? 0,
                components: prev[index]?.components ?? "",
                componentsQty: prev[index]?.componentsQty ?? 0,
            }))
        );
    };

    const updateDispatchLine = (
        index: number,
        field: keyof DispatchLine,
        value: string | number
    ) => {
        setDispatchLines((prev) => {
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                [field]: value,
            };
            return updated;
        });
    };

    const generateASN = async () => {
        if (!selectedJob) {
            setError('Please select a job');
            return;
        }

        if (
            !plant.trim() ||
            !poItem.trim() ||
            !material.trim() ||
            !supplier.trim() ||
            !deliveryQtyUnit.trim() ||
            !deliveryNote.trim() ||
            !deliveryDate ||
            !shippingDate ||
            !storageLocation.trim() ||
            !manufacturingDate ||
            !packId.trim() ||
            !qtyUnit.trim() ||
            !batchComponents.trim() ||
            numberOfLines < 1
        ) {
            setError('Please fill all ASN details');
            return;
        }

        if (dispatchLines.length !== numberOfLines) {
            setError('Please generate dispatch lines before submitting');
            return;
        }

        const hasInvalidLine = dispatchLines.some(
            (line) =>
                !line.batchNumber.trim() ||
                Number(line.quantity) <= 0 ||
                Number(line.deliveryQty) <= 0 ||
                !line.batch.trim() ||
                Number(line.batchQty) <= 0 ||
                Number(line.ssccQty) <= 0 ||
                !line.components.trim() ||
                Number(line.componentsQty) <= 0
        );

        if (hasInvalidLine) {
            setError('Please complete all dispatch line details');
            return;
        }

        try {
            setLoading(true);

            const res = await api.post('/generate-asn', {
                jobNumber: selectedJob.jobNumber,
                purchasingDoc,
                plant,
                poItem,
                material,
                supplier,
                deliveryQtyUnit,
                deliveryNote,
                deliveryDate,
                shippingDate,
                storageLocation,
                manufacturingDate,
                packId,
                qtyUnit,
                batchComponents,
                numberOfLines,
                lines: dispatchLines.map((line) => ({
                    batchNumber: line.batchNumber,
                    quantity: Number(line.quantity),
                    deliveryQty: Number(line.deliveryQty),
                    batch: line.batch,
                    batchQty: Number(line.batchQty),
                    ssccQty: Number(line.ssccQty),
                    components: line.components,
                    componentsQty: Number(line.componentsQty),
                })),
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
                                    setAsnLink("");
                                    setAsnFileName("");
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

            {selectedJob && (
                <>
                    <IonList className="ion-margin-top">
                        <IonItem>
                            <IonLabel position="floating">Purchasing doc</IonLabel>
                            <IonInput
                                value={purchasingDoc}
                                onIonChange={(e) => setPurchasingDoc(e.detail.value ?? "")}
                            />
                        </IonItem>

                        <IonItem>
                            <IonLabel position="floating">Plant</IonLabel>
                            <IonInput
                                value={plant}
                                onIonChange={(e) => setPlant(e.detail.value ?? "")}
                                required
                            />
                        </IonItem>

                        <IonItem>
                            <IonLabel position="floating">PO item</IonLabel>
                            <IonInput
                                value={poItem}
                                onIonChange={(e) => setPoItem(e.detail.value ?? "")}
                                required
                            />
                        </IonItem>

                        <IonItem>
                            <IonLabel position="floating">Material</IonLabel>
                            <IonInput
                                value={material}
                                onIonChange={(e) => setMaterial(e.detail.value ?? "")}
                                required
                            />
                        </IonItem>

                        <IonItem>
                            <IonLabel position="floating">Supplier</IonLabel>
                            <IonInput
                                value={supplier}
                                onIonChange={(e) => setSupplier(e.detail.value ?? "")}
                                required
                            />
                        </IonItem>

                        <IonItem>
                            <IonLabel position="floating">Delivery qty unit</IonLabel>
                            <IonInput
                                value={deliveryQtyUnit}
                                onIonChange={(e) => setDeliveryQtyUnit(e.detail.value ?? "")}
                                required
                            />
                        </IonItem>

                        <IonItem>
                            <IonLabel position="floating">Delivery note</IonLabel>
                            <IonInput
                                value={deliveryNote}
                                onIonChange={(e) => setDeliveryNote(e.detail.value ?? "")}
                                required
                            />
                        </IonItem>

                        <IonItem>
                            <IonLabel position="floating">Delivery date</IonLabel>
                            <IonInput
                                type="date"
                                value={deliveryDate}
                                onIonChange={(e) => setDeliveryDate(e.detail.value ?? "")}
                                required
                            />
                        </IonItem>

                        <IonItem>
                            <IonLabel position="floating">Shipping date</IonLabel>
                            <IonInput
                                type="date"
                                value={shippingDate}
                                onIonChange={(e) => setShippingDate(e.detail.value ?? "")}
                                required
                            />
                        </IonItem>

                        <IonItem>
                            <IonLabel position="floating">Storage location</IonLabel>
                            <IonInput
                                value={storageLocation}
                                onIonChange={(e) => setStorageLocation(e.detail.value ?? "")}
                                required
                            />
                        </IonItem>

                        <IonItem>
                            <IonLabel position="floating">Manufacturing date</IonLabel>
                            <IonInput
                                type="date"
                                value={manufacturingDate}
                                onIonChange={(e) => setManufacturingDate(e.detail.value ?? "")}
                                required
                            />
                        </IonItem>

                        <IonItem>
                            <IonLabel position="floating">Pack ID</IonLabel>
                            <IonInput
                                value={packId}
                                onIonChange={(e) => setPackId(e.detail.value ?? "")}
                                required
                            />
                        </IonItem>

                        <IonItem>
                            <IonLabel position="floating">Qty unit</IonLabel>
                            <IonInput
                                value={qtyUnit}
                                onIonChange={(e) => setQtyUnit(e.detail.value ?? "")}
                                required
                            />
                        </IonItem>

                        <IonItem>
                            <IonLabel position="floating">Batch components</IonLabel>
                            <IonInput
                                value={batchComponents}
                                onIonChange={(e) => setBatchComponents(e.detail.value ?? "")}
                                required
                            />
                        </IonItem>

                        <IonItem>
                            <IonLabel position="floating">No of lines</IonLabel>
                            <IonInput
                                type="number"
                                min={1}
                                value={numberOfLines || ""}
                                onIonChange={(e) => {
                                    const value = Number(e.detail.value ?? 0);
                                    setNumberOfLines(value);
                                }}
                                required
                            />
                        </IonItem>
                    </IonList>

                    <IonButton
                        expand="block"
                        className="ion-margin-top"
                        disabled={numberOfLines < 1}
                        onClick={buildDispatchLines}
                    >
                        Show Lines
                    </IonButton>

                    {dispatchLines.length > 0 && (
                        <IonList className="ion-margin-top">
                            <IonLabel>
                                <strong>Dispatch Lines</strong>
                            </IonLabel>

                            {dispatchLines.map((line, index) => (
                                <IonGrid key={index}>
                                    <IonRow className="ion-align-items-center">
                                        <IonCol size="12" sizeMd="2">
                                            <IonLabel>Line {index + 1}</IonLabel>
                                        </IonCol>

                                        <IonCol size="12" sizeMd="4">
                                            <IonItem>
                                                <IonLabel position="floating">Batch number</IonLabel>
                                                <IonInput
                                                    value={line.batchNumber}
                                                    onIonChange={(e) =>
                                                        updateDispatchLine(index, "batchNumber", e.detail.value ?? "")
                                                    }
                                                    required
                                                />
                                            </IonItem>
                                        </IonCol>

                                        <IonCol size="12" sizeMd="4">
                                            <IonItem>
                                                <IonLabel position="floating">Quantity</IonLabel>
                                                <IonInput
                                                    type="number"
                                                    min={0}
                                                    value={line.quantity || ""}
                                                    onIonChange={(e) =>
                                                        updateDispatchLine(index, "quantity", Number(e.detail.value ?? 0))
                                                    }
                                                    required
                                                />
                                            </IonItem>
                                        </IonCol>

                                        <IonCol size="12" sizeMd="4">
                                            <IonItem>
                                                <IonLabel position="floating">Delivery qty</IonLabel>
                                                <IonInput
                                                    type="number"
                                                    min={0}
                                                    value={line.deliveryQty || ""}
                                                    onIonChange={(e) =>
                                                        updateDispatchLine(index, "deliveryQty", Number(e.detail.value ?? 0))
                                                    }
                                                    required
                                                />
                                            </IonItem>
                                        </IonCol>

                                        <IonCol size="12" sizeMd="4">
                                            <IonItem>
                                                <IonLabel position="floating">Batch</IonLabel>
                                                <IonInput
                                                    value={line.batch}
                                                    onIonChange={(e) =>
                                                        updateDispatchLine(index, "batch", e.detail.value ?? "")
                                                    }
                                                    required
                                                />
                                            </IonItem>
                                        </IonCol>

                                        <IonCol size="12" sizeMd="4">
                                            <IonItem>
                                                <IonLabel position="floating">Batch qty</IonLabel>
                                                <IonInput
                                                    type="number"
                                                    min={0}
                                                    value={line.batchQty || ""}
                                                    onIonChange={(e) =>
                                                        updateDispatchLine(index, "batchQty", Number(e.detail.value ?? 0))
                                                    }
                                                    required
                                                />
                                            </IonItem>
                                        </IonCol>

                                        <IonCol size="12" sizeMd="4">
                                            <IonItem>
                                                <IonLabel position="floating">SSCC qty</IonLabel>
                                                <IonInput
                                                    type="number"
                                                    min={0}
                                                    value={line.ssccQty || ""}
                                                    onIonChange={(e) =>
                                                        updateDispatchLine(index, "ssccQty", Number(e.detail.value ?? 0))
                                                    }
                                                    required
                                                />
                                            </IonItem>
                                        </IonCol>

                                        <IonCol size="12" sizeMd="4">
                                            <IonItem>
                                                <IonLabel position="floating">Components</IonLabel>
                                                <IonInput
                                                    value={line.components}
                                                    onIonChange={(e) =>
                                                        updateDispatchLine(index, "components", e.detail.value ?? "")
                                                    }
                                                    required
                                                />
                                            </IonItem>
                                        </IonCol>

                                        <IonCol size="12" sizeMd="4">
                                            <IonItem>
                                                <IonLabel position="floating">Components qty</IonLabel>
                                                <IonInput
                                                    type="number"
                                                    min={0}
                                                    value={line.componentsQty || ""}
                                                    onIonChange={(e) =>
                                                        updateDispatchLine(index, "componentsQty", Number(e.detail.value ?? 0))
                                                    }
                                                    required
                                                />
                                            </IonItem>
                                        </IonCol>
                                    </IonRow>
                                </IonGrid>
                            ))}
                        </IonList>
                    )}
                </>
            )}

            <IonButton
                expand="block"
                className="ion-margin-top"
                disabled={!selectedId || loading}
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

            <IonLabel hidden={!!selectedJob} color="danger">
                <strong>Please select a job, enter ASN details, and click &quot;Generate ASN&quot; to download ASN file.</strong>
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
