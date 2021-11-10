import React, { Component } from "react";

import Plot from "react-plotly.js";
import memoize from "fast-memoize";
import { calCulateAttitude } from "../Utils/calBestAttitude";
import Loader from "react-loader-spinner";
import * as XLSX from "xlsx";
import getXYZ, { getZ } from "../Utils/getXYZ";
import { getAllErrorModel } from "../Utils/getStatError";
import computePredict, {
  transformSemiVarioGramWithSeparateNode,
} from "../Utils/computePredict";
import createScatterGraph from "../Utils/createScatterGraph";
import { Chart } from "react-google-charts";
import getTrendlines from "../Utils/getTrendlines";
// import { separatePoint } from "../Utils/separatePoint";
import ErrorTable from "../components/ErrorTable";
import NodeResultTable from "../components/NodeResultTable";
import { Link } from "react-router-dom";
import { findCenter, separateZone } from "../Utils/separateNode";
import ZoneTable from "../components/ZoneTable";
import ButtonExportExel from "./ButtonGroupExportExcel";
import dayjs from "dayjs";

const memoizeCalCulateAttitude = memoize(calCulateAttitude);
class NodeWithSeparate extends Component {
  state = {
    nodes: [{ id: 1, latitude: "", longtitude: "", attitude: "" }],
    x: [],
    y: [],
    z: [],
    loading: false,
    variable: {
      nugget: "",
      sill: "",
      range: "",
    },
    zones: [],
    slope: ''
  };

  addNode = () => {
    const { nodes } = this.state;
    const id = nodes.length + 1;
    this.setState({
      nodes: [
        ...nodes,
        {
          id: id,
          latitude: "",
          longtitude: "",
          attitude: "",
        },
      ],
    });
  };
  onChangeFile = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      /* Parse data */
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      /* Update state */
      data.shift();
      const transformDataNode = data.reduce((array, next, index) => {
        return [
          ...array,
          {
            id: index + 1,
            latitude: next[0], //x
            longtitude: next[1], //y
            attitude: next[2], //z
            predictAttitude: next[3], //p
          },
        ];
      }, []);
      this.setState({
        nodes: transformDataNode,
      });
    };
    reader.readAsBinaryString(file);
  };
  onChangeNode = (id) => (e) => {
    const { nodes } = this.state;
    const { name, value } = e.target;
    const temp = nodes;
    temp[id - 1][name] = value;
    this.setState({
      nodes: temp,
    });
  };
  deleteNodes = (e) => {
    const { nodes } = this.state;
    const { id } = e.target;
    const nodeIdTarget = parseInt(id);
    const updateDeleteNode = nodes.filter(({ id }) => id !== nodeIdTarget);
    this.setState({
      nodes: updateDeleteNode,
    });
  };

  onSubmit = () => {
    const { nodes, loading, variable } = this.state;
    this.setState({
      loading: !loading,
      start: dayjs()
    });
    const center = findCenter(nodes);
    const zone = separateZone(nodes, center);
    this.setState({
      zones: zone
    })

    const key = Object.keys(zone);
    const newNode = [];
    const allRangeOfNodesTemp = [];
    let semiVarioGramTemp = {
      exponential: [],
      exponentialWithConstant: [],
      exponentialWithKIteration: [],
      gaussian: [],
      linear: [],
      pentaspherical: [],
      spherical: [],
      trendline: [],
    };

    for (let i = 0; i < key.length; i++) {
      const selectedZone = zone[key[i]];
      const {
        bestSumList,
        allRangeOfNodes,
        semiVarioGram,
      } = memoizeCalCulateAttitude(selectedZone, variable);

      semiVarioGramTemp = transformSemiVarioGramWithSeparateNode(
        semiVarioGram,
        semiVarioGramTemp
      );

      allRangeOfNodesTemp.push(...allRangeOfNodes);

      const listId = selectedZone.map(({ id }) => id);

      const trasnformNodesWithPredict = computePredict(
        selectedZone,
        bestSumList,
        listId
      );
      newNode.push(...trasnformNodesWithPredict);
    }

    this.setState({
      allRangeOfNodes: allRangeOfNodesTemp,
      semiVarioGram: semiVarioGramTemp,
      nodes: newNode.sort((a, b) => a.id < b.id),
      loading: false,
      end: dayjs()
    });
    console.timeEnd("start");
  };
  handleChangeModel = (e) => {
    const value = e.target.value;
    this.setState({
      model: value,
    });
  };
  handleChangeValue = (e) => {
    const { name, value } = e.target;
    this.setState({
      variable: {
        ...this.state.variable,
        [name]: value,
      },
    });
  };

  onSlopeChange = (value) => {
    this.setState({
      ...this.state,
      slope: value
    })
  }
  render() {
    const {
      nodes,
      loading,
      lastPredictNode = false,
      allRangeOfNodes,
      semiVarioGram,
      model = "exponential",
      variable,
      zones,
      slope
    } = this.state;
    const transformDataNode = nodes.sort((a, b) => {
      if (a.id > b.id) {
        return 1;
      }
      return -1;
    });
    const isAllNodeHavePredict = nodes.every(
      ({ predictAttitude }) => predictAttitude !== undefined
    );
    const scatterGraph = isAllNodeHavePredict
      ? createScatterGraph(allRangeOfNodes, semiVarioGram, model)
      : false;
    const x = getXYZ(transformDataNode, "latitude");
    const y = getXYZ(transformDataNode, "longtitude");
    const z = isAllNodeHavePredict ? getZ(transformDataNode, model) : [];
    const error = isAllNodeHavePredict
      ? getAllErrorModel(transformDataNode)
      : false;

    const trendlineData = isAllNodeHavePredict
      ? getTrendlines(allRangeOfNodes, semiVarioGram["exponential"]).filter(([a, b]) => b !== 1)
      : [];

    const data = [["Distance", "Semivariance"], ...trendlineData];
    const options = {
      title: "Exponential Polynomial Trendline",
      legend: 'bottom',
      crosshair: { trigger: "both", orientation: "both" },
      trendlines: {
        0: {
          type: "polynomial",
          degree: 3,
          visibleInLegend: true,
        },
      },
      vAxis: { title: 'Semivariance' },
      hAxis: { title: 'Distance' },
    };

    return (
      <div className="container-graph">
        {loading && (
          <div className="modal">
            <Loader type="Puff" color="#00BFFF" height="100" width="100" />
          </div>
        )}

        <div style={{ margin: "15px" }}>
          <Link style={{ marginRight: "15px" }} to="/">1 x 1 zone</Link>
          <Link style={{ marginRight: "15px" }} to="/separate">2 x 2 zones</Link>
          <Link style={{ marginRight: "15px" }} to="/nine-separate">3 x 3 zones</Link>
          <Link to="/sixteen-separate">4 x 4 zones</Link>
          <h1>
            {model.replace(/^\w/, (c) => c.toUpperCase()) || "Exponential"}
          </h1>
          <div>
            <h1>Model Selection</h1>
            <button onClick={this.handleChangeModel} value="exponential">
              Exponential Model
            </button>
            <button onClick={this.handleChangeModel} value="linear">
              Linear Model
            </button>
            <button onClick={this.handleChangeModel} value="spherical">
              Spherical Model
            </button>
            <button onClick={this.handleChangeModel} value="pentaspherical">
              Pentaspherical Model
            </button>
            <button onClick={this.handleChangeModel} value="gaussian">
              Gussian Model
            </button>
            <button onClick={this.handleChangeModel} value="trendline">
              Trendline Model
            </button>
            <button
              onClick={this.handleChangeModel}
              value="exponentialWithKIteration"
            >
              Exponential with K iteration Model
            </button>
            {!!variable.nugget && !!variable.sill && !!variable.range && (
              <button
                onClick={this.handleChangeModel}
                value="exponentialWithConstant"
              >
                Exponential with Constant
              </button>
            )}
          </div>
          <h1>Node list</h1>
          <input
            name="nugget"
            placeholder="nugget"
            onChange={this.handleChangeValue}
          />
          <input
            name="sill"
            placeholder="sill"
            onChange={this.handleChangeValue}
          />
          <input
            name="range"
            placeholder="range"
            onChange={this.handleChangeValue}
          />
          <div className="input-node-title">
            <p className="node-p-id">ID</p>
            <p className="node-unit">Latitude</p>
            <p className="node-unit">Longtitude</p>
            <p className="node-unit">Altitude</p>
            <p className="node-unit">Predicted Altitude</p>
          </div>

          {transformDataNode.map(
            ({ id, latitude, longtitude, attitude, predictAttitude }) => {
              return (
                <div key={id + latitude.toString()} className="input-node">
                  <div className="id-node">
                    <p>{id}</p>
                  </div>
                  <div>
                    <input
                      onChange={this.onChangeNode(id)}
                      name="latitude"
                      value={latitude || ""}
                    ></input>
                  </div>
                  <div>
                    <input
                      onChange={this.onChangeNode(id)}
                      name="longtitude"
                      value={longtitude || ""}
                    ></input>
                  </div>
                  <div>
                    <input
                      onChange={this.onChangeNode(id)}
                      name="attitude"
                      value={attitude || ""}
                    ></input>
                  </div>
                  <div>
                    <input
                      onChange={this.onChangeNode(id)}
                      name="predictAttitude"
                      value={isAllNodeHavePredict ? predictAttitude[model] : ""}
                    ></input>
                  </div>
                  <div>
                    <button id={id} onClick={this.deleteNodes}>
                      Delete
                    </button>
                  </div>
                </div>
              );
            }
          )}

          <input onChange={this.onChangeFile} type="file"></input>
          <button onClick={this.addNode}>ADD NODE</button>
          <button onClick={this.onSubmit}>Submit</button>
          {error && (
            <ButtonExportExel
              onSlopeChange={this.onSlopeChange}
            />
          )}
        </div>

        <div className="graph">
          {error && (
            <>
              <ErrorTable
                error={error}
                semiVarioGram={semiVarioGram}
                variable={variable}
              />

              <NodeResultTable list={transformDataNode} />
            </>
          )}
          {scatterGraph && (
            <Plot
              data={scatterGraph}
              layout={{
                width: 900,
                height: 600,
                title: "Semivariogram Analysis",
                xaxis: {
                  title: "Distance",
                },
                yaxis: {
                  title: "Semivariogram",
                },
              }}
            />
          )}
          {isAllNodeHavePredict ? (
            <Plot
              data={[
                {
                  x: x,
                  y: y,
                  z: z,
                  type: "mesh3d",
                  showscale: true,
                  intensity: z,
                  colorscale: [
                    [0, 'rgb(0, 0, 255)'],
                    [0.5, 'rgb(0, 128, 0)'],
                    [1, 'rgb(255, 255, 0)']
                  ],
                  colorbar: {
                    title: 'Predicted Altitude'
                  },
                },
              ]}
              layout={{
                width: 900, height: 600, title: "3D Surface Plots",
                scene: {
                  aspectratio: {
                    x: 1,
                    y: 1,
                    z: 0.5
                  },
                  zaxis: {
                    title: 'Predicted Altitude',
                    backgroundcolor: 'rgb(230,230,200)',
                    showbackground: true,
                    zerolinecolor: 'white',
                    gridcolor: 'white',
                    nticks: 20,


                  },
                  yaxis: {
                    title: 'Longtitude',
                    nticks: 10,
                    backgroundcolor: 'rgb(230,230,200)',
                    showbackground: true,
                    zerolinecolor: 'white',
                    gridcolor: 'white',
                  },
                  xaxis: {
                    title: 'Latitude',
                    nticks: 10,
                    backgroundcolor: 'rgb(230,230,200)',
                    showbackground: true,
                    zerolinecolor: 'white',
                    gridcolor: 'white',
                  }
                }
              }}
            />
          ) : null}
          {isAllNodeHavePredict ? (
            <Plot
              data={[
                {
                  x: x,
                  y: y,
                  z: z,
                  intensity: z,
                  type: "contour",
                  contours: {
                    showlabels: true,
                    labelfont: {
                      family: 'Raleway',
                      size: 12,
                      color: 'white',
                    }
                  },
                  colorscale: [
                    [0, 'rgb(0, 0, 255)'],
                    [0.5, 'rgb(0, 128, 0)'],
                    [1, 'rgb(255, 255, 0)']
                  ],
                  colorbar: {
                    title: 'Predicted Altitude'
                  },
                },
              ]}
              layout={{
                width: 900,
                height: 600,
                title: "Contour Plots",
                scene: {
                  aspectratio: {
                    x: 1,
                    y: 1,
                    z: 0.5
                  },
                  zaxis: {
                    title: 'Predicted Altitude',
                    backgroundcolor: 'rgb(230,230,200)',
                    showbackground: true,
                    zerolinecolor: 'white',
                    gridcolor: 'white',
                    nticks: 20,


                  },
                  yaxis: {
                    title: 'Longtitude',
                    nticks: 10,
                    backgroundcolor: 'rgb(230,230,200)',
                    showbackground: true,
                    zerolinecolor: 'white',
                    gridcolor: 'white',
                  },
                  xaxis: {
                    title: 'Latitude',
                    nticks: 10,
                    backgroundcolor: 'rgb(230,230,200)',
                    showbackground: true,
                    zerolinecolor: 'white',
                    gridcolor: 'white',
                  }
                }
              }}
            />
          ) : null}

          {trendlineData.length > 0 && (
            <Chart
              chartType="ScatterChart"
              width="900px"
              height="600px"
              data={data}
              options={options}
              legendToggle
            />
          )}

          <ZoneTable
            zones={zones}
            nodes={transformDataNode}
            isShowConstant={
              !!variable.nugget && !!variable.sill && !!variable.range
            }
            inputSlope={slope}
            startTime={this.state.start}
            endTime={this.state.end}
          />
        </div>

      </div>
    );
  }
}

export default NodeWithSeparate;
