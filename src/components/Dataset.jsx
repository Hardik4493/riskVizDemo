import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { read, utils } from "xlsx";
import SheetData from "../../src/data/UI_UX Developer_Work_Sample_Data-big.xlsx";
import Maps from "./Maps";
import DataTable from "./Datatable";
import LineChart from "./LineChart";
import { allData, yearData } from "../store/config";

const DataSet = () => {
  const dispatch = useDispatch();

  const options = [
    { value: 2030, text: "Decade - 2030" },
    { value: 2040, text: "Decade - 2040" },
    { value: 2050, text: "Decade - 2050" },
    { value: 2060, text: "Decade - 2060" },
    { value: 2070, text: "Decade - 2070" },
  ];
  const [selected, setSelected] = useState(options[0].value);

  const handleChange = (event) => {
    setSelected(event.target.value);
  };

  useEffect(() => {
    (async () => {
      const f = await (await fetch(SheetData)).arrayBuffer();
      const wb = read(f);
      const data = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      

      var storesYear = [];
      for (var pos in data) {
        if (data[pos].Year === Number(selected)) {
          storesYear.push(data[pos]);
        }
      }
      dispatch(yearData(storesYear));
      dispatch(allData(data));
    })();
  }, [selected]);


  return (
    <div>
      <div className="header">
        <h1>riskViz</h1>
        <select value={selected} onChange={handleChange}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.text}
            </option>
          ))}
        </select>
      </div>
      <div className="row">
        <div className="col-sm-6">
          <div className="map-container">
            <Maps />
          </div>
        </div>
        <div className="col-sm-6">
          <DataTable/>
          <LineChart />
        </div>
      </div>
    </div>
  );
};

export default DataSet;
