import { Button, Row, Select } from 'antd';
import * as React from 'react';
import Result from '../../../../common/components/Result/Result';
import { present } from '../../../../common/helpers/lang';
import { Graph } from '../../models/Graph';

import './RouteCalculator.scss';

export interface IRouteCalculatorProps {
    nodes: string[];
    graph: Graph;
}

export interface IRouteCalculatorState {
    selectedNodes: string[];
    result?: string;
}

export default class RouteCalculator extends React.Component<IRouteCalculatorProps, IRouteCalculatorState> {
    constructor(props: IRouteCalculatorProps) {
        super(props);

        this.state = {
            selectedNodes: []
        }
    }

    private calculate = () => {
        let calculatedPrice = 0;
        let curentNode = present(this.props.graph[this.state.selectedNodes[0]]);

        for (let i = 1; i < this.state.selectedNodes.length; i++) {
            const neighborNode = curentNode.neighbors.find(n => n.key === this.state.selectedNodes[i])

            if (neighborNode) {
                curentNode = present(this.props.graph[this.state.selectedNodes[i]])
                calculatedPrice += neighborNode.cost;
            }
            else {
                this.setState({ result: 'No Such Route' });
                return;
            }
        }
        this.setState({ result: calculatedPrice.toString() });
    }

    public render() {
        const { selectedNodes } = this.state;
        const filteredOptions = this.props.nodes.filter(o => !selectedNodes.includes(o));
        return (
            <div className={'route-calculator'}>
                <Row>
                    <Select
                        className={'route-calculator_route-select'}
                        mode="multiple"
                        placeholder="Route"
                        value={selectedNodes}
                        onChange={(selectedItems) => this.setState({ selectedNodes: selectedItems })}
                    >
                        {filteredOptions.map(item => (
                            <Select.Option key={item} value={item}>
                                {item}
                            </Select.Option>
                        ))}
                    </Select>
                </Row>
                <Row>
                    <Button type='primary' className={'route-calculator_btn'} onClick={() => {
                        if (this.state.selectedNodes.length === 0)
                            return;

                        this.calculate()
                    }}>CASE 1: Calculate</Button>
                </Row>

                <Result result={this.state.result}></Result>
            </div>
        );
    }
}
