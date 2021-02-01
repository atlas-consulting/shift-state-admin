import React from 'react';
import { useDispatch } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { Button, Nav, NavItem } from 'reactstrap'
import { revokeToken } from '../../state/modules/auth'
import shiftStateLogo from '../../assets/images/shiftstate-logo.png'
import { RiDashboardFill, RiFilter2Fill } from 'react-icons/ri'

const DashboardLayout: React.FC = ({ children }) => {
    const history = useHistory()
    const dispatch = useDispatch()
    const logoutClicked = () => {
        dispatch(revokeToken())
        history.push('/sign-in')
    }
    return <div className="site-wrapper">
        <aside className="aside p-4 bg-primary d-none d-lg-block" role="navigation">
            <img src={shiftStateLogo} alt="" style={{ width: 100, display: 'block', marginBottom: '2.5em' }} />
            <Nav vertical>
                <NavItem className="mb-4"><Link className="text-light d-flex align-items-center" to="/"><RiDashboardFill className="mr-4" /> Home</Link></NavItem>
                <NavItem ><Link className="text-light d-flex align-items-center" to="/filters"><RiFilter2Fill className="mr-4" /> Filters</Link></NavItem>
            </Nav>
        </aside>
        <main className="content-wrapper">
            <Nav className="p-4 bg-primary d-flex flex-row-reverse">
                <NavItem><Button onClick={logoutClicked} className="btn btn-link text-light bg-primary">Logout</Button></NavItem>
            </Nav>
            {children}
        </main>
    </div>
}
export default DashboardLayout