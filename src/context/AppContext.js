import React, { createContext, useReducer } from 'react';
 
// 5. The reducer - this is used to update the state, based on the action
export const AppReducer = (state, action) => {
    let budget = 0;
    switch (action.type) {
        case 'ADD_EXPENSE':
            let total_budget = 0;
            total_budget = state.expenses.reduce(
                (previousExp, currentExp) => {
                    return previousExp + currentExp.cost
                },0
            );
            total_budget = total_budget + action.payload.cost;
            action.type = "DONE";
            if(total_budget <= state.budget) {
                total_budget = 0;
                state.expenses.map((currentExp)=> {
                    if(currentExp.name === action.payload.name) {
                        currentExp.cost = action.payload.cost + currentExp.cost;
                    }
                    return currentExp
                });
                return {
                    ...state,
                };
            } else {
                alert("Cannot increase the allocation! Out of funds");
                return {
                    ...state
                }
            }
            case 'RED_EXPENSE':
                const red_expenses = state.expenses.map((currentExp)=> {
                    if (currentExp.name === action.payload.name && currentExp.cost - action.payload.cost >= 0) {
                        currentExp.cost =  currentExp.cost - action.payload.cost;
                        budget = state.budget + action.payload.cost
                    }
                    return currentExp
                })
                action.type = "DONE";
                return {
                    ...state,
                    expenses: [...red_expenses],
                };
            case 'DELETE_EXPENSE':
            action.type = "DONE";
            state.expenses.map((currentExp)=> {
                if (currentExp.name === action.payload) {
                    budget = state.budget + currentExp.cost
                    currentExp.cost =  0;
                }
                return currentExp
            })
            action.type = "DONE";
            return {
                ...state,
                budget
            };
        case 'SET_BUDGET':
            action.type = "DONE";
            state.budget = action.payload;

            return {
                ...state,
            };
        case 'CHG_CURRENCY':
            action.type = "DONE";
            state.currency = action.payload;
            return {
                ...state
            }

        default:
            return state;
    }
};

export function objectsAreSame(x, y) {
   var objectsAreSame = true;
   for(var propertyName in x) {
      if(x[propertyName] !== y[propertyName]) {
         objectsAreSame = false;
         break;
      }
   }
   return objectsAreSame;
}
   
export var initialState = () => {
    var is = {budget: 2000,
    expenses: [
        { id: "Marketing", name: 'Marketing', cost: 50 },
        { id: "Finance", name: 'Finance', cost: 300 },
        { id: "Sales", name: 'Sales', cost: 70 },
        { id: "HR", name: 'HR', cost: 40 },
        { id: "IT", name: 'IT', cost: 500 },
        { id: "Admin", name: 'Admin', cost: 400 }
    ],
    currency: '£'};

	var localBudget = JSON.parse(localStorage.getItem("budget"));
    var localExpenses = JSON.parse(localStorage.getItem("expenses"));
	var localCurrency = JSON.parse(localStorage.getItem("currency"));

	if(localBudget !== is.budget && localBudget) is.budget = localBudget;
	if(!objectsAreSame(localExpenses, is.expenses) && localExpenses.length !== 0) is.expenses = localExpenses;
	if(localCurrency !== is.currency && localCurrency) is.currency = localCurrency;
	return is;
};

// 2. Creates the context this is the thing our components import and use to get the state
export const AppContext = createContext();

// 3. Provider component - wraps the components we want to give access to the state
// Accepts the children, which are the nested(wrapped) components
export const AppProvider = (props) => {
	// 4. Sets up the app state. takes a reducer, and an initial state
    const [state, dispatch] = useReducer(AppReducer, initialState());
	// const forceUpdate = React.useCallback(() => dispatch({}), []);
    let remaining = 0;

    if (state.expenses) {
            const totalExpenses = state.expenses.reduce((total, item) => {
            return (total = total + item.cost);
        }, 0);
        remaining = state.budget - totalExpenses;
    }
	
	React.useEffect(() => {
		const json = JSON.stringify(state.budget);
		const json1 = JSON.stringify(state.currency);
		if(json !== initialState().budget.toString()){
			localStorage.setItem("budget", json);
			//console.log(json);
		}
		if(json1 !== initialState().currency.toString()){
			localStorage.setItem("currency", json1)
			//console.log(json1);
		}
	}, [state.budget, state.currency]);
	const marketing = state.expenses[0].cost;
	const finance = state.expenses[1].cost;
	const sales = state.expenses[2].cost;
	const hr = state.expenses[3].cost;
	const it = state.expenses[4].cost;
	const admin = state.expenses[5].cost;
	React.useEffect(() => {
		const json0 = JSON.stringify(state.expenses[0].cost);
		const json1 = JSON.stringify(state.expenses[1].cost);
		const json2 = JSON.stringify(state.expenses[2].cost);
		const json3 = JSON.stringify(state.expenses[3].cost);
		const json4 = JSON.stringify(state.expenses[4].cost);
		const json5 = JSON.stringify(state.expenses[5].cost);
		const json6 = JSON.stringify(state.expenses);
		if(json0 !== initialState().expenses[0].cost.toString()){
			//console.log(json6);
			localStorage.setItem("expenses", json6);
		}
		if(json1 !== initialState().expenses[1].cost.toString()){
			//console.log(json6);
			localStorage.setItem("expenses", json6);
		}
		if(json2 !== initialState().expenses[2].cost.toString()){
			//console.log(json6);
			localStorage.setItem("expenses", json6);
		}
		if(json3 !== initialState().expenses[3].cost.toString()){
			//console.log(json6);
			localStorage.setItem("expenses", json6);
		}
		if(json4 !== initialState().expenses[4].cost.toString()){
			//console.log(json6);
			localStorage.setItem("expenses", json6);
		}
		if(json5 !== initialState().expenses[5].cost.toString()){
			//console.log(json6);
			localStorage.setItem("expenses", json6);
		}
	}, [marketing, finance, sales, hr, it, admin,  state.expenses]);
	
    return (
        <AppContext.Provider
            value={{
                expenses: state.expenses,
                budget: state.budget,
                remaining: remaining,
                dispatch,
                currency: state.currency
            }}
        >
            {props.children}
        </AppContext.Provider>
    );
};
