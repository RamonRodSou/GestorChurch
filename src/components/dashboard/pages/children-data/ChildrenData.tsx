import { Info } from "@mui/icons-material";
import {
    Box,
    Button,
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
import { Child } from '@domain/user';
import { findGroupSummaryToById } from "@service/GroupService";
import { GroupSummary } from "@domain/group";
import { whatzapp } from "@domain/utils";
import Layout from "@components/layout/Layout";
import { findAllChildrens } from "@service/ChildrenService";
import ChildrenDataModal from "./children-data-modal/ChildrenDataModa";
import { AgeGroup } from "@domain/enums/AgeGroup";

export default function ChildrenData() {
    const [data, setData] = useState<Child[]>([]);
    const [filtered, setFiltered] = useState<Child[]>([]);
    const [filter, setFilter] = useState<AgeGroup | string>('all');
    const [selectedChild, setSelectedChild] = useState<Child | null>(null);
    const [openData, setOpenData] = useState(false);
    const [groupData, setGroupData] = useState<GroupSummary | null>(null); 

    const roleEntries = Object.entries(AgeGroup)
    
    function handleOpenDetails(children: Child) {
        if (children.groupId) {
            findGroupSummaryToById(children.groupId)
                .then((group) => {
                    setGroupData(group);
                })
                .catch(console.error);
        } else {
            setGroupData(null)
        }
        setSelectedChild(children); 
        setOpenData(true);
    }

    const filteredMembers = filtered.filter(item => {
        if (filter === 'all') return true;
        return item.ageGroup === AgeGroup[filter.toUpperCase() as keyof typeof AgeGroup];
    });

    useEffect(() => {
        findAllChildrens()
            .then((it) => {
                setData(it);
                setFiltered(it);
            })
            .catch(console.error);
    }, []);

    return (
        <Layout title="Crianças" path="new-children" message="Crainça criado com sucesso!">
            <Search<Child> 
                data={data} 
                onFilter={setFiltered} 
                label={'Buscar Criança'}
                searchBy={(item, term) =>
                    item.name.toLowerCase().includes(term.toLowerCase()) ||
                    item.phone.includes(term) 
                }
            />
            
            <Box className="boxFilter">
                <Button
                    variant={filter === 'all' ? 'contained' : 'outlined'}
                    onClick={() => setFilter('all')}

                >
                    Todos
                </Button>

                {roleEntries.map(([key, value]) => (
                    <Button
                        key={key}
                        variant={filter === key.toLowerCase() ? 'contained' : 'outlined'}
                        onClick={() => setFilter(key.toLowerCase())}
                    >
                        {value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()}
                    </Button>
                ))}
            </Box>

            {filteredMembers
                .sort
                ?.length > 0 ? (
                    <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                        <TableRow>
                            <TableCell className='title-secondary'>Nome</TableCell>
                            <TableCell className='title-secondary'>Telefone</TableCell>
                            <TableCell className='title-secondary'>Status</TableCell>
                            <TableCell className='title-secondary'>Info</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {filteredMembers
                        .filter((it) => it.isActive)
                            .map((it) => (
                                <TableRow key={it.id}>
                                    <TableCell className='data-text'>{it.name.split(" ").at(0)}</TableCell>
                                    <TableCell 
                                        className='data-text onClick' 
                                        onClick={() => whatzapp(it.name, it.phone)}
                                    >
                                    {it.phone}
                                </TableCell>
                                    <TableCell className='data-text'>{it.role}</TableCell>
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
                    Nenhuma criança encontrada.
                </Typography>
            )}
        <ChildrenDataModal
                groupData={groupData}
                open={openData}
                onClose={() => setOpenData(false)}
                children={selectedChild}
            />
        </Layout>
    );
}
