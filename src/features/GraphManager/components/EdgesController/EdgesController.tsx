import * as React from 'react';
import { Button, InputNumber, Row, Select, Tag } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Graph } from '../../models/Graph';

const { Option } = Select;

import './EdgesController.scss';

export interface IEdgesControllerProps {
    nodeKeys: string[];
    graph: Graph;
    addEdge: (source: string, target: string, price: number) => void;
    removeEdge: (source: string, target: string) => void;
}

export interface IEdgesControllerState {
    sourceSelectedNode: string;
    targetSelectedNode: string;
    price: number;
}

export default class EdgesController extends React.Component<IEdgesControllerProps, IEdgesControllerState> {
    constructor(props: IEdgesControllerProps) {
        super(props);

        this.state = {
            sourceSelectedNode: props.nodeKeys[0],
            targetSelectedNode: props.nodeKeys[1],
            price: 0
        }
    }

    public render() {
        return (
            <div className={'edges-controller'}>
                <Row>
                    <Select className={'edges-controller_source-select'}
                        value={this.state.sourceSelectedNode}
                        onChange={(value) => { this.setState({ sourceSelectedNode: value }); }}>
                        {this.props.nodeKeys.map((o) =>
                            <Option value={o} key={o}>{o}</Option>
                        )}
                    </Select>
                    <ArrowRightOutlined />
                    <Select className={'edges-controller_target-select'}
                        value={this.state.targetSelectedNode}
                        onChange={(value) => { this.setState({ targetSelectedNode: value }); }}>
                        {this.props.nodeKeys.map((o) =>
                            <Option value={o} key={o}>{o}</Option>
                        )}
                    </Select>
                    <InputNumber className={'edges-controller_price'} min={0} value={this.state.price} onChange={(value) => {
                        if (value)
                            this.setState({ price: Number(value) });
                    }} />
                    <Button type="primary" onClick={
                        () => {
                            this.props.addEdge(this.state.sourceSelectedNode, this.state.targetSelectedNode, this.state.price)
                            this.setState({
                                price: 0
                            });
                        }
                    }>+</Button>
                </Row>
                <div>
                    {Object.keys(this.props.graph).map((key) => {
                        return this.props.graph[key]?.neighbors.map((item) => {
                            return <Tag
                                closable={true}
                                className="tag"
                                key={item.key}
                                onClose={() => this.props.removeEdge(key, item.key)}
                            >
                                <span>
                                    {key}<ArrowRightOutlined />{item.key}: {item.cost}
                                </span>
                            </Tag>
                        })
                    })}
                </div>
            </div>
        );
    }
}
