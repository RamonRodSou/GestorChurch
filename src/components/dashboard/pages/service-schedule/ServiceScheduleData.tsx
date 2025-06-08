import Layout from "@components/layout/Layout";
import { Box } from "@mui/material";
import { useState } from "react";

export default function ServiceScheduleData() {
    const [data, setData] = useState([])

    return (
        <Layout total={data?.length} title="Escala de Serviço" path="new-service-schedule" message="Escala criada com sucesso!">
            <Box>
                
            </Box>
        </Layout>
    )
}