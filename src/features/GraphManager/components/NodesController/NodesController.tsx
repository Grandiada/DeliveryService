import * as React from 'react';
import { Tag, Input, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { present } from '../../../../common/helpers/lang';

import './NodesController.scss';

export interface INodesControllerProps {
    nodeKeys: string[];
    add: (key: string) => void;
    remove: (key: string) => void;
    edit: (oldKey: string, newKey: string) => void;
}

export interface INodesControllerState {
    inputVisible: boolean,
    inputValue: string,
    editInputIndex: number,
    editInputValue: string,
}

export default class NodesController extends React.PureComponent<INodesControllerProps, INodesControllerState> {

    private editInput = React.createRef<Input>();
    private input = React.createRef<Input>();

    constructor(props: INodesControllerProps) {
        super(props);

        this.state = {
            inputVisible: false,
            inputValue: '',
            editInputIndex: -1,
            editInputValue: '',
        }
    }

    public render() {
        return (
            <div className={'node-controller'}>
                {this.props.nodeKeys.map((nodeKey, index) => {
                    if (this.state.editInputIndex === index) {
                        return (
                            <Input
                                ref={this.editInput}
                                key={nodeKey}
                                size="small"
                                className="tag-input"
                                value={this.state.editInputValue}
                                onChange={this.handleEditInputChange}
                                onBlur={this.handleEditInputConfirm}
                                onPressEnter={this.handleEditInputConfirm}
                            />
                        );
                    }

                    const isLongTag = nodeKey.length > 20;

                    const tagElem = (
                        <Tag
                            className="edit-tag"
                            key={nodeKey}
                            closable={true}
                            onClose={() => this.handleClose(nodeKey)}
                        >
                            <span
                                onDoubleClick={e => {
                                    if (index !== 0) {
                                        this.setState({ editInputIndex: index, editInputValue: nodeKey }, () => {
                                            present(this.editInput.current).focus();
                                        });
                                        e.preventDefault();
                                    }
                                }}
                            >
                                {isLongTag ? `${nodeKey.slice(0, 20)}...` : nodeKey}
                            </span>
                        </Tag>
                    );
                    return isLongTag ? (
                        <Tooltip title={nodeKey} key={nodeKey}>
                            {tagElem}
                        </Tooltip>
                    ) : (
                            tagElem
                        );
                })}

                {this.state.inputVisible && (
                    <Input
                        ref={this.input}
                        type="text"
                        size="small"
                        className="tag-input"
                        value={this.state.inputValue}
                        onChange={this.handleInputChange}
                        onBlur={this.handleInputConfirm}
                        onPressEnter={this.handleInputConfirm}
                    />
                )}
                {!this.state.inputVisible && (
                    <Tag className="site-tag-plus" onClick={this.showInput}>
                        <PlusOutlined /> Add node
                    </Tag>
                )}
            </div>
        );
    }


    handleClose = (removedTag: string) => {
        this.props.remove(removedTag);
    };

    showInput = () => {
        this.setState({ inputVisible: true }, () => present(this.input.current).focus());
    };

    handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ inputValue: e.target.value });
    };

    handleEditInputConfirm = () => {
        this.setState(({ editInputIndex, editInputValue }) => {
            this.props.edit(this.props.nodeKeys[editInputIndex], editInputValue)
            return {
                editInputIndex: -1,
                editInputValue: '',
            };
        });
    };

    handleInputConfirm = () => {
        const { inputValue } = this.state;
        this.props.add(inputValue);

        this.setState({
            inputVisible: false,
            inputValue: '',
        });
    };

    handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ editInputValue: e.target.value });
    };
}
