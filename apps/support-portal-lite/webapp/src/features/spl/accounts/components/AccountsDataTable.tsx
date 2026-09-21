// Copyright (c) 2026 WSO2 LLC. (https://www.wso2.com).
//
// WSO2 LLC. licenses this file to you under the Apache License,
// Version 2.0 (the "License"); you may not use this file except
// in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

// Ported from one-wso2's features/spl/accounts/components/AccountsDataTable.tsx
// (itself ported from the source app's DefaultTable.tsx), restyled onto
// @wso2/oxygen-ui (a full re-export of @mui/material, same component names)
// instead of plain @mui/material.
import type { ChangeEvent, MouseEvent } from "react";
import {
  Box,
  IconButton,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  useTheme,
} from "@wso2/oxygen-ui";
import { ChevronsLeftIcon, ChevronsRightIcon, ChevronLeftIcon, ChevronRightIcon } from "@wso2/oxygen-ui-icons-react";
import type { DataStruct, ApiError } from "../api/splAccountTypes";
import NoDataAvailable from "./NoDataAvailable";

export interface AccountsDataTableProps {
  data: DataStruct[] | undefined;
  loading: boolean;
  error: ApiError | undefined;
  page: number;
  setPage: (page: number) => void;
  rowsPerPage: number;
  setRowsPerPage: (rowsPerPage: number) => void;
  colNameArray: string[];
  colAttributeArray: string[];
  handleRowClick?: (rowData: DataStruct) => void;
}

function LinearLoading() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Box sx={{ marginTop: "20px", width: "25%" }}>
        <LinearProgress sx={{ width: "100%" }} />
      </Box>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
        Loading…
      </Typography>
    </Box>
  );
}

export default function AccountsDataTable(props: AccountsDataTableProps) {
  const handleChangePage = (_event: unknown, newPage: number) => props.setPage(newPage);
  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    props.setRowsPerPage(parseInt(event.target.value, 10));
    props.setPage(0);
  };

  if (props.loading) return <LinearLoading />;
  if (props.error) {
    return (
      <NoDataAvailable
        message="Something went wrong"
        description={props.error.message || "Couldn't load this data. Try again shortly."}
      />
    );
  }
  if (!props.data) return null;
  if (props.data.length === 0) {
    return <NoDataAvailable message="No data available" description="There are no items to display." />;
  }

  return (
    <PopulateTable
      {...props}
      data={props.data}
      handleChangePage={handleChangePage}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
    />
  );
}

function PopulateTable({
  data,
  rowsPerPage,
  page,
  colNameArray,
  colAttributeArray,
  handleRowClick,
  handleChangePage,
  handleChangeRowsPerPage,
}: {
  data: DataStruct[];
  rowsPerPage: number;
  page: number;
  colNameArray: string[];
  colAttributeArray: string[];
  handleRowClick?: (rowData: DataStruct) => void;
  handleChangePage: (event: unknown, newPage: number) => void;
  handleChangeRowsPerPage: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}) {
  const theme = useTheme();
  const hoverColor = theme.palette.mode === "dark" ? "#4d3a2a" : "#f9dcc5";

  return (
    <Paper sx={{ width: "100%", border: "2px solid", borderColor: "divider", borderRadius: "8px", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: "70vh", overflow: "auto" }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {colNameArray.map((value, index) => (
                <TableCell
                  key={index}
                  sx={{ backgroundColor: "action.selected", color: "text.primary", fontWeight: "bold" }}
                >
                  {value}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((dataRow, index) => (
              <TableRow
                key={index}
                onClick={() => handleRowClick?.(dataRow)}
                sx={{
                  ...(handleRowClick ? { cursor: "pointer" } : {}),
                  "&:nth-of-type(even)": { backgroundColor: "action.hover" },
                  "&:hover": { backgroundColor: hoverColor },
                }}
              >
                {colAttributeArray.map((attributeName, i) => (
                  <TableCell key={i}>{String(dataRow[attributeName] ?? "")}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ borderTop: "1px solid", borderColor: "divider", backgroundColor: "background.paper" }}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={-1}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          ActionsComponent={(actionsProps) => <PaginationActions {...actionsProps} dataLength={data.length} />}
        />
      </Box>
    </Paper>
  );
}

function PaginationActions({
  page,
  rowsPerPage,
  onPageChange,
  dataLength,
}: {
  page: number;
  rowsPerPage: number;
  onPageChange: (event: MouseEvent<HTMLButtonElement>, newPage: number) => void;
  dataLength: number;
}) {
  const theme = useTheme();
  const isNextDisabled = dataLength < rowsPerPage;

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton onClick={(e) => onPageChange(e, 0)} disabled={page === 0} aria-label="first page">
        {theme.direction === "rtl" ? <ChevronsRightIcon size={18} /> : <ChevronsLeftIcon size={18} />}
      </IconButton>
      <IconButton onClick={(e) => onPageChange(e, page - 1)} disabled={page === 0} aria-label="previous page">
        {theme.direction === "rtl" ? <ChevronRightIcon size={18} /> : <ChevronLeftIcon size={18} />}
      </IconButton>
      <IconButton onClick={(e) => onPageChange(e, page + 1)} disabled={isNextDisabled} aria-label="next page">
        {theme.direction === "rtl" ? <ChevronLeftIcon size={18} /> : <ChevronRightIcon size={18} />}
      </IconButton>
      {/* Total row count is unknown for these endpoints — "jump to last page"
          has no destination. Kept visible-but-disabled to match the source's
          own 4-button layout. */}
      <IconButton disabled aria-label="last page">
        {theme.direction === "rtl" ? <ChevronsLeftIcon size={18} /> : <ChevronsRightIcon size={18} />}
      </IconButton>
    </Box>
  );
}
