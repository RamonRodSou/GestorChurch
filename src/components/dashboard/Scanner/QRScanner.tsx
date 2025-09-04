import "./styles.scss"
import { useState } from "react";
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "@service/firebase";
import { IDetectedBarcode } from "@yudiel/react-qr-scanner";
import { Scanner } from '@yudiel/react-qr-scanner';
import { Box, Typography, useMediaQuery } from "@mui/material";

export default function QRScanner() {
    const [scanResult, setScanResult] = useState("");
    const [status, setStatus] = useState("");
    const [quantity, setQuantity] = useState<number>();
    const [validationStatus, setValidationStatus] = useState<'default' | 'valid' | 'invalid'>('default');
    const isMobile = useMediaQuery("(max-width: 767px)");

    const containerHeight = isMobile ? 400 : 650;

    const handleScan = async (detectedCodes: IDetectedBarcode[]) => {
        const data = detectedCodes[0]?.rawValue;

        if (data) {
            setStatus("🔍 Verificando...");

            try {
                const docRef = doc(db, "tickets", data);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const ticket = docSnap.data();

                    if (ticket.isActive) {
                        await updateDoc(docRef, { isActive: false });
                        setStatus(`✅ Válido!`);
                        setValidationStatus('valid')
                    } else {
                        setStatus(`⚠️ Inválido`);
                        setValidationStatus('invalid');
                    }

                    setScanResult(ticket.name)
                    const ticketsRef = collection(db, "tickets");
                    const q = query(ticketsRef, where("name", "==", ticket.name), where("isActive", "==", true));
                    const snapshot = await getDocs(q);
                    setQuantity(snapshot.size);

                } else {
                    setStatus("❌ Não encontrado.");
                    setValidationStatus('invalid');
                }

            } catch (err) {
                console.error(err);
                setStatus("🔥 Erro ao conectar com o banco de dados.");
            }
        }
    };

    const scannerClassName = {
        valid: 'box-scanner--valid',
        invalid: 'box-scanner--invalid',
        default: ''
    }[validationStatus];

    return (
        <Box component="div" className={`box-scanner ${scannerClassName}`}>
            <Scanner
                onScan={handleScan}
                onError={(err) => console.log(err)}
                constraints={{ facingMode: "environment" }}
                styles={{
                    container: { width: "100%", height: `${containerHeight}px` },
                }}
            />
            <Typography className="subTitle">
                <span className="bold">Última Leitura:</span> {scanResult}.<br />
                <span className="bold">Status:</span> {status}<br />
                {quantity && (
                    <>
                        <span className="bold"> Restantes:</span> {quantity} Ingressos
                    </>
                )}
            </Typography>
        </Box>
    );
}