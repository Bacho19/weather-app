import React, { useContext, useRef } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { SearchCityContext } from "../../context/SearchCity";
import { GoSearch } from "react-icons/go";
import { SearchbarForm, SearchbarInput } from "./styled";
import { useDispatch } from "react-redux";
import { changeCoordinates } from "../../store/weather/reducer";

const Searchbar = ({ setSearchValue, handleSearchClick }) => {
  const searchCityValue = useContext(SearchCityContext);

  const inputElement = useRef();

  const dispatch = useDispatch();

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {
      if (searchCityValue) {
        const { data: cityCoordinates } = await axios(
          `http://api.openweathermap.org/geo/1.0/direct?q=${searchCityValue}&limit=1&appid=${process.env.REACT_APP_WEATHER_API_ID}`
        );
        dispatch(
          changeCoordinates({
            lat: cityCoordinates[0].lat,
            lon: cityCoordinates[0].lon,
          })
        );
        handleSearchClick(cityCoordinates[0].name, inputElement);
        setSearchValue("");
      }
    } catch (e) {
      console.error(e.message);
    }
  };

  return (
    <SearchbarForm onSubmit={handleSubmitForm}>
      <SearchbarInput
        type="text"
        placeholder="Enter the city"
        ref={inputElement}
        value={searchCityValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <GoSearch style={{ color: "#555" }} />
    </SearchbarForm>
  );
};

Searchbar.propTypes = {
  setSearchValue: PropTypes.func,
  handleSearchClick: PropTypes.func,
};

export default Searchbar;
