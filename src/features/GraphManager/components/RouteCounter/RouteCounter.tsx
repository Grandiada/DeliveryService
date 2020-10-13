import * as React from 'react';
import { Button, Row, Select } from 'antd';
import { present } from '../../../../common/helpers/lang';
import { Graph } from '../../models/Graph';

const { Option } = Select;

import './RouteCounter.scss';
import Result from '../../../../common/components/Result/Result';

export interface IRouteCounterProps {
    nodes: string[];
    graph: Graph;
}

export interface IRouteCounterState {
    routes?: number;
    sourceNode: string;
    targetNode: string;
    result?: string;
}

export default class RouteCounter extends React.Component<IRouteCounterProps, IRouteCounterState> {
    constructor(props: IRouteCounterProps) {
        super(props);

        this.state = {
            sourceNode: props.nodes[0],
            targetNode: props.nodes[0]
        }
    }


    private isNeighborsOpenedOrContainsTargket = (adj: Graph, s: string, target: string) => {
        if (s === target)
            return true;

        if (present(adj[s]).neighborsVisited < present(adj[s]).neighbors.length)
            return true;

        for (const neighbor of present(adj[s]).neighbors) {
            if (neighbor.key === target)
                return true;
            if (present(adj[neighbor.key]).neighborsVisited < present(adj[neighbor.key]).neighbors.length)
                return true;
        }
        return false;
    }


    private calculate = (adj: Graph, s: string, t: string): string => {
        try {
            let routes = 0;
            const queue: string[] = []
            queue.push(s)

            while (queue.length > 0) {
                const shifted = present(queue.shift())
                for (const neighborSymbol of present(adj[shifted]).neighbors) {
                    if (this.isNeighborsOpenedOrContainsTargket(adj, neighborSymbol.key, t)) {
                        if (neighborSymbol.key === t) {
                            present(adj[shifted]).neighborsVisited += 1
                            routes++;
                        } else {
                            queue.push(neighborSymbol.key)
                            present(adj[shifted]).neighborsVisited += 1
                        }
                    }
                }
            }
            return routes.toString();
        } catch (e) {
            return (e as Error).message;
        }
    }


    public render() {
        const options = this.props.nodes.map(i => <Option value={i} key={i}>{i}</Option>);
        return (
            <div className={'route-counter'}>
                <Row>
                    <Select
                        className={'route-counter_source-select'}
                        value={this.state.sourceNode} onChange={(value) => this.setState({ sourceNode: value })}>
                        {options}
                    </Select>
                    <Select
                        className={'route-counter_target-select'}
                        value={this.state.targetNode} onChange={(value) => this.setState({ targetNode: value })}>
                        {options}
                    </Select>
                </Row>

                <Row>
                    <Button type='primary'
                        className={'route-counter_btn'}
                        onClick={() => {
                            if (!this.state.sourceNode || !this.state.targetNode)
                                return;

                            this.setState({
                                result: this.calculate(this.props.graph, this.state.sourceNode, this.state.targetNode)
                            })
                        }}>CASE 2: Calculate</Button>
                </Row>

                <Result result={this.state.result}></Result>
            </div>
        );
    }
}
