import React from 'react'


const FullScreenLayout: React.FC = ({ children }) => {
    return <div className="bg-primary d-flex min-vw-100 min-vh-100 align-items-center justify-content-center">{children}</div>
}

export default FullScreenLayout