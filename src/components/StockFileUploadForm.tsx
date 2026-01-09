import React, { useRef, useState } from "react";
import {
    IonButton,
    IonItem,
    IonLabel,
    IonSpinner,
    IonToast
} from "@ionic/react";
import { api } from '../api';

interface StockFileUploadFormProps {
    onItemAdded?: () => void;
}

const StockFileUploadForm = ({ onItemAdded }: StockFileUploadFormProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const uploadFile = async () => {
        if (!file) return;

        setUploading(true);
        setSuccess(false);
        setError(null);

        try {
            // 1️⃣ Get pre-signed URL from backend
            const res = await api.post('/upload-url', {
                fileName: file.name,
                contentType: file.type
            });

            const { uploadUrl } = await res.data;

            console.log("Upload URL:", uploadUrl);

            // 2️⃣ Upload directly to S3
            const fileUploadRes = await fetch(uploadUrl, {
                method: "PUT",
                headers: {
                    "Content-Type": file.type
                },
                body: file
            });

            if (!fileUploadRes.ok) {
                console.log("File upload response:", fileUploadRes);
                throw new Error("File upload failed");
            }

            setUploading(false);
            setSuccess(true);
            setFile(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            onItemAdded?.();
        } catch (error: any) {
            console.error("Upload failed:", error);
            setUploading(false);
            setError(error.message || "Upload failed");
        }
    };

    return (
        <>
            <IonItem>
                <IonLabel>Select file</IonLabel>

                <input
                    type="file"
                    hidden
                    id="fileInput"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                />

                <IonButton
                    slot="end"
                    onClick={() =>
                        document.getElementById("fileInput")?.click()
                    }
                >
                    Choose
                </IonButton>
            </IonItem>

            {file && (
                <IonItem lines="none">
                    <IonLabel color="medium">
                        <p>Selected file:</p>
                        <strong>{file.name}</strong>
                    </IonLabel>
                </IonItem>
            )}

            <IonButton
                expand="block"
                onClick={uploadFile}
                disabled={!file || uploading}
            >
                {uploading ? <IonSpinner name="dots" /> : "Upload"}
            </IonButton>

            <IonToast
                isOpen={success}
                message="✅ File uploaded successfully"
                duration={3000}
                color="success"
                onDidDismiss={() => setSuccess(false)}
            />

            <IonToast
                isOpen={error !== null}
                message={`❌ ${error}`}
                duration={4000}
                color="danger"
                onDidDismiss={() => setError(null)}
            />
        </>
    );
};

export default StockFileUploadForm;
