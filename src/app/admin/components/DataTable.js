import React, { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import InputText from "./InputText";

const DataTable = ({
    columns,
    rows,
    setRowsTable,
    data,
    buildDataTable,
    recordsPerPage = 10,
    stripped = true,
    search = true,
}) => {
    const originalData = useRef([]);
    const [fieldSearch, setFieldSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const records = rows.slice(firstIndex, lastIndex);
    const page = Math.ceil(rows.length / recordsPerPage);
    const numbers = [...Array(page + 1).keys()].slice(1);

    useEffect(() => {
        if (data) {
            originalData.current = data;
        }
    }, [data]);

    const prevPage = () => {
        if (currentPage !== firstIndex) {
            setCurrentPage(currentPage - 1);
        }
    };

    const nextPage = () => {
        if (currentPage !== lastIndex) {
            setCurrentPage(currentPage + 1);
        }
    };

    const changePage = (id) => {
        setCurrentPage(id);
    };

    const handleSearchRows = (t) => {
        const value = t.target.value.toLowerCase();
        setFieldSearch(value);

        if (originalData.current) {
            if (value === "") {
                setRowsTable(buildDataTable(originalData.current));
                return;
            }

            let filtered = [];
            for (const row of originalData.current) {
                const jsonString = JSON.stringify(row).toLowerCase();
                if (jsonString.includes(value)) {
                    filtered.push(row);
                }
            }
            setRowsTable(buildDataTable(filtered));
        }
    };

    return (
        <div>
            {search && (
                <div className="mt-6 rounded-xl p-4 border border-b-4 bg-white">
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

            <table className="w-full mt-6">
                <thead>
                    <tr>
                        {columns.map((col, k) => (
                            <th
                                key={k}
                                className={`text-sm text-left font-bold p-3 ${col.className ? col.className : null}`}
                            >
                                {col.title}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {records.map((row, k) => (
                        <tr key={k} className={`${stripped && k % 2 === 0 ? "bg-white" : ""} border-t border-zinc-200`}>
                            {columns.map((col, i) => (
                                <td key={i} className="text-left p-3 text-sm">
                                    {row[col.field]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="my-5 border-t"></div>

            <nav className="mt-5 w-full flex items-center justify-between gap-2">
                <p className="text-xs uppercase font-normal text-zinc-500">
                    Exibindo <span className="font-bold">{recordsPerPage}</span> de{" "}
                    <span className="font-bold">{data.length}</span> resultados no total
                </p>
                <ul className="flex items-center">
                    <li className="">
                        <a
                            href="#"
                            onClick={prevPage}
                            className="
                                px-3 
                                py-2 
                                block 
                                text-xs 
                                font-normal 
                                uppercase 
                                rounded 
                                text-zinc-500 
                                hover:bg-zinc-200
                            "
                        >
                            Anterior
                        </a>
                    </li>
                    {numbers.map((n, i) => (
                        <li key={i}>
                            <a
                                href="#"
                                onClick={() => changePage(n)}
                                className={`
                                    px-3 
                                    py-2 
                                    min-w-9 
                                    block 
                                    text-xs 
                                    text-center 
                                    font-normal 
                                    uppercase 
                                    rounded 
                                    ${currentPage == n ? "bg-rose-600 text-white" : "text-zinc-500 hover:bg-zinc-200"}
                                `}
                            >
                                {n}
                            </a>
                        </li>
                    ))}
                    <li>
                        <a
                            href="#"
                            onClick={nextPage}
                            className="
                                px-3 
                                py-2 
                                block 
                                text-xs 
                                font-normal 
                                uppercase 
                                rounded 
                                text-zinc-500 
                                hover:bg-zinc-200
                            "
                        >
                            Próxima
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default DataTable;
