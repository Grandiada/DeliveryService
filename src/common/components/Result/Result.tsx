import * as React from 'react';

import './Result.scss';

export interface IResultProps {
    result?: string;
}

export default class Result extends React.PureComponent<IResultProps> {
    public render() {
        return (
            this.props.result && <div className={'result'}>
                <span>{this.props.result}</span>
            </div> || <></>
        );
    }
}
