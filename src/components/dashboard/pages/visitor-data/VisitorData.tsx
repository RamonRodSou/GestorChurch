import { Info } from "@mui/icons-material";
import {
    IconButton,
    Typography,
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper,
} from "@mui/material";
import { useContext, useEffect, useState } from 'react';
import { ManagerContext } from '@context/ManagerContext';
import Search from '@components/search/Search';
import { Visitor } from '@domain/user/visitor/Visitor';
import { findAllVisitors } from '@service/VisitorService';
import VisitorDataModal from './visitor-data-modal/VisitorDataModal';
import { whatzapp } from '@domain/utils';
import Layout from '@components/layout/Layout';

export default function VisitorData() {
    const [data, setData] = useState<Visitor[]>([]);
    const [filtered, setFiltered] = useState<Visitor[]>([]);
    const [openData, setOpenData] = useState(false);
    const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
    const { isMobile } = useContext(ManagerContext);
    
    function handleOpenDetails(visitor: Visitor) {
        setSelectedVisitor(visitor);
        setOpenData(true);
    }

    useEffect(() => { 
        findAllVisitors()
            .then((it) => {
                setData(it);
                setFiltered(it);
            })
            .catch(console.error);
    }, []);

    return (
        <Layout title="Visitantes" path="new-visitor" message="Visitante criado com sucesso!">
            <Search<Visitor> 
                data={data} 
                onFilter={setFiltered} 
                label={'Buscar Visitor'}
                searchBy={(item, term) =>
                    item.name.toLowerCase().includes(term.toLowerCase()) ||
                    item.phone.includes(term)
                }
            />
            {filtered?.length > 0 ? (
                <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                    <TableRow>
                        <TableCell className='title-secondary'>Nome</TableCell>
                        <TableCell className='title-secondary'>Telefone</TableCell>

                        {!isMobile && (
                            <>
                                <TableCell className='title-secondary'>Visitas</TableCell>
                            </>
                        )}

                        <TableCell className='title-secondary'>Info</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {filtered
                        .filter((it) => it.isActive)
                        .map((it) => (
                            <TableRow key={it.id}>
                                <TableCell className='data-text'>{it.name}</TableCell>
                                <TableCell 
                                    className='data-text onClick' 
                                    onClick={() => whatzapp(it.name, it.phone)}
                                >
                                    {it.phone}
                                </TableCell>
                                {!isMobile && (
                                    <>
                                        <TableCell className='data-text'>{it.visitHistory.at(0)}</TableCell>
                                    </>
                                )}
                                <TableCell className='data-text'>                                   
                                    <IconButton onClick={() => handleOpenDetails(it)}>
                                        <Info/>
                                    </IconButton> 
                                </TableCell>
                            </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </TableContainer>
            ) : (
                <Typography variant="body1" sx={{ color: 'var(--primary-title)' }}>
                Nenhum visitante encontrado.
                </Typography>
            )}
            <VisitorDataModal
                open={openData}
                onClose={() => setOpenData(false)}
                visitor={selectedVisitor}
            />
        </Layout>
    );
}
