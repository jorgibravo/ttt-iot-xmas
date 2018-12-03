import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { DepthOfFieldSnowfall } from 'react-snowflakes';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import NativeSelect from '@material-ui/core/NativeSelect';
import Divider from '@material-ui/core/Divider';
import Input from '@material-ui/core/Input';
import axios from 'axios';
import 'typeface-roboto';
import './App.scss';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ledSpeed: 200,
      animationName: 'off',
    };
  }
  //

  componentWillMount() {
    axios.get('/lights/status').then(res => {
      if (res.data !== undefined && res.data.ledSpeed !== undefined) {
        this.setState({
          animationName: res.data.animationName,
          ledSpeed: res.data.ledSpeed,
        });
      }
    });
  }
  //

  handleChange = name => event => {
    //
    const urlType = name === 'animationName' ? 'mode' : 'speed';
    axios.get(`/lights/${urlType}/${event.target.value}`);
    //
    this.setState({ [name]: event.target.value });
  };

  //
  render() {
    const { animationName, ledSpeed } = this.state;
    return (
      <div className="App">
        <AppBar className="ttt-header" position="static">
          <Toolbar>
            <Typography className="ttt-title" variant="h6">
              Black Swan Budapest - TTT Xmas IOT LED Lights
            </Typography>
          </Toolbar>
        </AppBar>
        <div className="body-container">
          <DepthOfFieldSnowfall
            count={50}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
            }}
          />
          <div className="ttt-formContainer">
            <Card className="ttt-card">
              <CardContent className="ttt-cardContent">
                <FormControl className="ttt-selectContainer">
                  <InputLabel htmlFor="age-native-simple">Animation</InputLabel>
                  <NativeSelect
                    value={animationName}
                    onChange={this.handleChange('animationName')}
                    input={<Input name="animationName" id="animationName-native-helper" />}
                  >
                    <option value="off">off</option>
                    <option value="chase">chase</option>
                    <option value="rainbow">rainbow</option>
                    <option value="scanner">scanner</option>
                    <option value="red">red</option>
                    <option value="green">green</option>
                  </NativeSelect>
                </FormControl>
              </CardContent>
            </Card>
            <Divider className="ttt-divider" />
            <Card className="ttt-card">
              <CardContent className="ttt-cardContent">
                <FormControl className="ttt-selectContainer">
                  <InputLabel htmlFor="age-native-simple">Speed</InputLabel>
                  <NativeSelect
                    value={ledSpeed}
                    onChange={this.handleChange('ledSpeed')}
                    input={<Input name="ledSpeed" id="ledSpeed-native-helper" />}
                  >
                    <option value="50">50</option>
                    <option value="100">100</option>
                    <option value="300">300</option>
                    <option value="500">500</option>
                    <option value="750">750</option>
                    <option value="999">999</option>
                  </NativeSelect>
                </FormControl>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
