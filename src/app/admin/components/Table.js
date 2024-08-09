import React, { useEffect, useRef, useState } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import InputText from "./InputText";
import Icon from "./Icon";
import { useAppContext } from "@/contexts/admin/AppWrapper";

createTheme("table_default", {
    text: {
        primary: "#111111",
    },
    background: {
        default: "transparent",
    },
    divider: {
        default: "#eaeaea",
    },
});

const customStyles = {
    rows: {
        style: {
            fontSize: "14px",
        },
    },
    headCells: {
        style: {
            fontSize: "15px",
            fontWeight: "bold",
        },
    },
    cells: {
        style: {
            padding: "10px 15px",
        },
    },
};

const Table = ({ columns, rows, setRowsTable, pagination, search, elements, actions }) => {
    const [fieldSearch, setFieldSearch] = useState("");
    const originalData = useRef(null);

    useEffect(() => {
        if (rows.length > 0 && !originalData.current) {
            originalData.current = rows;
        }
    }, [rows]);

    const handleSearchRows = (t) => {
        const results = [];
        const value = t.target.value.toLowerCase();
        setFieldSearch(value);

        if (originalData.current) {
            const results = originalData.current
                .filter((row) => {
                    const jsonString = JSON.stringify({
                        ...row,
                        actions: null,
                    }).toLowerCase();
                    console.log(row);
                    return jsonString.includes(value);
                })
                .map((row) => ({
                    ...row,
                    actions: actions ? actions(row) : null,
                }));

            setRowsTable(results);
        }
    };

    return (
        <>
            {search && (
                <div
                    className="
                        rounded-xl 
                        p-4
                        border
                        border-b-4
                        bg-white 
                    "
                >
                    <div className="flex items-center mb-1 gap-1">
                        <Icon name="Search" size={17} />
                        <h3 className="text-base font-semibold text-zinc-800">Buscar:</h3>
                    </div>
                    <InputText
                        onChangeValue={(t) => handleSearchRows(t)}
                        value={fieldSearch}
                        size="small"
                        type="text"
                        placeholder="Digite aqui a sua busca..."
                    />
                </div>
            )}
            <DataTable
                columns={columns}
                data={rows}
                pagination={pagination}
                customStyles={customStyles}
                theme="table_default"
                striped
            ></DataTable>
        </>
    );
};

export default Table;
