import React, {Component} from 'react';
import './Expanse.css'

export class Expanse extends Component {
    state = {
        transaction: null,
        category: null,
    };

    handleChangeInput = event => {
        this.setState({[event.target.name]: event.target.value});
    };

    handleEnter = () => {
        const {onSubmit} = this.props;
        const {transaction, category} = this.state;

        onSubmit(-1 * Math.abs(parseFloat(transaction)), category);
        this.setState({transaction: null, category: null});
    };



    render() {
        const {transaction, category} = this.state;
        return (
            <form className="Contaiter">
                <dl>

                    <div className="InputLine">
                        <dt className="LineTitle">Make expense:</dt>
                        <dd className="LineInput">
                            <input
                                name="transaction"
                                onChange={this.handleChangeInput}
                                value={transaction || ''}
                            />
                        </dd>
                    </div>

                    <div className="InputLine">
                        <dt className="LineTitle">Category:</dt>
                        <dd className="LineInput">
                            <input
                                name="category"
                                onChange={this.handleChangeInput}
                                value={category || ''}
                            />
                        </dd>
                    </div>

                </dl>
                <button className="BtnEx" onClick={this.handleEnter}>Send</button>
            </form>
        );
    }

}

export default Expanse;