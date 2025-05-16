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

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login/>}/>
                <Route path="/" element={<Login/>}/>
                <Route path="/dashboard/:userId" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}>
                    <Route path="home" element={<Home/>}/>
                    <Route path="visitor" element={<VisitorData/>}/>
                    <Route path="new-visitor" element={<VisitorDetails/>}/>
                    <Route path="/dashboard/:userId/edit-visitor/:visitorId" element={<VisitorDetails/>}/>
                    <Route path="member" element={<MemberData/>}/>
                    <Route path="new-member" element={<MemberDetails/>}/>
                    <Route path="/dashboard/:userId/edit-member/:memberId" element={<MemberDetails/>}/>
                    <Route path="group" element={<GroupData/>}/>
                    <Route path="new-group" element={<GroupDetails/>}/>
                    <Route path="/dashboard/:userId/edit-group/:groupId" element={<GroupDetails/>}/>
                    <Route path="financial" element={<FinancialData/>}/>
                    <Route path="preferences" element={<Preferences/>}/>
                    <Route path="report" element={<ReportData/>}/>
                    <Route path="new-report-church" element={<ReportChurchDetails/>}/>
                </Route>
                <Route path="*" element={<Navigate to="/login"/>}/>
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