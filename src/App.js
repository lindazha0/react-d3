import logo from './assets/logo.svg';
import vButton from './assets/voice_button.svg';
import dButton from './assets/db_button.svg';
import './App.css';
// the components
import InputPanel from './components/Input';
import Income from './components/Income';
import IncomeLog from './components/IncomeLog';
import Expense from './components/Expense';
import ExpenseLog from './components/ExpenseLog';

function App() {
  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo"/>
      <InputPanel />
      <Income />
      <IncomeLog />
      <Expense />
      <ExpenseLog />
      <img src={vButton} className="V-button" alt="voice"/>
      <img src={dButton} className="D-button" alt="database"/>
    </div>
  );
}

export default App;
