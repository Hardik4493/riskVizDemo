import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Line } from "react-chartjs-2";
import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";
Chart.register(CategoryScale);

const LineChart = () => {
  const lineGraphData = useSelector((state) => state.config.allData);
  const selectedData = useSelector((state) => state.config.selectedData);
  const [field, setField] = useState({
    category: "",
    location: "",
    asset: "",
  });
  const [state, setState] = useState([]);

  // Get Lat and Long From Store array
  const uniqueLoc = lineGraphData.filter(
    (obj, index) =>
      lineGraphData.findIndex(
        (item) => item.Lat === obj.Lat && item.Long === obj.Long
      ) === index
  );

  // Get Asset Name from Store Array
  const unique_asset = [
    ...new Map(lineGraphData.map((m) => [m.AssetName, m])).values(),
  ];

  // Get Category From Store array
  const unique_cateogry = [
    ...new Map(lineGraphData.map((m) => [m.BusinessCategory, m])).values(),
  ];

  const getChartDatafirstTime = () => {
    const chartArray = [];
    uniqueLoc.map((element, index) => {
      let getLatLong = element.Lat + "," + element.Long;
      let newElement = {};
      newElement["label"] = element.AssetName;
      let yearwiseData = getYearWiseData(getLatLong, "location");
      newElement["data"] = yearwiseData[0];

      chartArray.push(newElement);
      return false;
    });
    setState((state) => chartArray);
  };

  const getYearWiseData = (event, type) => {
    let mainyear = 2030;
    let RiskRating = [];
    let assetName;
    if (type === "location") {
      const getLatLong = event.split(",");
      let latitude = Number(getLatLong[0]);
      let longitude = Number(getLatLong[1]);
      lineGraphData.map((element, index) => {
        if (
          element.Lat === latitude &&
          element.Long === longitude &&
          element.Year === mainyear
        ) {
          assetName = element.AssetName;
          RiskRating.push(element.RiskRating);
          mainyear = mainyear + 10;
        }
        return false;
      });
    }

    if (type === "asset") {
      let asset = event;
      lineGraphData.map((element, index) => {
        if (element.AssetName === asset && element.Year === mainyear) {
          assetName = element.AssetName;
          RiskRating.push(element.RiskRating);
          mainyear = mainyear + 10;
        }
        return false;
      });
    }

    if (type === "category") {
      let category = event;
      lineGraphData.map((element, index) => {
        if (
          element.BusinessCategory === category &&
          element.Year === mainyear
        ) {
          assetName = element.BusinessCategory;
          RiskRating.push(element.RiskRating);
          mainyear = mainyear + 10;
        }
        return false;
      });
    }
    return [RiskRating, assetName];
  };

  useEffect(() => {
    if (lineGraphData !== null) {
      getChartDatafirstTime();
    }
  }, [lineGraphData]);

  const handleChange = (event) => {
    const name = event.target.name;
    switch (name) {
      case "asset":
        setField({
          category: "",
          location: "",
          asset: event.target.value,
        });
        break;
      case "location":
        setField({
          category: "",
          location: event.target.value,
          asset: "",
        });
        break;
      case "category":
        setField({
          category: event.target.value,
          location: "",
          asset: "",
        });
        break;
      default:
        setField({
          category: "",
          location: "",
          asset: "",
        });
        break;
    }
    if(event.target.value !== '') {
      let changeData = getYearWiseData(event.target.value, event.target.name);
      let chartArray = [];
      let newElement = {};
  
      newElement["label"] = changeData[1];
      newElement["data"] = changeData[0];
  
      chartArray.push(newElement);
      setState(chartArray);
    }
    else{
      getChartDatafirstTime();
    }
    
  };

  useEffect(() => {
    if (selectedData !== null) {
      let changeData = getYearWiseData(
        selectedData.Lat + "," + selectedData.Long,
        "location"
      );
      let chartArray = [];
      let newElement = {};
      newElement["label"] = changeData[1];
      newElement["data"] = changeData[0];

      chartArray.push(newElement);
      setField({
        category: "",
        location: selectedData.Lat + "," + selectedData.Long,
        asset: "",
      });
      setState(chartArray);
    }
  }, [selectedData]);

  const data = {
    labels: ["2030", "2040", "2050", "2060", "2070"],
    datasets: state,
  };

  //const data = state;

  const options = {
    title: {
      display: true,
      text: "Risk Rating",
    },
    animations: {
      tension: {
        duration: 1000,
        easing: "linear",
        from: 0.2,
        to: 0,
        loop: true,
      },
    },
  };
  
  Chart.defaults.elements.line.borderWidth = 2;

  return (
    <div>
      <div className="mb-15">
        <select name="asset" value={field.asset} onChange={handleChange}>
          <option key="" value="">
            Select Asset Name
          </option>
          {unique_asset.map((optionAsset) => (
            <option key={optionAsset.AssetName} value={optionAsset.AssetName}>
              {optionAsset.AssetName}
            </option>
          ))}
        </select>

        <select name="location" value={field.location} onChange={handleChange}>
          <option key="" value="">
            Select Location
          </option>
          {uniqueLoc.map((optionLoc) => (
            <option
              key={optionLoc.Lat + "," + optionLoc.Long}
              value={optionLoc.Lat + "," + optionLoc.Long}
            >
              {optionLoc.Lat + "," + optionLoc.Long}
            </option>
          ))}
        </select>

        <select name="category" value={field.category} onChange={handleChange}>
          <option key="" value="">
            Select Business Category
          </option>
          {unique_cateogry.map((optionCategory) => (
            <option
              key={optionCategory.BusinessCategory}
              value={optionCategory.BusinessCategory}
            >
              {optionCategory.BusinessCategory}
            </option>
          ))}
        </select>
      </div>

      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
