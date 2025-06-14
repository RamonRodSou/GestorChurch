import Layout from "@components/layout/Layout";
import Search from "@components/search/Search";
import { AdminSummary } from "@domain/user";
import { Info } from "@mui/icons-material";
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { findAllAdmins } from "@service/AdminService";
import { useEffect, useState } from "react";

export default function UserData() {
    const [data, setData] = useState<AdminSummary[]>([]);
    const [filtered, setFiltered] = useState<AdminSummary[]>([]);

    function handleOpenDetails(it: AdminSummary): void {
        throw new Error(it + "Function not implemented.");
    }

    useEffect(() => {
        findAllAdmins()
            .then((it) => {
                setData(it);
                setFiltered(it);
            })
            .catch(console.error);
    }, []);

    return (
        <Layout total={data.filter((it => it.isActive)).length} title="Usuarios" path="user/invited" message="Usuario criado com sucesso!">
            <Search<AdminSummary>
                data={data}
                onFilter={setFiltered}
                label={'Buscar Membro'}
                searchBy={(item, term) =>
                    item.name.toLowerCase().includes(term.toLowerCase()) ||
                    item.email.toLowerCase().includes(term.toLowerCase())
                }
            />

            {filtered
                .sort((a, b) => (b.permission ?? 0) - (a.permission ?? 0))
                ?.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell className='title-secondary'>Nome</TableCell>
                                <TableCell className='title-secondary'>Permissão</TableCell>
                                <TableCell className='title-secondary'>Info</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filtered
                                .map((it) => (
                                    <TableRow key={it.id}>
                                        <TableCell className='data-text'>{it.name.split(" ").at(0)}</TableCell>
                                        <TableCell className='data-text'>{it.permission}</TableCell>
                                        <TableCell className='data-text'>
                                            <IconButton onClick={() => handleOpenDetails(it)}>
                                                <Info />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography variant="body1" sx={{ color: 'var(--primary-title)' }}>
                    Nenhum usuario encontrado.
                </Typography>
            )}
        </Layout>
    );
}