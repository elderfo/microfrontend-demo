import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';

// render micro frontend function
window.renderSiteOne = (containerId: string) => {
  ReactDOM.render(<App />, document.getElementById(containerId));
};

// unmount micro frontend function
window.unmountSiteOne = (containerId: string) => {
  const element = document.getElementById(containerId);

  if (element) {
    ReactDOM.unmountComponentAtNode(element);
  }
};

// Mount to root if it is not a micro frontend
if (!document.getElementById('SiteOne-container')) {
  ReactDOM.render(<App />, document.getElementById('root'));
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
