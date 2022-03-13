/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
import axios from "axios";

const API_URL = "https://restcountries.com/v2/regionalbloc/";

const getCountryList = (region) => {
  return axios.get(API_URL+ region + '?fields=name,translations,region,regionalBlocs,area,flag,latlng,capital');
};

export default  {
    getCountryList
};