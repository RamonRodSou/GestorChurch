import { useMediaQuery, useTheme } from "@mui/material";
import { EMPTY } from "@domain/utils/string-utils"
import React, { createContext, useEffect, useState } from "react"

interface managerContextType {
    data: string | number;
    setData: React.Dispatch<React.SetStateAction<string>>;

    isMobile: boolean;
    setIsMobile: React.Dispatch<React.SetStateAction<boolean>>;

    openSnackbar: boolean;
    setOpenSnackbar: React.Dispatch<React.SetStateAction<boolean>>;

    snackbarMessage: string;
    setSnackbarMessage: React.Dispatch<React.SetStateAction<string>>;
}

export const ManagerContext = createContext<managerContextType>({
    data: EMPTY,
    setData: () => { },

    isMobile: false,
    setIsMobile: () => { },

    openSnackbar: false,
    setOpenSnackbar: () => { },

    snackbarMessage: EMPTY,
    setSnackbarMessage: () => { },
})

export const ManagerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down("sm"));
    const [data, setData] = useState<string>(EMPTY);
    const [isMobile, setIsMobile] = useState<boolean>(matches);
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>(EMPTY);

    useEffect(() => {
        setIsMobile(matches);
    }, [matches])

    return (
        <ManagerContext.Provider value={{
                data, setData, isMobile, setIsMobile, openSnackbar, setOpenSnackbar, snackbarMessage, setSnackbarMessage
            }}
        >
            {children}
        </ManagerContext.Provider>
    )
}