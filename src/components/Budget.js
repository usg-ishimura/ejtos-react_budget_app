import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
const Budget = () => {
    const { budget, dispatch } = useContext(AppContext);
    const { expenses, currency } = useContext(AppContext);
    const totalExpenses = expenses.reduce((total, item) => {
        return (total += item.cost);
    }, 0);
    return (
        <div className='alert alert-secondary'>
            <span>Budget: <br></br>{currency}<input
        type='number'
        onKeyPress={(event) => {
            if (!/[0-9]/.test(event.key)) {
              event.preventDefault();
            }
          }}
        id='budget'
        step="10"
        defaultValue={budget}
        style={{ marginLeft: '0rem' , size: 10}}
            onChange={(event) => {
                if(event.target.value > 20000) {
                    alert(`Budget can not exceed ${currency}20000`);
                    event.target.value = 20000;
                }
                if(event.target.value < totalExpenses){
                    alert("You cannot reduce the budget value lower than the spending");
                    event.target.value = totalExpenses;
                }
                dispatch({type: 'SET_BUDGET', payload: event.target.value});
            }
        }>
        </input></span>
        </div>
        
    );
};
export default Budget;
