import { PermissionLevel } from "@domain/enums";
import { AdminSummary } from "@domain/user";
import { ContentCopy } from "@mui/icons-material";
import { Box, Button, Container, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import { invited } from "@service/AdminService";
import { useState } from "react";

export default function UserInvited() {
    const [data, setData] = useState<AdminSummary>(new AdminSummary());
    const [permission, setPermission] = useState<PermissionLevel>(PermissionLevel.VOLUNTARIO);
    const [_, setCopied] = useState<boolean>(false);
    const [link, setLink] = useState<any>();

    function handleChange(field: keyof AdminSummary, value: any) {
        setData(prev => AdminSummary.fromJson({ ...prev, [field]: value }));
    };

    async function createInvite() {
        if(!data.email) return alert("Email inválido");

        const user = new AdminSummary();
        user.email = data.email;
        user.permission = permission;

        try {
            setLink(await invited(user, window.location.origin));
            await navigator.clipboard.writeText(link);
        } catch (error) {
            console.error(error);
        }    
    }

    function copy(): void {
        navigator.clipboard.writeText(link).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        })
    }

    return (
        <Container className='details-container'>
            <form className="details-form">
                <Typography mb={2} variant="h4" component="h1" className='title'>
                    Gerar Convite
                </Typography>
                <Box mb={2}>
                    <TextField
                        label="Email"
                        type="email"
                        value={data.email}                    
                        onChange={(e) => 
                            handleChange("email", e.target.value)
                        }
                        fullWidth
                        required
                    />
                </Box>
            <Box mb={2}>
                <TextField
                    select
                    label="Permissão"
                    value={permission}
                    onChange={(e) => setPermission(Number(e.target.value) as PermissionLevel)}
                    fullWidth
                    SelectProps={{ native: true }}
                >
                    <option value="" disabled>Selecione uma permissão</option>
                    {Object.values(PermissionLevel)
                        .filter(value => typeof value === "number")
                        .map((value) => (
                            <option key={value} value={value}>
                                {PermissionLevel[value as PermissionLevel]}
                            </option>
                        ))}
                </TextField>
            </Box>
                <Box mb={2}>
                    <TextField
                        color="secondary" 
                        type='text'
                        value={link}
                        fullWidth
                        disabled
                        InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={copy}>
                                    <ContentCopy/>
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                        
                    />
                </Box>
                <Button 
                    variant="contained" 
                    sx={{ mb: 2 }}
                    onClick={createInvite}
                >
                    Gerar convite
                </Button>
            </form>
        
        </Container>
    )
}