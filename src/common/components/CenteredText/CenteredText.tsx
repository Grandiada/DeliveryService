import * as React from 'react';

import './CenteredText.scss';

export interface ICenteredTextProps {
    text: string;
    size: 'sm' | 'lg'
}

export default class CenteredText extends React.PureComponent<ICenteredTextProps> {
    public render() {
        return (
            <div className={'centered-text'}>
                <span className={`centered-text_text_${this.props.size}`}>{this.props.text}</span>
            </div>
        );
    }
}
