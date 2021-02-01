import { FC, useEffect, useState } from "react";
import { Button } from "reactstrap";

interface AuthLinkProps {
    token: string
    clientType: 'gmail' | 'office365'
    emailClientId: number
}

export const AuthLink: FC<AuthLinkProps> = (props) => {
    const [OAuthLink, setOAuthLink] = useState('')
    useEffect(() => {
        fetch(`/api/client-auth-urls/${props.clientType}/${props.emailClientId}`, {
            headers: {
                'Authorization': `Bearer ${props.token}`
            }
        }).then(res => res.json()).then(({ data }) => {
            setOAuthLink(data.authUrl)
        }).catch(console.error)
    }, [props.clientType, props.emailClientId, props.token])
    return <Button disabled={!OAuthLink}><a href={OAuthLink ? OAuthLink : '#'}>Click here to authorize this Client</a></Button>
}