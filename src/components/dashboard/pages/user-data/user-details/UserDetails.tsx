import { useEffect, useState } from "react";
import { Box, Button, Container, TextField } from "@mui/material";
import { AdminSummary } from '@domain/user';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { adminAdd } from "@service/AdminService";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@service/firebase";
import { EMPTY } from '@domain/utils';
import { PermissionLevel } from '@domain/enums';
import InvalidToken from "@components/invalid-token/InvalidToken";
import Loading from "@components/loading/Loading";

export default function UserDetails() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<AdminSummary>(new AdminSummary());
    const [tokenValid, setTokenValid] = useState(false);

    const token = searchParams.get('token');

    function navTodata() {
        navigate(`/login`, {
            state: { showSnackbar: true }
        });
    }

    function handleChange(field: keyof AdminSummary, value: any) {
        setData(prev => AdminSummary.fromJson({ ...prev, [field]: value }));
    };

    async function verifyToken() {
        if (!token) {
            setTokenValid(false);
            setLoading(false);
            return;
        }

        try {
            const docRef = doc(db, "invites", token);
            const tokenDoc = await getDoc(docRef);

            if (tokenDoc.exists()) {
                const inviteData = tokenDoc.data();
                setData(AdminSummary.fromJson({
                    ...data,
                    email: inviteData.email || EMPTY,
                    permission: inviteData.permission || PermissionLevel.VOLUNTARIO
                }));
                setTokenValid(true);
            } else {
                setTokenValid(false);
            }
        } catch (error) {
            console.error("Erro ao verificar token:", error);
            setTokenValid(false);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        verifyToken();
    }, [token]);

    async function handleSubmit(e: React.FormEvent): Promise<void> {
        e.preventDefault();
        await adminAdd(data, data.password);
        setData(new AdminSummary());
        navTodata();
    }

    if (loading) {
        return <Loading />;
    }
    if (!tokenValid) {
        return <InvalidToken />
    }

    return (
        <Box className='box'>
            <Container className='box'>
                <form onSubmit={handleSubmit} className="form">
                    <h2 className='title'>Cadastrar usuário</h2>
                    <Box mb={2}>
                        <TextField
                            label="Nome"
                            value={data.name}
                            onChange={(e) =>
                                handleChange("name", e.target.value.toUpperCase())
                            }
                            fullWidth
                            required
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            label="Email"
                            type="email"
                            value={data.email}
                            onChange={(e) =>
                                handleChange("email", e.target.value.toUpperCase())
                            }
                            fullWidth
                            required
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            label="Senha"
                            type='text'
                            value={data.password}
                            onChange={(e) =>
                                handleChange("password", e.target.value)
                            }
                            fullWidth
                            required
                        />
                    </Box>
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Salvar usuário
                    </Button>
                </form>
            </Container>
        </Box>
    );
}
