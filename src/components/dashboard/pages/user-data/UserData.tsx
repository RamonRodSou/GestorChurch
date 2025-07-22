import Layout from "@components/layout/Layout";
import Search from "@components/search/Search";
import { AdminSummary } from "@domain/user";
import { filterAndPaginate, rowsPerPage } from "@domain/utils";
import { Info } from "@mui/icons-material";
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import { findAllAdmins } from "@service/AdminService";
import { useEffect, useState } from "react";

export default function UserData() {
    const [data, setData] = useState<AdminSummary[]>([]);
    const [filtered, setFiltered] = useState<AdminSummary[]>([]);
    const [page, setPage] = useState<number>(0);

    function handleOpenDetails(it: AdminSummary): void {
        throw new Error(it + "Function not implemented.");
    }

    const entities = filterAndPaginate({ entity: filtered, page })

    useEffect(() => {
        findAllAdmins()
            .then((it) => {
                setData(it);
                setFiltered(it);
            })
            .catch(console.error);
    }, []);

    return (
        <Layout total={data.length} title="Usuarios" path="user/invited" message="Usuario criado com sucesso!">
            <Search<AdminSummary>
                data={data}
                onFilter={setFiltered}
                label={'Buscar Membro'}
                searchBy={(item, term) =>
                    item.name.toLowerCase().includes(term.toLowerCase()) ||
                    item.email.toLowerCase().includes(term.toLowerCase())
                }
            />

            {data
                .sort((a, b) => (b.permission ?? 0) - (a.permission ?? 0))
                ?.length > 0 ? (
                <>
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell className='title-secondary table'>Nome</TableCell>
                                    <TableCell className='title-secondary table'>Permissão</TableCell>
                                    <TableCell className='title-secondary table'>Info</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {entities
                                    .map((it) => (
                                        <TableRow key={it.id} className='data-table'>
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
                    {data.length > rowsPerPage &&
                        (
                            <TablePagination
                                component='div'
                                count={data.length}
                                page={page}
                                onPageChange={(_, newPage) => setPage(newPage)}
                                rowsPerPage={rowsPerPage}
                                rowsPerPageOptions={[rowsPerPage]}
                                sx={{ display: 'flex', justifyContent: 'flex-start' }}

                            />
                        )
                    }
                </>
            ) : (
                <Typography variant="body1" sx={{ color: 'var(--primary-title)' }}>
                    Nenhum usuario encontrado.
                </Typography>
            )}
        </Layout>
    );
}