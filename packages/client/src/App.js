import React, { useState, useEffect, useRef } from "react";
import { ThemeProvider } from "styled-components";
import { useDispatch, useSelector } from "react-redux";
// import { fetchWeatherData } from "./store/weather/action";
import { GlobalStyle } from "./globalStyles";
import { SearchCityContext } from "./context/SearchCity";
import { themes } from "./context/Theme";
import { CityNameContext } from "./context/CityName";
import { AuthContext } from "./context/Auth";
import Navbar from "./components/Navbar";
import SideMenu from "./components/SideMenu";
import RouterPages from "./router";
import { lightTheme, darkTheme } from "./themes";
import { sideMenuHidding, sideMenuShowing } from "./utils/sideMenu";
import { getCookie } from "./utils/cookies";
import { useAuth } from "./hooks/useAuth";
import { fetchWeather } from "./store/weather/reducer";

const App = () => {
  const [cityName, setCityName] = useState("Tbilisi");
  const [searchValue, setSearchValue] = useState("");
  const [isMenuHidden, setIsMenuHidden] = useState(true);

  const { theme } = useSelector((state) => state.theme);

  const {
    weather: weatherData,
    loading,
    coordinates,
    error,
  } = useSelector((state) => state.weather);

  const {
    isAuth,
    setIsAuth,
    login,
    loginLoading,
    logout,
    loginError,
    clearErrors,
  } = useAuth();
  const dispatch = useDispatch();
  let hiddingContent = useRef();

  useEffect(() => {
    // dispatch(fetchWeatherData(coordinates));
    dispatch(fetchWeather(coordinates));
    const weatherInterval = setInterval(() => {
      dispatch(fetchWeather(coordinates));
    }, 3600 * 1000);

    const token = getCookie("authToken");
    setIsAuth(!!token);
    return () => {
      clearInterval(weatherInterval);
    };
  }, [dispatch, setIsAuth, coordinates]);

  const handleSearchClick = (cityName, inputElement) => {
    // dispatch(fetchWeatherData({ lat, lon }));
    // dispatch(fetchWeather(coordinates));
    setCityName(cityName);
    inputElement.current.blur();
  };

  return (
    <ThemeProvider theme={theme === themes.LIGHT ? lightTheme : darkTheme}>
      <GlobalStyle isMenuHidden={isMenuHidden} />
      <AuthContext.Provider
        value={{
          isAuth,
          login,
          logout,
          loginLoading,
          loginError,
          clearErrors,
        }}
      >
        <SearchCityContext.Provider value={searchValue}>
          <Navbar
            isMenuHidden={isMenuHidden}
            setIsMenuHidden={setIsMenuHidden}
            setSearchValue={setSearchValue}
            handleSearchClick={handleSearchClick}
            sideMenuHidding={() => sideMenuHidding(hiddingContent)}
            sideMenuShowing={() => sideMenuShowing(hiddingContent)}
          />
          <div className="app-wrapper">
            <SideMenu
              isMenuHidden={isMenuHidden}
              setIsMenuHidden={setIsMenuHidden}
              setSearchValue={setSearchValue}
              handleSearchClick={handleSearchClick}
              hiddingContent={hiddingContent}
              sideMenuHidding={() => sideMenuHidding(hiddingContent)}
            />
            <CityNameContext.Provider value={cityName}>
              <div className="container">
                {error && (
                  <div
                    className="alert alert-danger"
                    role="alert"
                    style={{ marginTop: 25 }}
                  >
                    {error}
                  </div>
                )}
                <RouterPages weatherData={weatherData} isLoading={loading} />
              </div>
            </CityNameContext.Provider>
          </div>
        </SearchCityContext.Provider>
      </AuthContext.Provider>
    </ThemeProvider>
  );
};

export default App;
