import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '@components/login/Login';
import Dashboard from '@components/dashboard/Dashboard';
import { JSX } from '@emotion/react/jsx-runtime';
import { AuthService } from '@service/auth-service';
import Home from '@components/dashboard/pages/home/Home';
import Preferences from '@components/dashboard/pages/preferences/Preferences';
import FinancialData from '@components/dashboard/pages/financial-data/FinancialData';
import MemberData from '@components/dashboard/pages/member-data/MemberData';
import MemberDetails from '@components/dashboard/pages/member-data/member-details/MemberDetails';
import VisitorData from '@components/dashboard/pages/visitor-data/VisitorData';
import VisitorDetails from '@components/dashboard/pages/visitor-data/visitor-details/VisitorDetails';
import GroupData from '@components/dashboard/pages/group-data/GroupData';
import GroupDetails from '@components/dashboard/pages/group-data/group-details/GroupDetails';
import ReportData from '@components/dashboard/pages/report-data/ReportData';
import ReportChurchDetails from '@components/dashboard/pages/report-data/report-church-details/RepertChurchDetails';
import ChildrenDetails from '@components/dashboard/pages/children-data/children-details/ChildrenDetails';
import ChildrenData from '@components/dashboard/pages/children-data/ChildrenData';
import ReportGroupData from '@components/dashboard/pages/report-group-data/ReportGroupData';
import VisitorGroupData from '@components/dashboard/pages/visitor-group-data/VisitorGroupData';
import VisitorGroupDetails from '@components/dashboard/pages/visitor-group-data/visitor-group-details/VisitorGroupDetails';
import ReportGroupDetails from '@components/dashboard/pages/report-group-data/report-group-details/ReportGroupDetails';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@service/firebase';
import { User } from 'firebase/auth';
import UserData from '@components/dashboard/pages/userData/UserData';
import UserDetails from '@components/dashboard/pages/userData/user-details/UserDetails';
import UserInvited from '@components/dashboard/pages/userData/user-invited/UserInvited';
import ServiceScheduleData from '@components/dashboard/pages/service-schedule/ServiceScheduleData';
import ServiceScheduleDetails from '@components/dashboard/pages/service-schedule/service-schedule-details/ServiceScheduleDetails';

function AppRouter() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) return <p>Carregando...</p>;
    return (
        <BrowserRouter basename="/gestor">
            <Routes>
                <Route path="new-user" element={<UserDetails />} />
                {!user ? (
                    <>
                        <Route path="/login" element={<Login />} />
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </>
                ) : (
                    <>
                        <Route path="/dashboard/:userId" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
                            <Route path="home" element={<Home />} />
                            <Route path="user" element={<UserData />} />
                            <Route path="user/invited" element={<UserInvited />} />
                            <Route path="new-user" element={<UserDetails />} />
                            <Route path="visitor" element={<VisitorData />} />
                            <Route path="new-visitor" element={<VisitorDetails />} />
                            <Route path="/dashboard/:userId/edit-visitor/:visitorId" element={<VisitorDetails />} />
                            <Route path="member" element={<MemberData />} />
                            <Route path="new-member" element={<MemberDetails />} />
                            <Route path="/dashboard/:userId/edit-member/:memberId" element={<MemberDetails />} />
                            <Route path="children" element={<ChildrenData />} />
                            <Route path="new-children" element={<ChildrenDetails />} />
                            <Route path="/dashboard/:userId/edit-children/:childId" element={<ChildrenDetails />} />
                            <Route path="service-schedule" element={<ServiceScheduleData />} />
                            <Route path="new-service-schedule" element={<ServiceScheduleDetails />} />
                            <Route path="group" element={<GroupData />} />
                            <Route path="new-group" element={<GroupDetails />} />
                            <Route path="/dashboard/:userId/edit-group/:groupId" element={<GroupDetails />} />
                            <Route path="financial" element={<FinancialData />} />
                            <Route path="preferences" element={<Preferences />} />
                            <Route path="report" element={<ReportData />} />
                            <Route path="new-report-church" element={<ReportChurchDetails />} />
                            <Route path="report-group" element={<ReportGroupData />} />
                            <Route path="new-report-group" element={<ReportGroupDetails />} />
                            <Route path="visitor-group" element={<VisitorGroupData />} />
                            <Route path="new-visitor-group" element={<VisitorGroupDetails />} />
                            <Route path="/dashboard/:userId/edit-visitor-group/:visitorGroupId" element={<VisitorGroupDetails />} />
                        </Route>
                        <Route path="*" element={<Navigate to={`/dashboard/${user?.uid}/home`} replace />} />
                    </>
                )}
            </Routes>
        </BrowserRouter>
    );
}

function ProtectedRoute({ children }: { children: JSX.Element }) {
    if (!AuthService.isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }
    return children;
}

export default AppRouter;