import React from "react";
import "../../styles.css";
import { Container, Box, Paper } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Grid from "@mui/material/Grid";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import PeterParkGrid from "./peterParkGrid";
import PeterParkAddModal from "./peterParkAddModal";

class PeterPark extends React.Component {
  constructor() {
    super();
    this.state = { modalAddShow: false };
    this.peterParkGrid = React.createRef();
    this.reloadDataPeterParkC = this.reloadDataPeterParkC.bind(this);
  }
  reloadDataPeterParkC = () =>
    this.peterParkGrid.current.reloadDataPeterParkGridC();

  render() {
    return (
      <div>
        <Container maxWidth="lg" sx={{ mt: "40px" }}>
          <Box>
            <Paper sx={{ margin: "auto", overflow: "hidden" }}>
              <AppBar
                position="static"
                color="default"
                elevation={0}
                sx={{ borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}
              >
                <Toolbar>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <SearchIcon color="inherit" sx={{ display: "block" }} />
                    </Grid>
                    <Grid item xs>
                      <TextField
                        fullWidth
                        placeholder="Search..."
                        variant="standard"
                        onChange={(event) => {
                          this.peterParkGrid.current.changeSearchText(
                            event.target.value
                          );
                        }}
                        InputProps={{
                          disableUnderline: true,
                          sx: { fontSize: "sm" }
                        }}
                      />
                    </Grid>
                    <Grid item>
                      <Fab
                        size="medium"
                        color="primary"
                        aria-label="add peter park"
                        onClick={() => {
                          this.setState({ modalAddShow: true });
                        }}
                      >
                        <AddIcon />
                      </Fab>
                    </Grid>
                  </Grid>
                </Toolbar>
              </AppBar>
              <PeterParkGrid ref={this.peterParkGrid} />
            </Paper>
          </Box>
          <PeterParkAddModal
            show={this.state.modalAddShow}
            onHide={() => {
              this.setState({ modalAddShow: false });
            }}
            reloadDataPeterParkC={this.reloadDataPeterParkC}
          />
        </Container>
      </div>
    );
  }
}

export default PeterPark;
