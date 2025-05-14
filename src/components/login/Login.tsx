import './login.scss'
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EMPTY } from "@domain/utils/string-utils";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@service/firebase";
import { Box, Button, IconButton, InputAdornment, TextField } from "@mui/material";
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function Login() {
    const [email, setEmail] = useState(EMPTY);
    const [password, setPassword] = useState(EMPTY);
    const [error, setError] = useState(EMPTY);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    function handleTogglePasswordVisibility() {
        setShowPassword((prev) => !prev);
    };

    async function handleLogin (e: React.FormEvent) {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const userId = userCredential.user.uid;  
                
            if(userId) navigate(`/dashboard/${userId}/home`);    

        } catch (err: any) {
            setError("E-mail ou senha inválidos");
            alert('Usuario Invalido')
            console.error(err);
        }
    };

    return (
        <Box className='box'>
            <form className='form' onSubmit={handleLogin}>
                <h2 className='title'>Login</h2>
                <TextField 
                    type='email'
                    placeholder='E-mail'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className='w-full mb-3 p-2 border rounded'
                />
                <TextField 
                    type={showPassword ? "text" : "password"}
                    placeholder='Senha'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className='w-full mb-3 p-2 border rounded'
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                onClick={handleTogglePasswordVisibility}
                                edge="end"
                                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                                >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                {error && <p className='text-error'>{error}</p>}
                <Button
                    type='submit'
                    className='button'
                >
                    Entrar
                </Button>
            </form>
        </Box>
    );
}
