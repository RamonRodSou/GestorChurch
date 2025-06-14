import { useNavigate } from "react-router-dom";

export function useNavigateToDashboardWithSnackbar() {
    const navigate = useNavigate();

    return (id?: string, path?: string) => {
        navigate(`/dashboard/${id ?? ""}/${path ?? ""}`, {
            state: { showSnackbar: true }
        });
    };
}
