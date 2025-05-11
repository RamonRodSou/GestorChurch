import './login.scss'
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EMPTY } from "@domain/utils/string-utils";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@service/firebase";
import { Box, Button, TextField } from "@mui/material";

export default function Login() {
    const [email, setEmail] = useState(EMPTY);
    const [password, setPassword] = useState(EMPTY);
    const [error, setError] = useState(EMPTY);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
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
                    type='password'
                    placeholder='Senha'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className='w-full mb-3 p-2 border rounded'
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
