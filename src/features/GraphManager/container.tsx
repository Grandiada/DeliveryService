import * as React from 'react';
import { Graph } from './models/Graph';
import { Button, Col, Divider, notification, Row, Space } from 'antd';
import { present } from '../../common/helpers/lang';
import NodesController from './components/NodesController/NodesController';

export interface IGraphManagerState {
    graph: Graph;
}

export default class GraphManager extends React.Component<{}, IGraphManagerState> {
    constructor(props: any) {
        super(props);

        this.state = {
            graph: {}
        }
    }

    private AddGraphNode = (nodeKey: string) => {
        if (this.state.graph[nodeKey])
            notification.error({ message: 'Node already added' })
        else
            this.setState({
                graph: {
                    ...this.state.graph,
                    ...{ [nodeKey]: { neighbors: [], neighborsVisited: 0 } }
                }
            })
    }

    private RemoveGraphNode = (nodeKey: string) => {
        if (!this.state.graph[nodeKey])
            notification.error({ message: 'Something went wrong' })
        else {
            const copy = {
                ...this.state.graph
            };

            for (const key in copy)
                present(copy[key]).neighbors = present(copy[key]).neighbors.filter(i => i.key !== nodeKey);

            delete copy[nodeKey];
            this.setState({
                graph: copy
            })
        }
    }

    private RenameGraphNode = (oldKey: string, newKey: string) => {
        if (!this.state.graph[oldKey])
            notification.error({ message: 'Something went wrong' })
        else {
            const objectClone = {
                ...this.state.graph
            };

            const oldObject = { ...present(objectClone[oldKey]) };
            delete objectClone[oldKey];
            objectClone[newKey] = oldObject;

            // tslint:disable-next-line: forin
            for (const key in objectClone) {
                const element = present(objectClone[key]).neighbors.find(i => i.key === oldKey);
                if (element)
                    element.key = newKey
            }

            this.setState({
                graph: objectClone
            })
        }
    }


    private AddEdge = (sourceKey: string, targetKey: string, cost: number) => {
        if (!this.state.graph[sourceKey] || !this.state.graph[targetKey])
            notification.error({ message: 'Something went wrong' })
        else {
            const copy = {
                ...this.state.graph
            };
            present(copy[sourceKey]).neighbors.push({ key: targetKey, cost })
            this.setState({
                graph: copy
            })
        }
    }

    private RemoveEdge = (sourceKey: string, targetKey: string) => {
        if (!this.state.graph[sourceKey] || !this.state.graph[targetKey])
            notification.error({ message: 'Something went wrong' })
        else {
            const copy = {
                ...this.state.graph
            };
            present(copy[sourceKey]).neighbors.filter(i => i.key === targetKey)
            this.setState({
                graph: copy
            })
        }
    }

    public render() {
        return (
            <>
                <Divider orientation="center">Configuration</Divider>
                <Row>
                    <Col flex="300px" style={{ background: 'red' }}>
                        <Row>
                            <Divider orientation="center">Nodes</Divider>

                            <NodesController
                                nodeKeys={Object.keys(this.state.graph)}
                                add={this.AddGraphNode}
                                remove={this.RemoveGraphNode}
                                edit={this.RenameGraphNode}
                            /></Row >
                        <Row>
                            <Divider orientation="center">Nodes</Divider>
                            Edges
                        </Row >
                    </Col>
                    <Col flex="auto" style={{ background: 'blue' }}>Fill Rest</Col>
                </Row>

                <Divider orientation="center">Calculation</Divider>
                <Row justify="space-around">
                    <Col span={8} style={{ background: 'orange' }}>col-4</Col>
                    <Col span={8} style={{ background: 'blue' }}>col-4</Col>
                </Row>
            </>
        );
    }
}
