import { Info } from "@mui/icons-material";
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from 'react';
import Search from '@components/search/Search';
import { Group } from "@domain/group/Group";
import { findAllGroups } from "@service/GroupService";
import GroupDataModal from "./group-data-modal/groupDataModa";
import Layout from "@components/layout/Layout";

export default function GroupData() {
    const [data, setData] = useState<Group[]>([]);
    const [filtered, setFiltered] = useState<Group[]>([]);
    const [openData, setOpenData] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

    function handleOpenDetails(g: Group) {
        setSelectedGroup(g);
        setOpenData(true);
    }

    useEffect(() => {
        findAllGroups()
            .then((it) => {
                setData(it);
                setFiltered(it);
            })
            .catch(console.error);
    }, []);

    return (
        <Layout title="GC" path="new-group" message="GC criado com sucesso!">
            <Search<Group> 
                data={data} 
                onFilter={setFiltered} 
                label={'Buscar GC'}
                searchBy={(item, term) =>
                    item.name.toLowerCase().includes(term.toLowerCase())
                }
            />

            {filtered?.length > 0 ? (
                    <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                        <TableRow>
                            <TableCell className='title-secondary'>Nome</TableCell>
                            <TableCell className='title-secondary'>Lideres</TableCell>
                            <TableCell className='title-secondary'>Info</TableCell>

                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {filtered.map((it) => (
                            <TableRow key={it.id}>
                            <TableCell className='data-text'>{it.name}</TableCell>
                            <TableCell className='data-text'>
                                {it.leaders.map(it => it.name.split(" ")[0]).join(" / ")}
                            </TableCell>
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
                    Nenhum gc encontrado.
                </Typography>
            )}
            <GroupDataModal
                open={openData}
                onClose={() => setOpenData(false)}
                group={selectedGroup}
            />
        </Layout>
    );
}