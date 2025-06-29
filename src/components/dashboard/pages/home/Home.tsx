import './home.scss';
import { Container, Typography } from '@mui/material';
import CardData from './card-data/CardData';
import FinancialGraph from './financial-graph/FinancialGraph';
import { FinancialProvider } from '@context/FinancialContext';
import VisitorGraph from './visitor-graph/visitorGraph'
import ReportGraph from './report-graph/reportGraph';
import BirthdayMonth from './birthday-month/BirthdayMonth';

export default function Home() {

    return (
        <FinancialProvider>
            <Container className="home-container">
                <Typography variant="h4" className='title'>Painel Geral</Typography>
                <BirthdayMonth />
                <FinancialGraph />
                <VisitorGraph />
                <ReportGraph />
                <CardData />
            </Container>
        </FinancialProvider>
    );
}
