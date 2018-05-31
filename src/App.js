import React, {Component} from 'react';
import './App.css';
import moment from 'moment';
import Expanse from './Expanse';
import Incomes from './Incomes';
// import {findLastIndex} from 'lodash'; //поиск идет с правой стороны, а не с левой значений масивов
import styled from 'styled-components';

const Link = styled.span`
    cursor: pointer;
    color: white;
    margin: 0 8px;
    border-bottom: ${({selected}) => (selected ? '2px solid white' : 'none')};
`;

class App extends Component {
    constructor(props) {
        super(props);

        let storageState = localStorage.getItem('state');
        let initState;

        if (storageState !== null) {
    storageState = JSON.parse(storageState);
    initState = { ...storageState, date: moment(storageState.date)};
} else {
    initState = {date: moment(),
        navSelected: 'incomes',
        transactions: [],
    };
}
        this.state = initState;
    }

    handleAddDay = () => {
        this.setState({date: this.state.date.add(1, 'day')});
    };

    handleSubtractDay = () => {
        this.setState({date: this.state.date.subtract(1, 'day')});
    };

    handleNavClick = event => {
        this.setState({navSelected: event.target.getAttribute('name')});
    };


    handleSubmitTransaction = (sum, category) => {
        const {date: TodayDate, transactions} = this.state;

        const newTransaction = {
            date: TodayDate.format('DD.MM.YYYY'),
            category: category,
            sum: sum,
        };



        const newTransactions = [ ...transactions, newTransaction];

        newTransactions.sort((a, b) =>{
            const aDate = moment(a.date, 'DD.MM.YYYY');
            const bDate = moment(b.date, 'DD.MM.YYYY');
            return aDate.isAfter(bDate);
        });

        this.setState({transactions: newTransactions});
        // transactions = [{date, sum, category}]  //то какие значения будут сохранятся
    };

    componentDidUpdate() {
        const {date} = this.state;
        localStorage.setItem(
            'state',
            JSON.stringify({ ...this.state, date: date.format()}),
            );
    };
//метод вызывается когда поменялся стейт или пропсы и был рендер

    onToday = () => {
        const {transactions, date} = this.state;

        const currentMonthTransactions = transactions.filter(({date: transactionDate}) =>
        moment(transactionDate, 'DD.MM.YYYY').isSame(date, 'month'),
            );

        const dailyMoney =
            currentMonthTransactions.reduce((acc, transaction) => {
            return transaction.sum > 0 ? transaction.sum + acc : acc;
        }, 0) / moment(date).daysInMonth();

        const transactionsBeforeThisDayAndInThisDay = currentMonthTransactions.filter(
            ({date: transactionDate}) =>
        moment(transactionDate, 'DD.MM.YYYY').isBefore(date, 'date',) ||
        moment(transactionDate, 'DD.MM.YYYY').isSame(date, 'date'),
            );

        const expanseBeforeToday = transactionsBeforeThisDayAndInThisDay.reduce(
            (acc, {sum}) => (sum < 0 ? acc + sum : acc),
            0,
            );

const incomeBeforeToday = date.date() * dailyMoney;

console.log({dailyMoney, expanseBeforeToday, incomeBeforeToday});

    return incomeBeforeToday + expanseBeforeToday;
    };

    render() {
        const {date, navSelected, transactions} = this.state;
        return (
            <section>
                <header>
                    <h1>React Budget</h1>
                    <div>
                        <div className="DateLine">
                            <p>{date.format('DD.MM.YYYY')}</p>

                            <button onClick={this.handleSubtractDay} className="btnCounter">-</button>
                            <button onClick={this.handleAddDay} className="btnCounter">+</button>
                        </div>
                    </div>

                    <p>for today: {this.onToday()} UAH;</p>

                </header>
                <main>
                    <nav className="navMenu">
                  <Link
                      className="navLink"
                      name="expanse"
                      onClick={this.handleNavClick}
                      selected={navSelected === 'expanse'}
                  >
                      Expenses today
                  </Link>
                        <Link
                            className="navLink"
                            name="incomes"
                            onClick={this.handleNavClick}
                            selected={navSelected === 'incomes'}
                        >
                      Incomes
                  </Link>

                    </nav>
                    {navSelected === 'expanse' ? ( <Expanse onSubmit={this.handleSubmitTransaction}/>
                    ) : ( <Incomes onSubmit={this.handleSubmitTransaction}/>
                    )}

                    <table>
                        <tbody>
                            {transactions
                                .filter(({date: transactionDate}) => moment(transactionDate, 'DD.MM.YYYY').isSame(date, 'month'))
                                .map(({date, sum, category}, index) => (
                                    <tr key={index}>
                                        <td>{date}</td>
                                        <td>{sum}</td>
                                        <td>{category}</td>
                                    </tr>

                                    ))}
                        </tbody>
                    </table>

                </main>
            </section>
        );
    }
}

export default App;
