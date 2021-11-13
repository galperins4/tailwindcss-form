import React from 'react';
import axios from 'axios';
import { useForm, FormProvider } from 'react-hook-form';
import FeatherLogo from './img/feather.png';
import ArkmoonLogo from './img/arkmoon.png';
import HillsImg from './img/hills.svg';
import AstroMan from './img/astroman.jpg';
import ArkLogo from './img/ark-logo.png';
import Form from './components/form/Form';
import Report from './components/report/Report';
import Alert from './components/alert/Alert';

export default function App() {
  function handleOnSubmit(data) {
    // Start loading.
    setIsLoading(true);

    const {
      addresses = [],
      exceptions = [],
    } = data;

    // Environment Variables.
    const network = import.meta.env.VITE_NETWORK;
    const submissionUrl = import.meta.env.VITE_SUBMIT_URL;

    axios.post(`${submissionUrl}`, {
      addresses: addresses?.filter(({value}) => value).map(({value}) => value),
      exceptions: exceptions?.filter(({value}) => value).map(({value}) => value),
      network,
    }).then((response) => {
      if (
        response?.status === 200
        && response?.data
        && !response?.data?.Error
      ) {
        // Clear the error if any.
        setError(null);

        // Stop loading.
        setIsLoading(false);

        // Display the results.
        setResults(response?.data);
      } else {
        setError(
          <div className="container mx-auto">
            <Alert />
          </div>
        );
        setResults(null);
      }
      // setResults(response);
    }).catch((e) => {
      console.error(e);
      setError(
        <div className="container mx-auto">
          <Alert />
        </div>
      );
      setResults(null);
    });
  }

  // Local state for results.
  const [results, setResults] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState();

  const methods = useForm();

  return (
    <div>
      <div id="top-menu" className="-top-full shadow-md w-full fixed transition-all duration-500 z-50" style={{ backgroundColor: '#1d0d23'}}>
        <div className="container mx-auto h-20 md:h-24">
          <div className="w-full flex items-center justify-between">
            <a className="flex items-center justify-between hover:text-underline text-center h-auto p-2 md:p-4" href="/">
              <img className="h-16 w-auto" src={ArkLogo} alt="ARK Ecosystem logo" />
              <h1 className="text-white text-xl ml-4" id="nav-title">ARK Income Estimator</h1>
            </a>
            <div className="flex w-1/2 justify-end content-center">
              <a className="inline-block hover:text-underline text-center h-auto p-2 md:p-4 transform hover:scale-125 duration-300 ease-in-out" href="https://arkdelegates.live/delegate/goose/contributions">
                <img className="h-16 w-auto" src={FeatherLogo} alt="Delegate Goose logo" />
              </a>
              <a className="inline-block hover:text-underline text-center h-auto p-2 md:p-4 transform hover:scale-125 duration-300 ease-in-out" href="https://www.arkmoon.com">
                <img className="h-16 w-auto" src={ArkmoonLogo} alt="Delegate Arkmoon logo" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <section className="pt-20 relative" style={{backgroundColor: '#1d0d23'}}>
        <div className="container px-3 mx-auto flex flex-wrap flex-col md:flex-row items-center text-white">
          <div className="flex flex-col w-full md:w-1/2 justify-center items-start text-center md:text-left">
            <h1 className="my-4 text-5xl font-bold leading-tight">
              ARK Income Estimator
            </h1>
            <p className="leading-normal text-2xl mb-8">
              Figuring out how much you owe in crypto taxes is tedious. Let us help by calculating how much income you&rsquo;ve earned from ARK staking rewards.
            </p>
            <button className="mx-auto lg:mx-0 hover:underline bg-white text-gray-800 font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out">
              Get Started
            </button>
          </div>
          <div className="w-full md:w-1/2 justify-center max-h-screen">
            <img className="w-auto max-h-screen mx-auto" src={AstroMan} />
          </div>
        </div>
        <img className="absolute bottom-0 w-full h-auto" src={HillsImg} alt="hills" />
      </section>

      <FormProvider {...methods}>
        <Form handleOnSubmit={handleOnSubmit} />
      </FormProvider>

      {
        isLoading
      }

      {
        error
      }

      {
        results
          ? (
            <section className="bg-white w-full">
              <div className="container mx-auto">
                <Report results={results} />
              </div>
            </section>
          )
          : null
      }

      <footer className="text-center py-12">
        <p><sup>*</sup>This software does not constitute formal tax advice. For educational purposes only.</p>
        <p>&copy; 2021 Delegate Goose and Delegate ArkMoon</p>
      </footer>
    </div>
  );
}