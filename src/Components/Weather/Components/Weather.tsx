import React, { useEffect, useRef, useState } from 'react';
import WeatherAPI from '../API/WeatherAPI';
import '../weather.css';
import WeatherNav from './WeatherNav';
import TodayView from './TodayView';
import HourlyView from './HourlyView';
import DailyView from './DailyView';

import { formatLocation } from '../Helpers/StringUtils';
import { AllWeather, GeoDataTransfer,  } from '../Helpers/Types';
//import { ViewProps, WeatherStateTypes } from '../Helpers/Types';

/* High-Order Component since the views are similar */
// function withWeatherData(WrappedComponent, weatherData) {
//     return class extends React.Component<ViewProps , {}> {
//         render() {
//             return <WrappedComponent weatherData={weatherData} {...this.props} />
//         }
//     }
// }

function Weather(props) {
    const [loading, loadingSet] = useState<boolean>(true);
    const [location, locationSet] = useState<GeoDataTransfer | undefined>(undefined);
    const [weatherData, weatherDataSet] = useState<AllWeather | undefined>(undefined);
    const [currentView, currentViewSet] = useState<string>("todayView");
    const [viewComponent, viewComponentSet] = useState<Array<React.ReactElement>>([]);
    const memoRequestCount = useRef(0);

    useEffect( () => {
        loadingSet(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                const locObject: GeoDataTransfer = {
                    location: '',
                    zip: '',
                    geoData : {
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                        name:'',
                        state:'',
                        country: ''
                    }
                };

                locationSet(locObject);
                loadingSet(false);
            });
        } else {
            console.log("Geolocation not available.");
        }
    }, []);

    useEffect(() => { 
            loadingSet(true);

            async function getWeatherData() {
                memoRequestCount.current += 1;

                if (location) {
                    const weather: AllWeather = await WeatherAPI.getAllWeather(location);
                    
                    if (weather !== null) {
                        weatherDataSet(weather);
                    }   

                    loadingSet(false);
                }
            };

            if (!(memoRequestCount.current > 10)) {
                getWeatherData();
            } else {
                console.log("ran 10 times");
            }
            
    }, [location]);

    useEffect(() => {
        let element: Array<React.ReactElement>;
        
        switch(currentView) {
            case 'hourlyView': element = [<HourlyView key={1} location={location} weatherData={weatherData}/>];
                break;
            case 'dailyView': element = [<DailyView key={1} location={location} weatherData={weatherData}/>];
                break;
            default: element = [
                <TodayView key={1} location={location} weatherData={weatherData}/>,
                <DailyView key={2} location={location} weatherData={weatherData}/>,
                <HourlyView key={3} location={location} weatherData={weatherData}/>
            ];
        }
        viewComponentSet(element);
    }, [location, weatherData, currentView]);
    
    const handleSearchClick = (location: string) => {
        let formattedLocation: string, locObject: GeoDataTransfer;
        let zipPattern = new RegExp(/(^\d{5}$)|(^\d{5}-\d{4}$)/);

        if (location !== '') {
            formattedLocation = zipPattern.test(location) ? '' : formatLocation(location);

            locObject = {
                location: formattedLocation,
                geoData: {
                    lat: undefined,
                    lon: undefined,
                    name:'',
                    state:'',
                    country: ''
                },
                zip: zipPattern.test(location) ? location : ''
            };       
            
            locationSet(locObject);   
        }        
    }

    const handleViewChange = (event) => {
        let btnId = event.target.id;

        let currentView = btnId === 'hourly'
        ? 'hourlyView' : btnId === 'daily'
        ? 'dailyView' : btnId === 'maps'
        ? 'mapsView' : 'todayView';

        currentViewSet(currentView);
    }

    let options: Intl.DateTimeFormatOptions = { 
        month: 'short', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric',
        hour12: true,           
    };

    let date = new Intl.DateTimeFormat('en-US', options).format(new Date());
    // let dailyComponent = null;
    // let hourlyComponent = null;

    if (weatherData !== undefined) {
        options.timeZone = weatherData.timezone;
        date = new Intl.DateTimeFormat('en-US', options).format(new Date(weatherData.current.dt * 1000));
        // dailyComponent = <DailyView location={this.state.location.location} weatherData={this.state.weatherData}/>
        // hourlyComponent = <HourlyView location={this.state.location.location} weatherData={this.state.weatherData}/>
    }

    return (
        <div id="weatherApp">
            <WeatherNav onViewChange={handleViewChange} onSearchClick={handleSearchClick} />
            <main className='viewContainer'>
                { loading
                ?   <main className='viewContainer'>
                        <h3>Loading...</h3>
                    </main>
                : <main className='viewContainer'>
                    <h2 className="location">{ location.location }</h2>
                    <h3 id="time">{date}</h3>
                    { viewComponent }
                  </main>
                }
            </main>
        </div>
    );
}

/*
class Weather extends React.Component<{}, WeatherStateTypes> {
    viewComponent: React.ReactElement;

    constructor(props: Object) {
        super(props);

        let loc: GeoDataTransfer = {
            location: '',
            zip: '',
            geoData : {
                lat: undefined,
                lon: undefined,
                name:'',
                state:'',
                country: ''
            }
        };

        this.state = {
            location: loc,
            weatherData: null,
            currentView: 'todayView'
        }

        this.viewComponent = <TodayView location={loc.location} weatherData={null} />;

        
        this.handleViewChange = this.handleViewChange.bind(this);
        this.handleSearchClick = this.handleSearchClick.bind(this);
    }

    async getWeatherData(location: GeoDataTransfer) {
        let weatherData: AllWeather = await WeatherAPI.getAllWeather(location);
        if (weatherData !== null) {
            this.setState({ location, weatherData });

            this.viewComponent = this.selectView(this.state.currentView, location.location, weatherData);
                
            this.forceUpdate();
        }      
    }

    componentDidMount() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                let locObject: GeoDataTransfer = {
                    location: '',
                    zip: '',
                    geoData : {
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                        name:'',
                        state:'',
                        country: ''
                    }
                };

                this.getWeatherData(locObject);
            });
      
        } else {
      
            console.log("Geolocation not available.");
      
          }
        
    }

    selectView(view: string, location: string, weatherData: AllWeather): React.ReactElement {
        let element: React.ReactElement;

        switch(view) {
            case 'hourlyView': element = <HourlyView location={location} weatherData={weatherData}/>;
                break;
            case 'dailyView': element = <DailyView location={location} weatherData={weatherData}/>;
                break;
            default: element = <div>
                <TodayView location={location} weatherData={weatherData}/>
                <DailyView location={location} weatherData={weatherData}/>
                <HourlyView location={location} weatherData={weatherData}/>
            </div>;
        }

        return element;
    }

    handleSearchClick(location: string) {
        let formattedLocation: string, locObject: GeoDataTransfer;
        let zipPattern = new RegExp(/(^\d{5}$)|(^\d{5}-\d{4}$)/);

        if (location !== '') {
            formattedLocation = zipPattern.test(location) ? '' : formatLocation(location);

            locObject = {
                location: formattedLocation,
                geoData: {
                    lat: undefined,
                    lon: undefined,
                    name:'',
                    state:'',
                    country: ''
                },
                zip: zipPattern.test(location) ? location : ''
            };       
            
            
            this.setState({
                location: locObject            
            });
    
            this.getWeatherData(locObject);
        }        
    }

    handleViewChange(event) {
        let btnId = event.target.id;

        let currentView = btnId === 'hourly' ? 'hourlyView' : btnId === 'daily' ? 'dailyView' : btnId === 'maps' ? 'mapsView' : 'todayView';

        this.viewComponent = this.selectView(currentView, this.state.location.location, this.state.weatherData);
        this.setState({ currentView });
    }

    render() { 
        let options: Intl.DateTimeFormatOptions = { 
            month: 'short', day: 'numeric',
            hour: 'numeric', minute: 'numeric', second: 'numeric',
            hour12: true,           
        };

        let date = new Intl.DateTimeFormat('en-US', options).format(new Date());
        // let dailyComponent = null;
        // let hourlyComponent = null;

        if (this.state.weatherData !== null) {
            options.timeZone = this.state.weatherData.timezone;
            date = new Intl.DateTimeFormat('en-US', options).format(new Date(this.state.weatherData.current.dt * 1000));
            // dailyComponent = <DailyView location={this.state.location.location} weatherData={this.state.weatherData}/>
            // hourlyComponent = <HourlyView location={this.state.location.location} weatherData={this.state.weatherData}/>
        }

        return (
            <div id="weatherApp">
                <WeatherNav onViewChange={this.handleViewChange} onSearchClick={this.handleSearchClick} />
                <main className='viewContainer'>
                    <h2 className="location">{ this.state.location.location }</h2>
                    <h3 id="time">{date}</h3>
                    {this.viewComponent}
                </main>
            </div>
        );
    };
}
*/

export default Weather;