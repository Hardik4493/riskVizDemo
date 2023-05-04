import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";

const DataTable1 = () => {
  const data = useSelector((state) => state.config.data);
  const columns = [
    {
      name: "Asset Name",
      selector: (row) => row.AssetName,
      sortable: true,
    },
    {
      name: "Business Category",
      selector: (row) => row.BusinessCategory,
      sortable: true,
    },
    {
      name: "Risk Factors",
      selector: (row) => row.RiskFactors,
      sortable: true,
      render: function (row) {
        for (var key in row) {
        }

        return key;
      },
    },
    {
      name: "Risk Rating",
      selector: (row) => row.RiskRating,
      sortable: true,
    },
    {
      name: "Year",
      selector: (row) => row.Year,
    },
  ];

  const [tableData, setTableData] = useState({
    columns: columns,
    data: [],
  });

  useEffect(() => {
    setTableData({ ...tableData, data: data });
  }, [data]);

  return ( 
    <div className="mb-15 datatable">
      <DataTableExtensions {...tableData}>
        <DataTable
          columns={columns}
          data={JSON.stringify(data)}
          defaultSortField="id"
          defaultSortAsc={false}
          pagination
          highlightOnHover
          fixedHeader
          fixedHeaderScrollHeight="400px"
        />
      </DataTableExtensions>
    </div>
  );
};

export default DataTable1;
