import { useHistory } from 'react-router-dom'
import { ButtonGroup, Label, Input, Button, InputGroup, InputGroupAddon, InputGroupText, Col, Row, FormGroup } from 'reactstrap'
import * as Layout from './layouts'
import { FilterClause } from '../state/modules/filters/types'
import { useCreateFilter } from '../hooks/useCreateFilter'
import { useAuth } from '../hooks'
import { formatFilterConfiguration } from '../utilities'


interface FilterConfiguration {
    description: string;
    from: string;
    subject: string;
    forward: string;
    clauses: Record<number, FilterClause>
}


const submitNewFilter = ({ description, ...rest }: FilterConfiguration, token: string, accountId: number, callback: CallableFunction) => {
    fetch('/api/filters', {
        method: 'POST',
        body: JSON.stringify({
            description: description,
            accountId,
            filterConfiguration: {
                ...rest
            }
        }),
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
        .then((response) => {
            console.log(response);
            callback()
        })
        .catch(console.error)
}

const NewFilter = () => {
    const {
        from,
        forward,
        description,
        updateDescription,
        subject,
        updateFrom,
        updateSubject,
        updateForward,
        clauses,
        updateClause,
        addAndClause,
        addOrClause,
        removeClaus
    } = useCreateFilter({});
    const { token, account: { id: accountId } } = useAuth()
    const history = useHistory()
    return <Layout.DashboardLayout isSubPage header='Create a New Filter' subPageDescr="Create a New Filter">
        <code style={{ padding: 20, display: "block" }}>
            {formatFilterConfiguration(
                {
                    clauses,
                    from,
                    subject
                })}
        </code>
        <Row className="p-4 bg-light mx-0">
            <Col md="6">
                <section style={{ margin: "10px 0" }}>
                    <FormGroup>
                        <Label>
                            Description
                        </Label>
                        <Input
                            placeholder="Something to remember me by"
                            value={description}
                            onChange={updateDescription}
                        />
                    </FormGroup>
                    <InputGroup>
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText>From</InputGroupText>
                        </InputGroupAddon>
                        <Input
                            placeholder="someone@up2nogood.com"
                            value={from}
                            onChange={updateFrom}
                        />
                    </InputGroup>
                    <InputGroup className="my-2">
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText>Forward to</InputGroupText>
                        </InputGroupAddon>
                        <Input
                            placeholder="admin@shiftstate.com"
                            value={forward}
                            onChange={updateForward}
                        />
                    </InputGroup>
                </section>
            </Col>
            <Col md="6">
                <section style={{ margin: "10px 0" }}>
                    <Label>Subject Contains</Label>
                    <Input
                        placeholder="Subject Contains"
                        value={subject}
                        onChange={updateSubject}
                    />
                    <ButtonGroup className="py-2">
                        <Button color="primary" onClick={addAndClause}>
                            Add AND
              </Button>
                        <Button color="success" onClick={addOrClause}>
                            Add OR
              </Button>
                    </ButtonGroup>
                    {!!Object.values(clauses).length &&
                        Object.values(clauses).map((c) => {
                            return (
                                <InputGroup className="my-2" key={c.id}>
                                    <Input value={c.value} onChange={updateClause(c.id)} />
                                    <Button color="warning" onClick={() => removeClaus(c.id)}>
                                        Remove {c.type}
                                    </Button>
                                </InputGroup>
                            );
                        })}
                </section>
            </Col>
            <Button className="btn-full" onClick={() => {
                submitNewFilter({ description, from, subject, clauses, forward }, token!, accountId, () => {
                    history.push("/")
                })
            }}>Submit</Button>
        </Row>
    </Layout.DashboardLayout>
}

export default NewFilter