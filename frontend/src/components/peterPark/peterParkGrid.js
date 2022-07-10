import React from "react";
import "../../styles.css";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";
import { visuallyHidden } from "@mui/utils";
import Swal from "sweetalert2";

const getPlatesUrl = "/plate";
class PeterParkGrid extends React.Component {
  constructor() {
    super();
    this.state = {
      order: "asc",
      orderBy: "Plate",
      page: 0,
      rowsPerPage: 5,
      searchText: "",
      rows: []
    };
    this.changeSearchText = this.changeSearchText.bind(this);
    this.realodData = this.realodData.bind(this);
  }
  componentDidMount() {
    this.realodData();
  }
  changeSearchText = (text) => this.setState({ searchText: text });
  reloadDataPeterParkGridC = () => this.realodData();
  realodData() {
    fetch(getPlatesUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }).then(response => {
      if (response.ok) return response.json();
      else Swal.fire({
        icon: "error",
        title: "error in getting data!",
        showConfirmButton: false,
        timer: 1500 
      });
    }).then(data => {
      this.setState({ rows: data });
    }).catch(err => {
      Swal.fire({
        icon: "error",
        title: "error in getting data!",
        showConfirmButton: false,
        timer: 1500 
      });
    });
  }
  changeSearchText = (text) => this.setState({ searchText: text });
  emptyRows() {
    return this.state.page > 0
      ? Math.max(
        0,
        (1 + this.state.page) * this.state.rowsPerPage - this.getData().length
      )
      : 0;
  }

  descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
  }

  getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => this.descendingComparator(a, b, orderBy)
      : (a, b) => -this.descendingComparator(a, b, orderBy);
  }

  // This method is created for cross-browser compatibility, if you don't
  // need to support IE11, you can use Array.prototype.sort() directly
  stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  headCells = [
    {
      id: "plate",
      numeric: false,
      disablePadding: false,
      label: "Plate"
    },
    {
      id: "owner",
      numeric: false,
      disablePadding: false,
      label: "Owner"
    },
    {
      id: "start_date",
      numeric: false,
      disablePadding: false,
      label: "Start date"
    },
    {
      id: "end_date",
      numeric: false,
      disablePadding: false,
      label: "End date"
    }
  ];
  getData() {
    /* 
    IMPORTANT NOTICE:
    There are 2 ways for search . front-end side and back-end side.
    the right way for search is back-end side because it must send the
    parameters to the back-end to get the data from query in database. 
    I decided to implement the SEARCH feature on front-end side because
    I thought that the total number of elements are less than 1000 and 
    due to the architecture that we get ALL the data every time, so we 
    are able to search in the front-end side. Overall , the right way for
    implementing search is back-end side with query but I decided to do 
    like this. if it wasn't the right way for search based on owner mindest, 
    just let me know to change the way of searching.
    */
   if (this.state.rows == undefined) return [];
   if (this.state.searchText.length >= 3) {
      return this.state.rows.filter(
        (x) => {
          let ownerHas = x.owner != null ? x.owner.toLowerCase().includes(this.state.searchText.toLowerCase()) : false;
          let plateHas = x.plate.toLowerCase().includes(this.state.searchText.toLowerCase());
          return ownerHas || plateHas;
        }
      );
    }
    return this.state.rows;
  }
  render() {
    return (
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", pl: 2, pr: 1 }}>
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
              <TableHead>
                <TableRow>
                  {this.headCells.map((headCell) => (
                    <TableCell
                      key={headCell.id}
                      align="left"
                      padding={headCell.disablePadding ? "none" : "normal"}
                      sortDirection={
                        this.state.orderBy === headCell.id
                          ? this.state.order
                          : false
                      }
                    >
                      <TableSortLabel
                        active={this.state.orderBy === headCell.id}
                        direction={
                          this.state.orderBy === headCell.id
                            ? this.state.order
                            : "asc"
                        }
                        onClick={(event) => {
                          const isAsc =
                            this.state.orderBy === headCell.id &&
                            this.state.order === "asc";
                          this.setState({
                            order: isAsc ? "desc" : "asc",
                            orderBy: headCell.id
                          });
                        }}
                      >
                        {headCell.label}
                        {this.state.orderBy === headCell.id ? (
                          <Box component="span" sx={visuallyHidden}>
                            {this.state.order === "desc"
                              ? "sorted descending"
                              : "sorted ascending"}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {this.getData().length > 0 ?
                  this.stableSort(
                    this.getData(),
                    this.getComparator(this.state.order, this.state.orderBy)
                  ).slice(
                    this.state.page * this.state.rowsPerPage,
                    this.state.page * this.state.rowsPerPage +
                    this.state.rowsPerPage
                  )
                    .map((row, index) => {
                      const labelId = `enhanced-table-checkbox-${index}`;
                      const owner = row.owner != null ? row.owner : "";
                      const start_date = row.start_date != null ? row.start_date.replace(/T/g, " ").replace(/Z/g, " ") : "";
                      const end_date = row.end_date != null ? row.end_date.replace(/T/g, " ").replace(/Z/g, " ") : "";
                      return (
                        <TableRow hover tabIndex={-1} key={row.id}>
                          <TableCell className="notUserSelect" component="th" id={labelId} scope="row" padding="2" align="left">{row.plate}</TableCell>
                          <TableCell className="notUserSelect" align="left">{owner}</TableCell>
                          <TableCell className="notUserSelect" align="left">{start_date}</TableCell>
                          <TableCell className="notUserSelect" align="left">{end_date}</TableCell>
                        </TableRow>
                      );
                    }) : <TableRow><TableCell style={{
                      textAlign: "center",
                      fontSize: "20px",
                      padding: "50px",
                    }} colSpan={4}>no plate</TableCell></TableRow>}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            className="conflictSolver"
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={this.getData().length}
            rowsPerPage={this.state.rowsPerPage}
            page={this.state.page}
            onPageChange={(event, newPage) => {
              this.setState({ page: newPage });
            }}
            onRowsPerPageChange={(event) => {
              this.setState({
                page: 0,
                rowsPerPage: parseInt(event.target.value, 10)
              });
            }}
          />
        </Paper>
      </Box >
    );
  }
}

export default PeterParkGrid;
