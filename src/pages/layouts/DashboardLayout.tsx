import React from 'react';
import { Link } from 'react-router-dom'
import { Nav, NavItem } from 'reactstrap'
const DashboardLayout: React.FC = ({ children }) => <div className="site-wrapper">
    <aside className="aside p-4 bg-primary d-none d-lg-block" role="navigation">
        <Nav vertical>
            <NavItem><Link className="text-light" to="/">Home</Link></NavItem>
        </Nav>
    </aside>
    <main className="content-wrapper">{children}</main>
</div>

export default DashboardLayout