import React from "react";
import { Modal, Container, Row, Col } from "react-bootstrap";
import Button from "@mui/material/Button";
import { withStyles } from "@mui/styles";
import TextField from "@mui/material/TextField";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Swal from "sweetalert2";

const addPlateUrl = "/plate";
const styles = (theme) => ({
  row: {
    paddingBottom: "20px"
  },
  col: {
    paddingBottom: "20px"
  }
});
class PeterParkAddModal extends React.Component {
  constructor(props) {
    super();
    this.state = {
      plateError: {},
      startDateError: {},
      endDateError: {},
      data: {
        plate: undefined,
        owner: undefined,
        start_date: new Date(),
        end_date: undefined
      }
    };
    this.platePatternChecker = this.platePatternChecker.bind(this);
    this.clearData = this.clearData.bind(this);
    this.addPlate = this.addPlate.bind(this);
  }
  clearData() {
    this.setState({
      plateError: {},
      startDateError: {},
      endDateError: {},
      data: {
        plate: undefined,
        owner: undefined,
        start_date: new Date(),
        end_date: undefined
      }
    });
  }
  validation() {
    let plate = this.state.data.plate;
    if (plate === undefined || plate.replace(/ /g, "") === "") {
      this.setState({
        plateError: {
          error: "error",
          helperText: "plate is required!"
        }
      });
      return false;
    } else if (!this.isGermanyFormat(plate)) {
      this.setState({
        plateError: {
          error: "error",
          helperText: "incorrect entry (germany format)"
        }
      });
      return false;
    } else if (
      this.state.data.start_date !== undefined &&
      !this.state.data.start_date instanceof Date
    ) {
      this.setState({
        startDateError: {
          error: "error",
          helperText: "start date format is incoorect!"
        }
      });
      return false;
    } else if (
      this.state.data.end_date !== undefined &&
      !this.state.data.end_date instanceof Date
    ) {
      this.setState({
        startDateError: {
          error: "error",
          helperText: "end date format is incoorect!"
        }
      });
      return false;
    }
    return true;
  }
  addPlate() {
    if (this.validation()) {
      let bodyData = {
        plate: this.state.data.plate,
        owner: this.state.data.owner,
        start_date:
          this.state.data.start_date === undefined || 
          this.state.data.start_date === null
            ? undefined
            : `${this.state.data.start_date.toISOString().split(".")[0]}Z`,
        end_date:
          this.state.data.end_date === undefined || 
          this.state.data.end_date === null
            ? undefined
            : `${this.state.data.end_date.toISOString().split(".")[0]}Z`
      };
      fetch(addPlateUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData)
      }).then((response) => {
        if (response.ok){
          this.reloadData();
          this.clearData();
          this.props.onHide();
          Swal.fire({
            icon: "success",
            title: "plate has been added!",
            showConfirmButton: false,
            timer: 1500
          });
        }
        else Swal.fire({
          icon: "error",
          title: "error in adding plate!",
          showConfirmButton: false,
          timer: 1500 
        });
      });
    }
  }
  reloadData = () => this.props.reloadDataPeterParkC();

  isGermanyFormat = (str) => /^[a-zA-Z]{1,3}-[a-zA-Z]{1,2}[1-9]\d{0,3}$/.test(str);

  platePatternChecker(event) {
    let value = event.target.value;
    if (value.length >= 3 && !this.isGermanyFormat(value))
      this.setState({
        plateError: {
          error: "error",
          helperText: "incorrect entry (germany format)"
        }
      });
    else this.setState({ plateError: {} });
  }
  render() {
    const { classes } = this.props;
    return (
      <Modal
        {...this.props}
        size="lg"
        centered
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add Plate
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Col className={classes.col} xs={12} md={6}>
                <TextField
                  value={this.state.data.plate}
                  onChange={(event) => {
                    let newObj = this.state.data;
                    newObj.plate = event.target.value;
                    this.setState({ data: newObj });
                  }}
                  onKeyUp={this.platePatternChecker}
                  {...this.state.plateError}
                  inputProps={{ maxLength: 10 }}
                  required
                  fullWidth
                  label="Plate"
                  variant="outlined"
                />
              </Col>
              <Col className={classes.col} pd={2} xs={12} md={6}>
                <TextField
                  value={this.state.data.owner}
                  onChange={(event) => {
                    let newObj = this.state.data;
                    newObj.owner = event.target.value;
                    this.setState({ data: newObj });
                  }}
                  fullWidth
                  label="Owner"
                  variant="outlined"
                  inputProps={{ maxLength: 50 }}
                />
              </Col>
            </Row>

            <Row>
              <Col className={classes.col} pd={2} xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    value={this.state.data.start_date}
                    onChange={(newValue) => {
                      let newObj = this.state.data;
                      newObj.start_date = newValue;
                      this.setState({ data: newObj });
                    }}
                    label="start date"
                    renderInput={(params) => (
                      <TextField
                        {...this.state.startDateError}
                        fullWidth
                        {...params}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Col>
              <Col className={classes.col} pd={2} xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    value={
                      this.state.data.end_date === undefined
                        ? null
                        : this.state.data.end_date
                    }
                    onChange={(newValue) => {
                      let newObj = this.state.data;
                      newObj.end_date = newValue;
                      this.setState({ data: newObj });
                    }}
                    label="end date"
                    renderInput={(params) => (
                      <TextField
                        {...this.state.endDateError}
                        fullWidth
                        {...params}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.addPlate} variant="contained" size="large">
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default withStyles(styles)(PeterParkAddModal);
