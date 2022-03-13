import React, { useState, useEffect } from "react";
import './App.css';
import Country from "./services/rest-country";
import { languageList } from "./utils/language";
import { regionBloc } from "./utils/region";
import localforage from "localforage";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import BeatLoader from "react-spinners/BeatLoader";
import { css } from '@emotion/react'
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemText from '@mui/material/ListItemText';
import { maptiler } from 'pigeon-maps/providers';
import { Map, Marker,Overlay } from "pigeon-maps"

function App() {
  const [loading, setLoading] = useState('true');
  const [countryList, setCountryList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState({});
  const [language, setLanguage] = useState(languageList[0].value);
  const [region, setRegion] = useState(regionBloc[0].value);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoom] = useState(9);

  const override = css`
  display: block;
  margin: 0 auto;
  border-color: white;
  margin-top: 50px;
  `;

  const maptilerProvider = maptiler('NIJgzqrv4ixpAFVPOVu1', 'streets')

  const getCountry = (region) => {
    Country.getCountryList(region)
      .then(response => {
        setLocalStorage(response.data, region);
        setCountryList(response.data);
        setCountryValue(response.data[0])
      })
      .catch(e => {
        console.log(e);
      });
  };


  const checkLocalStorage = (region) => {
    localforage.getItem(region).then(function (value) {
      if (value == null) {
        getCountry(region);
      } else {
        setCountryList(value);
        setCountryValue(value[0])
      }
    }).catch(function (err) {
      console.log(err);
    });
  };

  const setCountryValue = (value) => {
    let updatedValue = {};
    updatedValue = value;
    setSelectedCountry(selectedCountry => ({
      ...selectedCountry,
      ...updatedValue
    }))
    setLoading('false');
  };

  const setLocalStorage = (value, region) => {
    localforage.setItem(region, value);
  };

  const handleChangeRegion = (event) => {
    setLoading('true');
    setRegion(event.target.value);
    checkLocalStorage(event.target.value)
  };

  const handleChangeLanguage = (event) => {
    setLanguage(event.target.value);
  };

  const handleChangeCountry = (event, index) => {
    setLoading('true');
    setSelectedIndex(index);
    setCountryValue(countryList[index]);
  };

  const itemHeight = 48;
  const itemPaddingTop = 8;

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: itemHeight * 4.5 + itemPaddingTop,
        width: 250,
      },
    },
  };

  useEffect(() => {
    checkLocalStorage(region);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <div className="App-header">
        <Row className="d-flex justify-content-between w-100">
          <Col md={3}>
            <FormControl sx={{ m: 1, width: 400 }}>
              <InputLabel id="region-label">Regions</InputLabel>
              <Select
                labelId="region-label"
                id="region-name"
                value={region}
                onChange={handleChangeRegion}
                input={<OutlinedInput label="Region" />}
                MenuProps={MenuProps}
              >
                {regionBloc.map((name) => (
                  <MenuItem
                    key={name.value}
                    value={name.value}
                  >
                    {name.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, width: 400 }}>
              <InputLabel id="language-label">Languages</InputLabel>
              <Select
                labelId="language-label"
                id="language"
                value={language}
                onChange={handleChangeLanguage}
                input={<OutlinedInput label="Language" />}
                MenuProps={MenuProps}
              >
                {languageList.map((name) => (
                  <MenuItem
                    key={name.value}
                    value={name.value}
                  >
                    {name.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {loading === 'false' ? (
              <FormControl sx={{ m: 1, width: 400 }} className='lsting-block'>
                <List component="nav" subheader={<ListSubheader className="d-flex justify-content-start">Countries</ListSubheader>}>
                  {countryList.map((data, index) => (
                    <ListItemButton
                      selected={selectedIndex === index}
                      key={index}
                      onClick={(event) => handleChangeCountry(event, index)}
                    >
                      {language === 'en' ? (
                        <ListItemText primary={data.name} />
                      ) : <ListItemText primary={data.translations[language]} />}
                    </ListItemButton>
                  ))}
                </List>
              </FormControl>
            ) : <BeatLoader css={override} size={20} loading={loading} color={"#000"} speedMultiplier={1.5} />}
          </Col>
          <Col lg={4} md={12} className="d-flex justify-content-flex-start">
            {selectedCountry.latlng ? (
              <Map height={450} center={selectedCountry.latlng} zoom={zoom} provider={maptilerProvider} dprs={[1, 2]}  >
                <Marker width={50} anchor={selectedCountry.latlng} color="#fff" />
                <Overlay anchor={selectedCountry.latlng} offset={[9, 54]} >
                  {language === 'en' ? (
                        <p className="text-black">{selectedCountry.name.charAt(0)}</p>
                      ) : <p className="text-black">{selectedCountry.translations[language].charAt(0)}</p> }
                </Overlay>
              </Map>
            ) : <BeatLoader css={override} size={20} loading={loading} color={"#000"} speedMultiplier={1.5} />}
          </Col>
          <Col lg={4} md={12} className="mb-4" >
            <div className="text-details">
              <Row className="d-flex justify-content-start w-100">
                <Col md={10}>
                  {language === 'en' ? (
                        <p>{selectedCountry.name}</p>
                      ) : <p>{selectedCountry.translations[language]}</p> }
                </Col>
                <Col md={1}>
                  <img src={selectedCountry.flag} alt="flag" width="75" height="50" />
                </Col>
              </Row>
              <Row className="d-flex justify-content-start w-100">
                <Col md={3} sm="auto">
                  <p>Capital:</p>
                </Col>
                <Col md={9} sm="auto">
                  <p>{selectedCountry.capital}</p>
                </Col>
              </Row>
              <Row className="d-flex justify-content-start w-100">
                <Col md={3} sm="auto">
                  <p>Area:</p>
                </Col>
                <Col md={9} sm="auto">
                  <p>{selectedCountry.area}</p>
                </Col>
              </Row>
              <Row className="d-flex justify-content-start w-100">
                <Col md={3} sm="auto">
                  <p>Region:</p>
                </Col>
                <Col md={9} sm="auto">
                  <p>{selectedCountry.region}</p>
                </Col>
              </Row>
              <Row className="d-flex justify-content-start w-100">
                <Col md={5} sm="auto">
                  <p>Regional Blocs:</p>
                </Col>
                <Col md={7} sm="auto">
                  {selectedCountry.regionalBlocs?.map((data, index) => (
                    <p key={index}>{data.name}</p>
                  ))}
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default App;