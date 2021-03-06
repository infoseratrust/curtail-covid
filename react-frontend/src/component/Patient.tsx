import {
  Button,
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import { Form, Formik } from "formik";
import { withSnackbar } from "notistack";
import React, { useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import * as Yup from "yup";
import { failureToast, successToast } from "../util/util";
import { districts, mandals, villages } from "./const";
import { PreviousReadings } from "./PreviousReadings";

const ValidationSchema = Yup.object().shape({
  firstName: Yup.string().required("Required"),
  surname: Yup.string().required("Required"),
  phoneNumber: Yup.number()
    .test(
      "len",
      "Must be exactly 10 Digits",
      (val: any) => val?.toString()?.length === 10
    )
    .required("Required"),
  address: Yup.string().required("Required"),
  village: Yup.string().required("Required"),
  mandal: Yup.string().required("Required"),
  district: Yup.string().required("Required"),
  state: Yup.string().required("Required"),
  pincode: Yup.number()
    .test(
      "len",
      "Must be exactly 6 Digits",
      (val: any) => val?.toString()?.length === 6
    )
    .required("Required"),
  gender: Yup.string().required("Required"),
  age: Yup.number().required("Required"),
  dateFirstObserved: Yup.string().required("Required"),
  emergencyContactName: Yup.string().required("Required"),
  emergencyContactNumber: Yup.number()
    .test(
      "len",
      "Must be exactly 10 Digits",
      (val: any) => val?.toString()?.length === 10
    )
    .required("Required"),
  pulse: Yup.string().required("Required"),
  bloodPressure: Yup.string().required("Required"),
  temperature: Yup.string().required("Required"),
  temperatureDate: Yup.string().required("Required"),
  temperatureTime: Yup.string().required("Required"),
  oxygenLevel: Yup.string().required("Required"),
  oxygenLevelDate: Yup.string().required("Required"),
  oxygenLevelTime: Yup.string().required("Required"),
});
const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  paper: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginBottom: theme.spacing(4),
      padding: theme.spacing(2),
    },
  },
  paper2: {
    marginBottom: theme.spacing(3),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginBottom: theme.spacing(4),
    },
  },
}));
const PatientComponent = (props: any) => {
  const history = useHistory();
  const classes = useStyles();
  const { params } = useRouteMatch();
  const [patient, setPatient] = React.useState<any>({
    firstName: "",
    surname: "",
    aadharCard: "",
    phoneNumber: "",
    address: "",
    village: "",
    mandal: "",
    district: "",
    state: "",
    pincode: "",
    gender: "",
    age: "",
    dateFirstObserved: "",
    nearestLandmark: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    pulse: "",
    bloodPressure: "",
    temperature: "",
    temperatureDate: "",
    temperatureTime: "",
    oxygenLevel: "",
    oxygenLevelDate: "",
    oxygenLevelTime: "",
  });
  const param: any = params;
  const cancelPatient = () => {
    history.push("/patientList");
  };
  const savePatient = (values: any) => {
    const symptoms: any = {
      oxygenLevel: values.oxygenLevel,
      oxygenLevelDate: values.oxygenLevelDate,
      oxygenLevelTime: values.oxygenLevelTime,
      temperature: values.temperature,
      temperatureDate: values.temperatureDate,
      temperatureTime: values.temperatureTime,
      bodyAche: values.bodyAche,
      fatigue: values.fatigue,
      lossOfTaste: values.lossOfTaste,
      lossOfSmell: values.lossOfSmell,
      breathingDifficulty: values.breathingDifficulty,
      soreThroat: values.soreThroat,
      headache: values.headache,
      nausea: values.nausea,
      sneezing: values.sneezing,
      diarrhea: values.diarrhea,
      pulse: values.pulse,
      bloodPressure: values.bloodPressure,
    };
    let payload: any;
    if (param.id) {
      const allSymtoms: any = patient.symptoms;
      allSymtoms.push({ ...symptoms });
      payload = {
        ...values,
        allSymtoms,
      };
    } else {
      payload = {
        ...values,
        symptoms: [symptoms],
      };
    }
    axios
      .post("/api/v1/patient", { ...payload })
      .then((response: any) => {
        props.enqueueSnackbar("Details saved successfully", successToast);
        history.push("/patientList");
      })
      .catch((reponse: any) => {
        debugger;
        props.enqueueSnackbar("Failed To Save the Details", failureToast);
      });
  };
  const intialLoad = () => {
    if (param.id) {
      axios
        .get("/api/v1/patient/" + param.id)
        .then((response: any) => {
          setPatient({ ...response.data });
          console.log({ ...response.data });
        })
        .catch((reponse: any) => {
          console.log(reponse);
          props.enqueueSnackbar("Unable To Fetch the Patient", failureToast);
        });
    }
  };
  useEffect(() => {
    intialLoad();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const defaultvalues = { ...patient };
  const currentDate = new Date();
  console.log(defaultvalues.temperatureDate);
  let month: any = currentDate.getMonth() + 1;
  let hours: any = currentDate.getHours();
  let minutes: any = currentDate.getMinutes();

  if (month < 10) {
    month = "0" + month;
  }
  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  const dateValue =
    currentDate.getFullYear() + "-" + month + "-" + currentDate.getDate();
  const timeValue = hours + ":" + minutes;
  if (defaultvalues.temperatureDate && defaultvalues.temperatureDate !== "") {
  } else {
    defaultvalues.temperatureDate = dateValue;
  }
  if (defaultvalues.oxygenLevelDate && defaultvalues.oxygenLevelDate !== "") {
  } else {
    defaultvalues.oxygenLevelDate = dateValue;
  }
  if (defaultvalues.temperatureTime) {
  } else {
    defaultvalues.temperatureTime = timeValue;
  }
  if (defaultvalues.oxygenLevelTime) {
  } else {
    defaultvalues.oxygenLevelTime = timeValue;
  }
  if (
    defaultvalues.dateFirstObserved &&
    defaultvalues.dateFirstObserved !== ""
  ) {
  } else {
    defaultvalues.dateFirstObserved = dateValue;
  }
  return (
    <React.Fragment>
      <Formik
        initialValues={{ ...defaultvalues }}
        enableReinitialize
        validationSchema={ValidationSchema}
        onSubmit={(values: any) => {
          savePatient(values);
        }}
      >
        {({ errors, touched, values, handleChange }) => (
          <Form autoComplete="new-patient" name="new-patient" noValidate>
            <main className={classes.layout}>
              <Paper className={classes.paper}>
                <Typography component="h3" variant="h4" align="center">
                  {param.id ? "Update Patient" : "New Patient"}
                </Typography>
                <React.Fragment>
                  <Typography variant="h6">Patient Contact Details</Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={6} sm={6}>
                      <TextField
                        size="small"
                        required
                        autoComplete="new-patient"
                        id="firstName"
                        name="firstName"
                        label="First Name"
                        fullWidth
                        onChange={handleChange}
                        value={values.firstName || ""}
                        error={
                          errors.firstName && touched.firstName ? true : false
                        }
                        helperText={touched.firstName && errors.firstName}
                      />
                    </Grid>
                    <Grid item xs={6} sm={6}>
                      <TextField
                        autoComplete="new-patient"
                        size="small"
                        required
                        id="surname"
                        name="surname"
                        label="Surname"
                        fullWidth
                        onChange={handleChange}
                        value={values.surname || ""}
                        error={errors.surname && touched.surname ? true : false}
                        helperText={touched.surname && errors.surname}
                      />
                    </Grid>
                    <Grid item xs={6} sm={6}>
                      <TextField
                        size="small"
                        autoComplete="new-patient"
                        id="aadharCard"
                        name="aadharCard"
                        label="Aadhar Card"
                        fullWidth
                        onChange={handleChange}
                        value={values.aadharCard || ""}
                      />
                    </Grid>
                    <Grid item xs={6} sm={6}>
                      <TextField
                        type="number"
                        size="small"
                        required
                        autoComplete="new-patient"
                        id="phoneNumber"
                        name="phoneNumber"
                        label="Phone Number"
                        fullWidth
                        onChange={handleChange}
                        value={values.phoneNumber || ""}
                        error={
                          errors.phoneNumber && touched.phoneNumber
                            ? true
                            : false
                        }
                        helperText={touched.phoneNumber && errors.phoneNumber}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        size="small"
                        id="address"
                        name="address"
                        label="Address"
                        required
                        autoComplete="new-patient"
                        fullWidth
                        onChange={handleChange}
                        value={values.address || ""}
                        error={errors.address && touched.address ? true : false}
                        helperText={touched.address && errors.address}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl
                        error={errors.village && touched.village ? true : false}
                      >
                        <InputLabel id="village-label">Village</InputLabel>
                        <Select
                          style={{ minWidth: "200px" }}
                          labelId="village-label"
                          id="village"
                          name="village"
                          autoComplete="new-patient"
                          required
                          fullWidth
                          value={values.village || ""}
                          defaultValue={values.village || ""}
                          onChange={handleChange}
                          label="Village"
                        >
                          {villages.map((village: any) => {
                            return (
                              <MenuItem value={village} key={village}>
                                {village}
                              </MenuItem>
                            );
                          })}
                        </Select>
                        {errors.village && (
                          <FormHelperText>Required</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl
                        error={errors.mandal && touched.mandal ? true : false}
                      >
                        <InputLabel id="mandal-label">Mandal</InputLabel>
                        <Select
                          style={{ minWidth: "200px" }}
                          labelId="mandal-label"
                          id="mandal"
                          name="mandal"
                          autoComplete="new-patient"
                          required
                          fullWidth
                          value={values.mandal || ""}
                          defaultValue={values.mandal || ""}
                          onChange={handleChange}
                          label="Mandal"
                          error={errors.mandal && touched.mandal ? true : false}
                        >
                          {mandals.map((mandal: any) => {
                            return (
                              <MenuItem value={mandal} key={mandal}>
                                {mandal}
                              </MenuItem>
                            );
                          })}
                        </Select>{" "}
                        {errors.mandal && (
                          <FormHelperText>Required</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={6} sm={6}>
                      <FormControl
                        error={
                          errors.district && touched.district ? true : false
                        }
                      >
                        <InputLabel id="district-label">District</InputLabel>
                        <Select
                          style={{ minWidth: "200px" }}
                          labelId="district-label"
                          id="district"
                          name="district"
                          autoComplete="new-patient"
                          required
                          fullWidth
                          value={values.district || ""}
                          defaultValue={values.district || ""}
                          onChange={handleChange}
                          label="District"
                          error={
                            errors.district && touched.district ? true : false
                          }
                        >
                          {districts.map((district: any) => {
                            return (
                              <MenuItem value={district} key={district}>
                                {district}
                              </MenuItem>
                            );
                          })}
                        </Select>{" "}
                        {errors.district && (
                          <FormHelperText>Required</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        size="small"
                        required
                        autoComplete="new-patient"
                        id="state"
                        name="state"
                        label="State"
                        fullWidth
                        onChange={handleChange}
                        value={values.state || ""}
                        error={errors.state && touched.state ? true : false}
                      />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <TextField
                        size="small"
                        required
                        type="number"
                        autoComplete="new-patient"
                        id="pincode"
                        name="pincode"
                        label="Pincode"
                        fullWidth
                        onChange={handleChange}
                        value={values.pincode || ""}
                        error={errors.pincode && touched.pincode ? true : false}
                        helperText={touched.pincode && errors.pincode}
                      />
                    </Grid>

                    <Grid item xs={6} sm={2}>
                      <FormControl
                        error={errors.gender && touched.gender ? true : false}
                      >
                        <InputLabel id="gender-label">Gender</InputLabel>
                        <Select
                          style={{ minWidth: "100px" }}
                          labelId="gender-label"
                          id="gender"
                          name="gender"
                          required
                          value={values.gender || ""}
                          defaultValue={values.gender || ""}
                          onChange={handleChange}
                          label="Gender"
                        >
                          <MenuItem value={"Male"}>Male</MenuItem>
                          <MenuItem value={"Female"}>Female</MenuItem>
                          <MenuItem value={"-"}>-</MenuItem>
                        </Select>{" "}
                        {errors.gender && (
                          <FormHelperText>Required</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={3} sm={1}>
                      <TextField
                        type="number"
                        size="small"
                        required
                        autoComplete="new-patient"
                        id="age"
                        name="age"
                        fullWidth
                        onChange={handleChange}
                        value={values.age || ""}
                        label={"Age"}
                        error={errors.age && touched.age ? true : false}
                        helperText={touched.age && errors.age}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} style={{ paddingBottom: "0px" }}>
                      <TextField
                        InputLabelProps={{ shrink: true }}
                        type="date"
                        size="small"
                        required
                        autoComplete="new-patient"
                        id="dateFirstObserved"
                        name="dateFirstObserved"
                        fullWidth
                        onChange={handleChange}
                        value={values.dateFirstObserved || ""}
                        label={"Date First Observed Symptom"}
                        error={
                          errors.dateFirstObserved && touched.dateFirstObserved
                            ? true
                            : false
                        }
                        helperText={
                          touched.dateFirstObserved && errors.dateFirstObserved
                        }
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        size="small"
                        autoComplete="new-patient"
                        id="nearestLandmark"
                        name="nearestLandmark"
                        label="Nearest Landmark"
                        fullWidth
                        onChange={handleChange}
                        value={values.nearestLandmark || ""}
                        error={
                          errors.nearestLandmark && touched.nearestLandmark
                            ? true
                            : false
                        }
                        helperText={
                          touched.nearestLandmark && errors.nearestLandmark
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        autoComplete="new-patient"
                        size="small"
                        id="emergencyContactName"
                        name="emergencyContactName"
                        label="Emergency Contact Name"
                        fullWidth
                        onChange={handleChange}
                        value={values.emergencyContactName || ""}
                        error={
                          errors.emergencyContactName &&
                          touched.emergencyContactName
                            ? true
                            : false
                        }
                        helperText={
                          touched.emergencyContactName &&
                          errors.emergencyContactName
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        size="small"
                        autoComplete="new-patient"
                        id="emergencyContactNumber"
                        name="emergencyContactNumber"
                        label="Emergency Contact Number"
                        fullWidth
                        type="number"
                        onChange={handleChange}
                        value={values.emergencyContactNumber || ""}
                        error={
                          errors.emergencyContactNumber &&
                          touched.emergencyContactNumber
                            ? true
                            : false
                        }
                        helperText={
                          touched.emergencyContactNumber &&
                          errors.emergencyContactNumber
                        }
                      />
                    </Grid>
                  </Grid>
                </React.Fragment>
              </Paper>
              <Paper className={classes.paper}>
                <React.Fragment>
                  <Typography variant="h6">Covid Symptoms</Typography>
                  <Grid item xs={12} style={{ padding: "0px" }}>
                    <Divider />
                  </Grid>
                  <Grid
                    container
                    spacing={3}
                    alignContent="center"
                    alignItems="center"
                  >
                    <Grid item xs={12} sm={3} style={{ paddingBottom: "0px" }}>
                      Vitals
                    </Grid>

                    <Grid item xs={6} sm={4}>
                      <TextField
                        type="number"
                        size="small"
                        required
                        autoComplete="new-patient"
                        id="pulse"
                        name="pulse"
                        label="Pulse"
                        fullWidth
                        onChange={handleChange}
                        value={values.pulse || ""}
                        error={errors.pulse && touched.pulse ? true : false}
                        helperText={touched.pulse && errors.pulse}
                      />
                    </Grid>
                    <Grid item xs={6} sm={4}>
                      <TextField
                        size="small"
                        required
                        autoComplete="new-patient"
                        id="bloodPressure"
                        name="bloodPressure"
                        label="Blood Pressure"
                        fullWidth
                        onChange={handleChange}
                        value={values.bloodPressure || ""}
                        error={
                          errors.bloodPressure && touched.bloodPressure
                            ? true
                            : false
                        }
                        helperText={
                          touched.bloodPressure && errors.bloodPressure
                        }
                      />
                    </Grid>

                    <Grid item xs={12} sm={3} style={{ paddingBottom: "0px" }}>
                      Temperature
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <TextField
                        type="number"
                        size="small"
                        required
                        autoComplete="new-patient"
                        id="temperature"
                        name="temperature"
                        label="Temperature"
                        fullWidth
                        onChange={handleChange}
                        value={values.temperature || ""}
                        error={
                          errors.temperature && touched.temperature
                            ? true
                            : false
                        }
                        helperText={touched.temperature && errors.temperature}
                      />
                    </Grid>
                    <Grid item xs={6} sm={3} style={{ paddingBottom: "0px" }}>
                      <TextField
                        type="date"
                        size="small"
                        required
                        autoComplete="new-patient"
                        id="temperatureDate"
                        name="temperatureDate"
                        fullWidth
                        onChange={handleChange}
                        value={values.temperatureDate || ""}
                        error={
                          errors.temperatureDate && touched.temperatureDate
                            ? true
                            : false
                        }
                        helperText={
                          touched.temperatureDate && errors.temperatureDate
                        }
                      />
                    </Grid>
                    <Grid item xs={6} sm={3} style={{ paddingBottom: "0px" }}>
                      <TextField
                        type="time"
                        size="small"
                        required
                        autoComplete="new-patient"
                        id="temperatureTime"
                        name="temperatureTime"
                        fullWidth
                        onChange={handleChange}
                        value={values.temperatureTime || ""}
                        error={
                          errors.temperatureTime && touched.temperatureTime
                            ? true
                            : false
                        }
                        helperText={
                          touched.temperatureTime && errors.temperatureTime
                        }
                      />
                    </Grid>

                    <Grid item xs={12} style={{ padding: "0px" }}>
                      <Divider />
                    </Grid>
                    <Grid item xs={12} sm={3} style={{ paddingBottom: "0px" }}>
                      Oxygen Level
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <TextField
                        type="number"
                        size="small"
                        required
                        autoComplete="new-patient"
                        id="oxygenLevel"
                        name="oxygenLevel"
                        label="Oxygen Level"
                        fullWidth
                        onChange={handleChange}
                        value={values.oxygenLevel || ""}
                        error={
                          errors.oxygenLevel && touched.oxygenLevel
                            ? true
                            : false
                        }
                        helperText={touched.oxygenLevel && errors.oxygenLevel}
                      />
                    </Grid>
                    <Grid item xs={6} sm={3} style={{ paddingBottom: "0px" }}>
                      <TextField
                        type="date"
                        size="small"
                        required
                        autoComplete="new-patient"
                        id="oxygenLevelDate"
                        name="oxygenLevelDate"
                        fullWidth
                        onChange={handleChange}
                        value={values.oxygenLevelDate || ""}
                        error={
                          errors.oxygenLevelDate && touched.oxygenLevelDate
                            ? true
                            : false
                        }
                        helperText={
                          touched.oxygenLevelDate && errors.oxygenLevelDate
                        }
                      />
                    </Grid>
                    <Grid item xs={6} sm={3} style={{ paddingBottom: "0px" }}>
                      <TextField
                        type="time"
                        size="small"
                        required
                        autoComplete="new-patient"
                        id="oxygenLevelTime"
                        name="oxygenLevelTime"
                        fullWidth
                        onChange={handleChange}
                        value={values.oxygenLevelTime || ""}
                        error={
                          errors.oxygenLevelTime && touched.oxygenLevelTime
                            ? true
                            : false
                        }
                        helperText={
                          touched.oxygenLevelTime && errors.oxygenLevelTime
                        }
                      />
                    </Grid>
                    <Grid item xs={12} style={{ padding: "0px" }}>
                      <Divider />
                    </Grid>
                    <Grid item xs={12} style={{ paddingBottom: "0px" }}>
                      Symptoms
                    </Grid>
                    <Grid item xs={6} sm={4} style={{ paddingBottom: "0px" }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            color="secondary"
                            name="bodyAche"
                            onChange={handleChange}
                            value={values.bodyAche}
                          />
                        }
                        label="Body Ache"
                      />
                    </Grid>
                    <Grid item xs={6} sm={4} style={{ paddingBottom: "0px" }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            color="secondary"
                            name="fatigue"
                            onChange={handleChange}
                            value={values.fatigue || ""}
                          />
                        }
                        label="Fatigue"
                      />
                    </Grid>
                    <Grid item xs={6} sm={4} style={{ paddingBottom: "0px" }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            color="secondary"
                            name="lossOfTaste"
                            onChange={handleChange}
                            value={values.lossOfTaste}
                          />
                        }
                        label="Loss of Taste"
                      />
                    </Grid>
                    <Grid item xs={6} sm={4} style={{ paddingBottom: "0px" }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            color="secondary"
                            name="lossOfSmell"
                            onChange={handleChange}
                            value={values.lossOfSmell}
                          />
                        }
                        label="Loss Of Smell"
                      />
                    </Grid>
                    <Grid item xs={6} sm={4} style={{ paddingBottom: "0px" }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            color="secondary"
                            name="breathingDifficulty"
                            onChange={handleChange}
                            value={values.breathingDifficulty}
                          />
                        }
                        label="Breathing Difficulty"
                      />
                    </Grid>
                    <Grid item xs={6} sm={4} style={{ paddingBottom: "0px" }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            color="secondary"
                            name="soreThroat"
                            onChange={handleChange}
                            value={values.soreThroat}
                          />
                        }
                        label="Sore Throat"
                      />
                    </Grid>
                    <Grid item xs={6} sm={4} style={{ paddingBottom: "0px" }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            color="secondary"
                            name="headache"
                            onChange={handleChange}
                            value={values.headache}
                          />
                        }
                        label="Headache"
                      />
                    </Grid>
                    <Grid item xs={6} sm={4} style={{ paddingBottom: "0px" }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            color="secondary"
                            name="nausea"
                            onChange={handleChange}
                            value={values.nausea}
                          />
                        }
                        label="Nausea"
                      />
                    </Grid>
                    <Grid item xs={6} sm={4} style={{ paddingBottom: "0px" }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            color="secondary"
                            name="sneezing"
                            onChange={handleChange}
                            value={values.sneezing}
                          />
                        }
                        label="Sneezing"
                      />
                    </Grid>
                    <Grid item xs={6} sm={4} style={{ paddingBottom: "0px" }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            color="secondary"
                            name="diarrhea"
                            onChange={handleChange}
                            value={values.diarrhea}
                          />
                        }
                        label="Diarrhea"
                      />
                    </Grid>

                    <Grid item xs={12} style={{ textAlign: "center" }}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={cancelPatient}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        style={{ marginLeft: "15px" }}
                        type="submit"
                      >
                        Save
                      </Button>
                    </Grid>
                  </Grid>
                </React.Fragment>
              </Paper>
              {param.id && (
                <React.Fragment>
                  <Typography variant="h6">Previous Readings</Typography>
                  <div className={classes.paper2}>
                    <PreviousReadings
                      symptoms={patient.symptoms}
                    ></PreviousReadings>
                  </div>
                </React.Fragment>
              )}
            </main>
          </Form>
        )}
      </Formik>
    </React.Fragment>
  );
};

export const Patient = withSnackbar(PatientComponent);
