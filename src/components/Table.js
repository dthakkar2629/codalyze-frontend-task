import React, { useState, useEffect } from 'react';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import './Table.css';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import deleteIconPng from '../image/deleteIcon.png';

const Table = () => {
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);

    const [submitted, setSubmitted] = useState(false);

    const [submittedData, setSubmittedData] = useState([]);


    const [rowData, setRowData] = useState([
        { id: 1, Name: "Janie", Email: "jclampton0@over-blog.com", Gender: "Female", DOB: "03-07-1998", Country: "Indonesia", City: "Klatakan" },
        { id: 2, Name: "Homerus", Email: "hivanenkov2@163.com", Gender: "Male", DOB: "14-01-1990", Country: "Ukraine", City: "Leviv" },
        { id: 3, Name: "Kassie", Email: "ksimonyi1@slashdot.org", Gender: "Female", DOB: "24-12-1987", Country: "Russia", City: "Sasovo" },
    ]);

    useEffect(() => {
        if (sessionStorage.getItem("tableData") != null) {
            let data = JSON.parse(sessionStorage.getItem('tableData'));
            let stringData = JSON.stringify(data);
            let rowStringData = JSON.stringify(rowData);

            if (stringData.localeCompare(rowStringData) != 0) {
                setRowData(data);
            }
        } else {
            sessionStorage.setItem('tableData', JSON.stringify(rowData));
        }

        if (sessionStorage.getItem("submitTableData") != null) {
            let data = JSON.parse(sessionStorage.getItem("submitTableData"));
            let stringData = JSON.stringify(data);
            let rowStringData = JSON.stringify(submittedData);
            if (stringData.localeCompare(rowStringData) != 0) {
                setSubmittedData(data);
            }
        } else {
            sessionStorage.setItem("submitTableData", JSON.stringify(submittedData));
        }

        return () => { };
    });


    function addRow() {
        let newRow = {
            id: '',
            Name: '',
            Email: '',
            Gender: '',
            DOB: '',
            Country: '',
            City: '',
        };

        let res = gridApi.applyTransaction({
            add: [newRow],
            addIndex: -1,
        });

        let data = [...rowData];

        data.push(newRow);
        console.log(data);
    }

    function deleteSelectedRow() {
        let selectedRow = gridApi.getSelectedRows();
        let res = gridApi.applyTransaction({ remove: selectedRow });
    }

    function deleteNonSelectedRow() {
        let selectedData = gridApi.getSelectedRows();

        let rowData = [];
        gridApi.forEachNode(node => rowData.push(node.data));

        let deleteData = [];

        console.log(typeof (selectedData));
        console.log(typeof (rowData));

        deleteData = rowData.filter((val) => !selectedData.includes(val));

        console.log(deleteData);

        let res = gridApi.applyTransaction({ remove: deleteData });
    }

    function submitData() {
        setSubmitted(true);
        gridApi.selectAll();
        let rowsData = gridApi.getSelectedRows();
        gridApi.deselectAll();
        sessionStorage.setItem('tableData', JSON.stringify(rowsData));
        if (validateFields()) {
            sessionStorage.setItem('tableData', JSON.stringify(rowsData));
            sessionStorage.setItem('submitTableData', JSON.stringify(rowsData));
            alert('Submitted');
            window.location.reload();
        } else {
            alert('Please verify errors');
        }
    }

    const validateFields = () => {
        let validations = [];

        gridApi.forEachNode(node => {
            // Check value for all parameters

            if (node.data.id === '') {
                validations.push('Id: ' + node.__objectId);
            }

            if (node.data.Name === '') {
                validations.push('Name: ' + node.__objectId);
            } else if (node.data.Name.length != 0 && node.data.Name.length <= 2) {
                validations.push('Name Length: ' + node.__objectId);
            }

            if (node.data.Email === '') {
                validations.push('Email: ' + node.__objectId);
            } else if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(node.data.Email)) {
                validations.push('Email Format: ' + node.__objectId);
            }

            if (node.data.Gender === '') {
                validations.push('Gender: ' + node.__objectId);
            }

            if (node.data.DOB === '') {
                validations.push('DOB: ' + node.__objectId);
            }

            if (node.data.Country === '') {
                validations.push('Country: ' + node.__objectId);
            }

            if (node.data.City === '') {
                validations.push('City: ' + node.__objectId);
            }


        });

        if (validations.length != 0) {
            console.log(validations);
            return false;
        } else {
            return true;
        }


    }

    function deleteIcon(params) {
        const deleteData = () => {
          console.log(params.node.data.name);
          let res = params.api.applyTransaction({ remove: [params.node.data] });
        };
    
        return (
          <div className="delete-button-box">
            <button className="delete-button" onClick={() => deleteData()}>
              <img style={{ width: 20, height: 20 }} src={deleteIconPng} />
            </button>
          </div>
        );
      }

    return (
        <div>

            <div className="buttons">
                <div>
                    <button className="button" onClick={() => addRow()}>
                        Add Row
                    </button>
                </div>

                <div>
                    <button className="button" onClick={() => deleteSelectedRow()}>
                        Delete Selected Row
                    </button>
                </div>

                <div>
                    <button className="button" onClick={() => deleteNonSelectedRow()}>
                        Delete Non Selected Row
                    </button>
                </div>

                <div>
                    <button className="button" onClick={() => submitData()}>
                        Submit
                    </button>
                </div>
            </div>

            <div className="table">
                <div style={{ width: '80vw', height: '40vh' }}>
                    <div
                        id="myGrid"
                        style={{
                            height: '100%',
                            width: '100%',
                        }}
                        className="ag-theme-alpine"
                    >
                        <AgGridReact
                            autoGroupColumnDef={{
                                headerName: 'Group',
                                // minWidth: 170,
                                field: 'id',
                                valueGetter: function (params) {
                                    if (params.node.group) {
                                        return params.node.key;
                                    } else {
                                        return params.data[params.colDef.field];
                                    }
                                },
                                headerCheckboxSelection: true,
                                cellRenderer: 'agGroupCellRenderer',
                                cellRendererParams: { checkbox: true },
                            }}
                            defaultColDef={{
                                editable: true,
                                enablePivot: true,
                                enableValue: true,
                                sortable: true,
                                resizable: true,
                                filter: true,
                                flex: 1,
                                minWidth: 100,
                            }}
                            singleClickEdit={true}
                            components={{ datePicker: getDatePicker() }}
                            frameworkComponents={{
                                deleteIcon: deleteIcon,
                            }}
                            suppressRowClickSelection={true}
                            groupSelectsChildren={true}
                            debug={true}
                            rowSelection={'multiple'}
                            rowData={rowData}
                            onGridReady={(params) => {
                                setGridApi(params.api);
                                setGridColumnApi(params.columnApi);
                            }}
                        >
                            <AgGridColumn
                                field="id"
                                checkboxSelection={true}
                                cellStyle={params => params.value == '' ? { 'background-color': 'red' } : { 'background-color': 'transparent' }}
                            />

                            <AgGridColumn
                                field="Name"
                                cellStyle={params => params.value == '' ? { 'background-color': 'red' } : (params.value.length != 0 && params.value.length <= 2) ? { 'background-color': 'yellow' } : { 'background-color': 'transparent' }}
                            ></AgGridColumn>

                            <AgGridColumn
                                field="Email"
                                cellStyle={params => params.value == '' ? { 'background-color': 'red' } : (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(params.value)) ? { 'background-color': 'yellow' } : { 'background-color': 'transparent' }}
                            ></AgGridColumn>

                            <AgGridColumn field="Gender"
                                cellEditor="agSelectCellEditor"
                                cellEditorParams={{
                                    values: ['Male', 'Female'],
                                }}
                                cellStyle={params => params.value == '' ? { 'background-color': 'red' } : { 'background-color': 'transparent' }}
                            ></AgGridColumn>

                            <AgGridColumn
                                field="DOB"
                                cellEditor="datePicker"
                                cellStyle={params => params.value == '' ? { 'background-color': 'red' } : { 'background-color': 'transparent' }}
                            ></AgGridColumn>

                            <AgGridColumn
                                field="Country"
                                cellEditor="agSelectCellEditor"
                                cellEditorParams={{
                                    values: ['Indonesia', 'Ukraine', 'Russia', 'India'],
                                }}
                                cellStyle={params => params.value == '' ? { 'background-color': 'red' } : { 'background-color': 'transparent' }}
                            ></AgGridColumn>

                            <AgGridColumn
                                field="City"
                                cellStyle={params => params.value == '' ? { 'background-color': 'red' } : { 'background-color': 'transparent' }}
                            ></AgGridColumn>

                            <AgGridColumn
                                field="Delete"
                                editable={false}
                                cellRenderer= 'deleteIcon'
                            ></AgGridColumn>

                        </AgGridReact>
                    </div>
                </div>

                <div style={{ width: '80vw', height: '40vh' }}>
                    <h4>Submitted Data</h4>

                    <div
                        id="myGrid"
                        style={{
                            height: '100%',
                            width: '100%',
                        }}
                        className="ag-theme-alpine"
                    >
                        <AgGridReact
                            autoGroupColumnDef={{
                                headerName: 'Group',
                                field: 'id',
                                valueGetter: function (params) {
                                    if (params.node.group) {
                                        return params.node.key;
                                    } else {
                                        return params.data[params.colDef.field];
                                    }
                                },
                                cellRenderer: 'agGroupCellRenderer',
                                cellRendererParams: { checkbox: true },
                            }}
                            defaultColDef={{
                                flex: 1,
                                minWidth: 100,
                            }}
                            suppressRowClickSelection={true}
                            debug={true}
                            rowData={submittedData}
                        >
                            <AgGridColumn field="id" />
                            <AgGridColumn field="Name"></AgGridColumn>
                            <AgGridColumn field="Email"></AgGridColumn>
                            <AgGridColumn field="Gender"></AgGridColumn>
                            <AgGridColumn field="DOB"></AgGridColumn>
                            <AgGridColumn field="Country"></AgGridColumn>
                            <AgGridColumn field="City"></AgGridColumn>
                            {/* <AgGridColumn field=""></AgGridColumn> */}
                        </AgGridReact>
                    </div>
                </div>

            </div>

        </div>
    );
}

function getDatePicker() {
    function Datepicker() { }
    Datepicker.prototype.init = function (params) {
        this.eInput = document.createElement('input');
        this.eInput.value = params.value;
        this.eInput.classList.add('ag-input');
        this.eInput.style.height = '100%';
        window.$(this.eInput).datepicker({ dateFormat: 'dd/mm/yy' });
    };
    Datepicker.prototype.getGui = function () {
        return this.eInput;
    };
    Datepicker.prototype.afterGuiAttached = function () {
        this.eInput.focus();
        this.eInput.select();
    };
    Datepicker.prototype.getValue = function () {
        return this.eInput.value;
    };
    Datepicker.prototype.destroy = function () { };
    Datepicker.prototype.isPopup = function () {
        return false;
    };
    return Datepicker;
}

export default Table;