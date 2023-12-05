import React, { useState, useEffect } from 'react';
import { Alert, Container, Grid, Typography, FormControlLabel, Checkbox, TextField, Box, Button, useTheme, useMediaQuery, List, ListItem, ListItemText, ListItemIcon,} from '@mui/material';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import HotelIcon from '@mui/icons-material/Hotel';
import AcUnitOutlinedIconfrom from '@mui/icons-material/AcUnitOutlined';
import ThunderstormOutlinedIcon  from '@mui/icons-material/ThunderstormOutlined'; 
import CloudOutlinedIcon  from '@mui/icons-material/CloudOutlined';
import WbSunnyOutlinedIcon  from '@mui/icons-material/WbSunnyOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { purple } from '@mui/material/colors';
import format from "date-fns/format";

function App() {

  const theme = createTheme({
    palette: {
      primary: {
        main: purple[500],
        light: purple[300],
        dark: purple[700],
        contrastText: '#fff',
      },
    },
  });
  const matchesXS = useMediaQuery(theme.breakpoints.down('sm'));

  const [currentPage, setCurrentPage] = useState('form'); // 'form' or 'schedule'
  const [schedule, setSchedule] = useState([]);

  const [isRunningChecked, setIsRunningChecked] = useState(false);
  const [runningFrequency, setRunningFrequency] = useState(0);
  const [isWeightLiftingChecked, setIsWeightLiftingChecked] = useState(false);
  const [weightLiftingFrequency, setWeightLiftingFrequency] = useState(0);
  const [isYogaChecked, setIsYogaChecked] = useState(false);
  const [yogaFrequency, setYogaFrequency] = useState(0);
  const [totalFrequency, setTotalFrequency] = useState(0);

  const handleCheckboxRunningChange = (event) => {
    setIsRunningChecked(event.target.checked);
  };

  const handleCheckboxWeightLiftingChange = (event) => {
    setIsWeightLiftingChecked(event.target.checked);
  };

  const handleCheckboxYogaChange = (event) => {
    setIsYogaChecked(event.target.checked);
  };

  useEffect(() => {
    // Update total frequency whenever any frequency changes
    const total = (isRunningChecked ? runningFrequency : 0) +
      (isWeightLiftingChecked ? weightLiftingFrequency : 0) +
      (isYogaChecked ? yogaFrequency : 0);
    setTotalFrequency(total);
  }, [isRunningChecked, runningFrequency, isWeightLiftingChecked, weightLiftingFrequency, isYogaChecked, yogaFrequency]);


  const handleSubmit = () => {
    // Here you'd call a real API or function, but for now, we'll just log to the console
    const exercisePlan = {
      'Running': isRunningChecked ? runningFrequency : null,
      'Weight Lifting': isWeightLiftingChecked ? weightLiftingFrequency : null,
      'Yoga': isYogaChecked ? yogaFrequency : null
    };
    console.log(exercisePlan);
    setSchedule(generateSchedule(exercisePlan));
    setCurrentPage('schedule');
    // submitExercisePlan(exercisePlan); // Here you'd call the actual submission function
  };
  const handleBack = () => {
    setCurrentPage('form');
  };

  const generateSchedule = (plan) => {
    const weatherConditions = ['snowy', 'snowy', 'cloudy', 'rainy', 'cloudy', 'rainy', 'sunny'];
    const date = new Date();
    const schedule = [];

    let activities = [];
    for (const [activity, count] of Object.entries(plan)) {
        for (let i = 0; i < count; i++) {
            activities.push(activity);
        }
    }
    while (activities.length <= 7) {
      activities.push("Rest");
    }
    
    for (let i = activities.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [activities[i], activities[j]] = [activities[j], activities[i]];
    }

    for (let i = 1; i <= 7; i++) { // Start from 1 (tomorrow) to 7 (seven days from now)
      const newDate = new Date(date); // Create a new date object to avoid mutating the original date
      newDate.setDate(date.getDate() + i); // Increment the date by i days
      const datestring = format(newDate, 'eee., dd.MM'); // Format the new date
      const weather = weatherConditions[i - 1];
      const activity = activities[i];
      schedule.push({ date: datestring, forecast: weather, activity: activity});
    }
    
    console.log(schedule);
    return schedule;
  };

  const ScheduleList = ({ schedule }) => {
    // Function to get the appropriate icon for the forecast
    const getWeatherIcon = (forecast) => {
      switch (forecast) {
        case 'snowy':
          return <AcUnitOutlinedIconfrom />;
        case 'rainy':
          return <ThunderstormOutlinedIcon />;
        case 'cloudy':
          return <CloudOutlinedIcon />;
        case 'sunny':
          return <WbSunnyOutlinedIcon />;
        default:
          return null; // No icon if the forecast is unknown
      }
    };
  
    // Function to get the appropriate icon for the activity
    const getActivityIcon = (activity) => {
      switch (activity) {
        case 'Rest':
          return <HotelIcon />;
        case 'Running':
          return <DirectionsRunIcon />;
        case 'Weight Lifting':
          return <FitnessCenterIcon />;
        default:
          return null; // No icon if the activity is unknown
      }
    };
  
    return (
      <List>
        {schedule.map(({ date, forecast, activity }, index) => (
          <ListItem key={index} divider>
            <ListItemIcon>
              {getActivityIcon(activity)}
            </ListItemIcon>
            <ListItemText primary={activity} secondary={date} />
            <ListItemIcon>
              {getWeatherIcon(forecast)}
            </ListItemIcon>
          </ListItem>
        ))}
      </List>
    );
  };

  if (currentPage === 'form') {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: matchesXS ? '100vh' : '640px', // Mimic phone screen height on larger devices
          width: matchesXS ? '100vw' : '360px', // Mimic phone screen width on larger devices
          margin: matchesXS ? 0 : 'auto', // Center the box on larger screens
          overflow: 'hidden',
          boxShadow: matchesXS ? 'none' : 3, // Optional shadow for non-mobile view
          borderRadius: matchesXS ? 0 : '20px', // Optional border radius for non-mobile view
          background: 'white'
        }}
        >
          <Container maxWidth='xs' sx={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Grid container sx={{ padding: '20px 0' }}>
              <Grid item xs={12}>
                <Typography variant="h4" component="h1" gutterBottom>
                  Hello, Athlete!
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Choose your exercises for the next 7 days.
                </Typography>
              </Grid>

              <form className='WorkoutSelection'>
                <Grid container spacing={2}>

                  {/** Select Running */}
                  <Grid item xs={8}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="running"
                          checked={isRunningChecked}
                          onChange={handleCheckboxRunningChange}
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <DirectionsRunIcon sx={{ marginRight: 1 }} />
                          <Typography variant="body1" component="span">
                            Running
                          </Typography>
                        </Box>
                      }
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="# per week"
                      type="number"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        min: 0,
                      }}
                      variant="outlined"
                      defaultValue={runningFrequency}
                      size="small"
                      disabled={!isRunningChecked}
                      onChange={(e) => setRunningFrequency(Number(e.target.value))}
                    />
                  </Grid>

                  {/** Select Weight Lifting */}
                  <Grid item xs={8}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="weightLifting"
                          checked={isWeightLiftingChecked}
                          onChange={handleCheckboxWeightLiftingChange}
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <FitnessCenterIcon sx={{ marginRight: 1 }} />
                          <Typography variant="body1" component="span">
                            Weight Lifting
                          </Typography>
                        </Box>
                      }
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="# per week"
                      type="number"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        min: 0,
                      }}
                      variant="outlined"
                      defaultValue={weightLiftingFrequency}
                      size="small"
                      disabled={!isWeightLiftingChecked}
                      onChange={(e) => setWeightLiftingFrequency(Number(e.target.value))}
                    />
                  </Grid>

                  {/** Select Yoga */}
                  <Grid item xs={8}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="yoga"
                          checked={isYogaChecked}
                          onChange={handleCheckboxYogaChange}
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <SelfImprovementIcon sx={{ marginRight: 1 }} />
                          <Typography variant="body1" component="span">
                            Yoga
                          </Typography>
                        </Box>
                      }
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="# per week"
                      type="number"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        min: 0,
                      }}
                      variant="outlined"
                      defaultValue={yogaFrequency}
                      size="small"
                      disabled={!isYogaChecked}
                      onChange={(e) => setYogaFrequency(Number(e.target.value))}
                    />
                  </Grid>

                </Grid>
              </form>
            </Grid>
            <Box>
              {totalFrequency > 7 && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  You can't select more than seven exercises per week.
                </Alert>
              )}

              <Button
                variant="outlined"
                color="primary"
                onClick={handleSubmit}
                disabled={totalFrequency > 7}
                sx={{
                  borderRadius: '20px',
                  textTransform: 'none',
                  marginTop: '20px',
                  marginBottom: '20px',
                }}
              >
                Plan The Next Seven Days
              </Button>
            </Box>
          </Container>
        </Box>

      </ThemeProvider>
    );
  }
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: matchesXS ? '100vh' : '640px', // Mimic phone screen height on larger devices
        width: matchesXS ? '100vw' : '360px', // Mimic phone screen width on larger devices
        margin: matchesXS ? 0 : 'auto', // Center the box on larger screens
        overflow: 'hidden',
        boxShadow: matchesXS ? 'none' : 3, // Optional shadow for non-mobile view
        borderRadius: matchesXS ? 0 : '20px', // Optional border radius for non-mobile view
        background: 'white'
      }}
      >
        <Container maxWidth='xs' sx={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
          <Box sx={{ padding: '20px 0' }}>
          <Typography variant="h4" component="h1" gutterBottom>Recommended Training Schedule</Typography>
          <ScheduleList schedule={schedule} />
          </Box>
        <Box>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleBack}
            sx={{
              borderRadius: '20px',
              textTransform: 'none',
              marginTop: '20px',
              marginBottom: '20px',
            }}
          >
            Back To Planning
          </Button>
        </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
