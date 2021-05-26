
import React, { Component } from 'react'
import 'antd/dist/antd.css';
import { Layout, Input, Button, Card, Table } from 'antd';
import { compile } from 'mathjs';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import apis from '../API/index'
import axios from 'axios';


const { Content } = Layout;

const InputStyle = {
    background: "while",
    color: "#922B21 ",//#F6ABFA #ffa31a สีใส่ข้อความ
    fontWeight: "bold",
    fontSize: "24px",
    textAlign: 'center',
    marginLeft: "65%",
};
var dataInTable = []

const columns = [
    {
        title: "Iteration",
        dataIndex: "iteration",
        key: "iteration"
    },
    {
        title: "XL",
        dataIndex: "xl",
        key: "xl"
    },
    {
        title: "XR",
        dataIndex: "xr",
        key: "xr"
    },
    {
        title: "X",
        dataIndex: "x",
        key: "x"
    },
    {
        title: "Error",
        key: "error",
        dataIndex: "error"
    }
];
var fx
class Bisec extends Component {

    constructor() {
        super();
        this.state = { apiData :[],
            fx: "",
            xl: null,
            xr: null,
            showOutputCard: false,
            showGraph: false,
            moveLeft: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.bisection = this.bisection.bind(this);
        
    }
    //ดึงโจทย์
    async getData(){
        let tempData = null
        await apis.getAllroot().then(res => {tempData = res.data})
        this.setState({apiData:tempData})
        this.setState({
            fx: this.state.apiData[0]["equation"],
            xl :this.state.apiData[0]["xl"],
            xr: this.state.apiData[0]["xr"],
            error: this.state.apiData[0]["error"],
        })
    }
    onClickExample = e =>{
        this.getData()
    }
    
    // API = async () => {
    //     var response = await axios.get('http://localhost:3001/Bisection').then(res => { return res.data })
    //     this.setState({
    //         fx: response['data'][0]['fx'],
    //         xl: response['data'][0]['xl'],
    //         xr: response['data'][0]['xr'],

    //     }); 
    //     alert(
    //         "Fx : "+ this.state.fx+"    "+
    //         "XL : "+ this.state.xl+"    "+
    //         "XR : "+ this.state.xr
    //     );
    //     this.bisection(this.state.xl,this.state.xr) 
    // } 


    bisection(xl, xr) {
        fx = this.state.fx;
        var increaseFunction = false;
        var xm = 0;
        var sum = parseFloat(0.000000);
        var n = 0;
        var data = []
        data['xl'] = []
        data['xr'] = []
        data['x'] = []
        data['error'] = []
        if (this.func(xl) < this.func(xr)) {
            increaseFunction = true;
        }

        do {
            xm = (xl + xr) / 2;
            if (this.func(xm) * this.func(xr) < 0) {
                sum = this.error(xm, xr);
                if (increaseFunction) {
                    xl = xm;
                }
                else {
                    xr = xm;
                }

            }
            else {
                sum = this.error(xm, xl);
                if (increaseFunction) {
                    xr = xm;
                }
                else {
                    xl = xm;
                }
            }
            data['xl'][n] = xl;
            data['xr'][n] = xr;
            data['x'][n] = xm.toFixed(8);
            data['error'][n] = Math.abs(sum).toFixed(8);
            n++;
        } while (Math.abs(sum) > 0.000001);
        this.createTable(data['xl'], data['xr'], data['x'], data['error']);
        this.setState({
            showOutputCard: true,
            showGraph: true
        })


    }

    func(X) {
        var expr = compile(this.state.fx);
        let scope = { x: parseFloat(X) };
        return expr.eval(scope);
    }
    error(xnew, xold) {
        return Math.abs((xnew - xold) / xnew);
    }
    createTable(xl, xr, x, error) {
        dataInTable = []
        for (var i = 0; i < xl.length; i++) {
            dataInTable.push({
                iteration: i + 1,
                xl: xl[i],
                xr: xr[i],
                x: x[i],
                error: error[i]
            });
        }
    }
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });

    }
    render() {
        return (
            <div >
                <div
                    onChange={this.handleChange}
                    style={{
                        padding: '50px',
                        background: "#",
                        width: '100%',
                    }}
                >
                    <div
                        style={{
                            width: 500,
                            color: "#922B21",
                            background: "#"

                        }}
                    >
                        <h1 style={{ color: "#fac8c3", fontSize: "30px", marginLeft: "-5%" }}>Bisection</h1>
                        <h2 style={{ marginLeft: "65%" }}>f(x)</h2>   <Input size="large" name="fx" style={InputStyle} value={this.state.fx}></Input>
                        <h2 style={{ marginLeft: "65%" }}>X<sub>L</sub></h2>  <Input size="large" name="xl" style={InputStyle} value={this.state.xl}></Input>
                        <h2 style={{ marginLeft: "65%" }} >X<sub>R</sub></h2>  <Input size="large" name="xr" style={InputStyle} value={this.state.xr}></Input>
                        <br /><br />
                        <Button ghost="submit_button" onClick={
                            () => this.bisection(parseFloat(this.state.xl), parseFloat(this.state.xr))
                        }
                            style={{ background: "#D68910", color: "#D68910", fontSize: "15px", marginLeft: "105%" }}>Submit <br></br></Button>

                        {/*API */}
                        <br /><br />
                        <Button ghost="API" onClick={() => this.getData()}
                            style={{ color: "#D68910", fontSize: "15px", marginLeft: "104%" }}>Example <br></br></Button> 
                    </div>

                    <br /><br />
                    {this.state.showGraph &&
                        <Card
                            style={{ borderRadius: "20px" }}
                        >
                            <LineChart width={730} height={250} data={dataInTable}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <XAxis dataKey="error" />
                                <YAxis />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Tooltip />
                                <Legend verticalAlign="top" height={36} />
                                <Line name="error" type="monotone" dataKey="error" stroke="#E510AE" /> //#8884d8
                            </LineChart>
                        </Card>
                    }
                    <br /><br />
                    {this.state.showOutputCard &&

                        <Card
                            style={{ borderRadius: "10px" }}
                        >
                            <Table columns={columns} dataSource={dataInTable} bodyStyle={{ fontWeight: "bold", fontSize: "18px", color: "#EC7063" }}></Table>
                        </Card>
                    }
                    <br /><br />
                </div>
            </div>
        )
    }
}
export default Bisec;