import './App.css';
import '@fontsource/roboto';
import SearchAppBar from './components/AppBar';
import MediaCard from './components/Card';
import brazilianBusiness from './db/brazilianBusiness'


function App() {
  return (
    <div className="App">
      <SearchAppBar/>
      {
        brazilianBusiness.map((business, index) => (
          <MediaCard
            business={business}
            key={index}
          />
        ))
      }
    </div>
  );
}

export default App;
