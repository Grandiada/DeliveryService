import * as React from 'react';
import { Graph } from './models/Graph';
import { Button, Col, Divider, notification, Row, Space } from 'antd';
import { present } from '../../common/helpers/lang';
import NodesController from './components/NodesController/NodesController';
import EdgesController from './components/EdgesController/EdgesController';

import CytoscapeComponent from 'react-cytoscapejs';
import RouteCalculator from './components/RouteCalculator/RouteCalculator';
import RouteCounter from './components/RouteCounter/RouteCounter';
import CenteredText from '../../common/components/CenteredText/CenteredText';

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
        if (!nodeKey)
            return;

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
        if (sourceKey === targetKey) {
            notification.error({ message: 'Source and target should be different' })
            return;
        }

        if (!this.state.graph[sourceKey] || !this.state.graph[targetKey])
            notification.error({ message: 'Something went wrong' })
        else if (this.state.graph[sourceKey]?.neighbors.find(i => i.key === targetKey)) {
            notification.error({ message: 'Edge already exist' })
        }
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
            present(copy[sourceKey]).neighbors = present(copy[sourceKey]).neighbors.filter(i => i.key !== targetKey)

            this.setState({
                graph: copy
            })
        }
    }
    private handleCy = (cy: cytoscape.Core) => {
        const refreshLayout = () => setTimeout(() => {
            cy.layout({ name: 'circle', directed: true }).run()
        }, 100);

        cy.on('add remove', () => {
            refreshLayout();
        });
    }

    public render() {

        const elements = [...Object.keys(this.state.graph).reduce(
            (previousValue, currentValue, index, array) =>
                [...previousValue, ...present(this.state.graph[currentValue]).
                    neighbors.map((item) => { return { data: { source: currentValue, target: item.key, label: item.cost }, classes: 'autorotate' }; })], []),
        ...Object.keys(this.state.graph).map((item) => { return { data: { id: item, label: item } } })]

        return (
            <div style={{ background: 'lightsteelblue', height: '100%' }}>
                <Row>
                    <Col flex="300px" style={{ borderRight: '2px solid black', height: '700px' }}>
                        <Row>
                            <Divider orientation="center">Nodes</Divider>
                            <NodesController
                                nodeKeys={Object.keys(this.state.graph)}
                                add={this.AddGraphNode}
                                remove={this.RemoveGraphNode}
                                edit={this.RenameGraphNode}
                            />
                        </Row >
                        <Row>
                            <Divider orientation="center">Edges</Divider>
                            {Object.keys(this.state.graph).length > 1 &&
                                <EdgesController
                                    removeEdge={this.RemoveEdge}
                                    graph={this.state.graph}
                                    addEdge={this.AddEdge}
                                    nodeKeys={Object.keys(this.state.graph)} /> || <CenteredText size="sm" text='Add at least 2 nodes' />}
                        </Row >
                    </Col>
                    <Col flex="auto">
                        {Object.keys(this.state.graph).length !== 0 &&
                            <CytoscapeComponent
                                pan={{ x: 100, y: 200 }}
                                elements={elements} style={{ width: '100%', height: '100%' }}
                                layout={{ name: 'circle', directed: true }}
                                cy={this.handleCy}
                                stylesheet={[
                                    {
                                        selector: 'node',
                                        style: {
                                            'content': 'data(id)',
                                        }
                                    },
                                    {
                                        selector: 'edge',
                                        style: {
                                            'width': '5px',
                                            'curve-style': 'bezier',
                                            'target-arrow-shape': 'triangle'
                                        }
                                    },
                                    {
                                        "selector": "edge[label]",
                                        "style": {
                                            "label": "data(label)",
                                            "width": 3
                                        }
                                    },
                                ]}
                            /> || <CenteredText size="lg" text='Add nodes to see graph representation' />
                        }
                    </Col>
                </Row>

                <Divider orientation="center">Calculation</Divider>
                <Row justify="space-around">
                    <Col span={8}>
                        <RouteCalculator
                            graph={this.state.graph}
                            nodes={Object.keys(this.state.graph)}
                        />
                    </Col>
                    <Col span={8}>
                        <RouteCounter
                            graph={this.state.graph}
                            nodes={Object.keys(this.state.graph)} />
                    </Col>
                </Row>
            </div>
        );
    }
}
