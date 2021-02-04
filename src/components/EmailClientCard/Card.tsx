import { FC } from 'react'
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import styled from 'styled-components'
import { RiCheckboxCircleLine, RiFilter3Fill } from 'react-icons/ri'
import { EmailClient } from '../../state/modules/email-clients/types'
import { useRef } from 'react';
import { useShiftState } from '../../hooks';

interface EmailClientProp {
    emailClient: EmailClient
}

const CardContainer = styled.article`
    position: relative;
    display: flex;
    flex-direction: column; 
    background: #161616;
    border: 1px solid black;
    min-width: 320px;
    min-height: 300px;
    border-radius: 32px;
    padding: 24px;
    box-shadow: 0 8px 24px -16px  rgba(0,0,0,.5);
    margin: 16px 0;
    margin-right: 16px;
    transition: all .3s ease-in-out;
    &:hover {
        background: #343434;
        cursor: pointer;
        transform: translateY(-8px);
    }
`;

const EmailClientCardTitle = styled.h3`
    font-size: 24px;
    color: white;
`

const EmailClientType = styled.div`
    color: ${({ emailClient: { type: { description } } }: EmailClientProp) => description === 'GMAIL' ? '#e74c3c' : '#fefefe'};
`;

export const EmailClientCard: FC<EmailClientProp> = ({ emailClient }) => {
    const cardEl = useRef<HTMLElement>(null)
    const { client } = useShiftState()
    return <CardContainer ref={cardEl}>
        <RiCheckboxCircleLine style={{ top: 16, right: 16, position: 'absolute', color: emailClient.accessToken ? '#e74c3c' : 'white' }} />
        <header style={{ flex: 1, paddingTop: 16 }}>
            <EmailClientCardTitle>{emailClient.alias}</EmailClientCardTitle>
            <EmailClientType emailClient={emailClient}>{emailClient.type.description}</EmailClientType>
        </header>
        <section style={{ fontSize: 16, color: 'white', margin: '8px 0px' }}>
            <RiFilter3Fill /> {emailClient.connectedFilters.length} Filter(s) Connected
    </section>
        <footer style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button color="primary" style={{ borderRadius: 24 }} size="lg" onClick={() => client.remove(emailClient.id).then(() => {
                cardEl.current?.remove()
            })}>Delete</Button><Link to={`/client/${emailClient.id}`}><Button style={{ borderRadius: 24 }} size="lg">Edit</Button></Link>
        </footer>
    </CardContainer>
}