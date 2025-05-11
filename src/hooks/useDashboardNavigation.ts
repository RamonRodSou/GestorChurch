import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Admin } from "@domain/user";

export function useDashboardNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = useParams();
  const admin = location.state?.admin as Admin;

  const goToDashboardPath = (path: string) => {
    navigate(`/dashboard/${userId}/${path}`, { state: { admin } });
  };

  return { goToDashboardPath };
}
