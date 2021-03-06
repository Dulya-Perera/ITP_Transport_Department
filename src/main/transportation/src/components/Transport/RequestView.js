import React, { Component } from "react";
import RequestDataService from "../../services/request.service";
import { Form } from "react-bootstrap";
import jsPDF from 'jspdf';
import '../../App.css'
import { red } from "@material-ui/core/colors";

export default class RequestView extends Component {

    constructor(props) {
        super(props);
        this.getRequest = this.getRequest.bind(this);
        this.deleteRequest = this.deleteRequest.bind(this);
        
        this.state = {
            date: new Date().toLocaleString(),

            currentRequest: {
                id: null,
                customerName: "",
                customerAddress: "",
                assignedVehicle: "",
                quantity: "",
                requestedDate: "",
                transportedDate: "",
                status: false,
            },

            message: ""
        };
    }

    componentDidMount() {
        this.getRequest(this.props.match.params.id);
    }

    getRequest(id) {
        RequestDataService.get(id)
            .then(response => {
                this.setState({
                    currentRequest: response.data
                });
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
                alert("Can't get the details.")
            });
    }

    deleteRequest(){
        RequestDataService.delete(this.state.currentRequest.id)
        .then(response => {
            console.log(response.data);
            this.props.history.push('/Requests')
            alert("Successfully Deleted.")
        })
        .catch(e => {
            console.log(e);
            alert("Can't delete.")
        })
    }

    jsPdfGenerator = () => {

        if(this.state.currentRequest.assignedVehicle === "" || this.state.currentRequest.transportedDate === "") {
            alert("You can't generate report, because the order is not assingned.")
        }

        else{
            var doc = new jsPDF();

            // doc.setFont('helvetica')
    
            var imgData = '/logo.png'
            doc.addImage(imgData, 'png', 30, 45, 40, 0)
            doc.rect(20, 20, doc.internal.pageSize.width - 40, doc.internal.pageSize.height - 40, 'S');
            doc.setFontSize(11)
            doc.text(145, 50, 'Beligammana, Mawanella')
            doc.text(145, 55, '+94 778 357 755')
            doc.text(145, 60, '+94 352 050 255')
            doc.text(145, 65, 'cfour@sltnet.lk')
            doc.setFontSize(20)
            doc.text(70, 100, 'Order Details Report')
            doc.line(65, 102, 140, 102)
            doc.setFontSize(15)
            doc.text(40, 130, 'Order Details')
            doc.setFontSize(12)
            doc.text(40, 145, 'Customer Name:')
            doc.text(40, 155, 'Customer Address:')
            doc.text(40, 165, 'Ordered Quantity:')
            doc.text(40, 175, 'Assigned Vehicle:')
            doc.text(40, 185, 'Requested Date:')
            doc.text(40, 195, 'Transported Date:')
            doc.text(145, 220, 'Certified By:')
            doc.text(145, 225, 'Transport Admin')
            doc.setFontSize(11)
            doc.text(110, 145, this.state.currentRequest.customerName)
            doc.text(110, 155, this.state.currentRequest.customerAddress)
            doc.text(110, 165, `${this.state.currentRequest.quantity}`)
            doc.text(110, 175, this.state.currentRequest.assignedVehicle)
            doc.text(110, 185, this.state.currentRequest.requestedDate)
            doc.text(110, 195, this.state.currentRequest.transportedDate)
            doc.setFontSize(9)
            doc.setTextColor(255, 0, 0)
            doc.text(30, 250, '* The given details were generated by ' + `${this.state.date}`)
        
            doc.save(this.state.currentRequest.customerName + ' Report.pdf')
        }

    }

    render() {

        const { currentRequest } = this.state;

        return (

            <div style={{marginLeft:300}}>
                {/* <img src="/transportation.png" height="400" width="400" /> */}
                {currentRequest ? (
                    <div className="edit-form" style={{ width: 500 }}>
                        <h3>Order Details</h3><br /><br />
                        <form>
                            <div className="form-group">
                                <label style={{ fontSize: 20 }}>
                                    <strong>Customer Name:</strong>
                                </label>{" "}
                                <Form.Control type="text" placeholder={currentRequest.customerName} readOnly />
                                {/* {currentRequest.customerName} */}
                            </div>
                            <div className="form-group">
                                <label style={{ fontSize: 20 }}>
                                    <strong>Customer Address:</strong>
                                </label>{" "}
                                <Form.Control type="text" placeholder={currentRequest.customerAddress} readOnly />
                                {/* {currentRequest.customerAddress} */}
                            </div>
                            <div>
                                <label className="form-group" style={{ fontSize: 20 }}>
                                    <strong>Ordered Quantity:</strong>
                                </label>{" "}
                                <Form.Control type="text" placeholder={currentRequest.quantity} readOnly />
                                {/* {currentRequest.quantity} */}
                            </div>

                            <div>
                                <label className="form-group" style={{ fontSize: 20 }}>
                                    <strong>Assigned Vehicle:</strong>
                                </label>{" "}
                                <Form.Control type="text" placeholder={currentRequest.assignedVehicle} readOnly />
                                {/* {currentRequest.assignedVehicle} */}
                            </div>

                            <div>
                                <label className="form-group" style={{ fontSize: 20 }}>
                                    <strong>Requested Date:</strong>
                                </label>{" "}
                                <Form.Control type="text" placeholder={currentRequest.requestedDate} readOnly />
                                {/* {currentRequest.requestedDate} */}
                            </div>

                            <div>
                                <label className="form-group" style={{ fontSize: 20 }}>
                                    <strong>Transported Date:</strong>
                                </label>{" "}
                                <Form.Control type="text" placeholder={currentRequest.transportedDate} readOnly />
                                {/* {currentRequest.transportedDate} */}
                            </div>

                        </form>

                        <br/><br/>
                        <button
                            className="badge badge-success mr-2"
                            onClick={this.jsPdfGenerator}
                            style={{ fontSize: 18 }}
                        > Generate Report </button>

                        <button
                            className="badge badge-danger mr-2"
                            onClick={this.deleteRequest}
                            style={{ fontSize: 18 }}
                        > Delete </button>

                        <br /><br />
                        <p style={{ fontSize: 25 }}>{this.state.message}</p>
                    </div>
                ) : (
                        <div>
                            <br />
                            <p>None</p>
                        </div>
                    )}
            </div>
        );
    }
}