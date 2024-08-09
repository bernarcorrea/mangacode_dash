import React, { useState } from "react";
import Icon from "./Icon";
import InputText from "./InputText";

const DataTableServer = ({
    columns,
    rows,
    totalRecords,
    recordsPerPage,
    stripped = true,
    search = true,
    currentPage,
    setCurrentPage,
    fetchData,
}) => {
    const [fieldSearch, setFieldSearch] = useState("");

    const pages = Math.ceil(totalRecords / recordsPerPage);
    const maxPageButtons = 5;

    const getPageNumbers = () => {
        const arrPages = [];
        const half = Math.floor(maxPageButtons / 2);
        let start = currentPage - half;
        let end = currentPage + half;

        if (start <= 1) {
            start = 1;
            end = Math.min(pages, maxPageButtons);
        } else if (end >= pages) {
            end = pages;
            start = Math.max(1, pages - maxPageButtons + 1);
        }

        for (let i = start; i <= end; i++) {
            arrPages.push(i);
        }
        return arrPages;
    };

    const numbers = getPageNumbers();

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            fetchData((currentPage - 2) * recordsPerPage, recordsPerPage);
        }
    };

    const nextPage = () => {
        setCurrentPage(currentPage + 1);
        fetchData(currentPage * recordsPerPage, recordsPerPage);
    };

    const changePage = (id) => {
        setCurrentPage(id);
        fetchData((id - 1) * recordsPerPage, recordsPerPage);
    };

    const handleSearchRows = (t) => {
        const value = t.target.value.toLowerCase();
        setFieldSearch(value);
        setCurrentPage(1);
        fetchData(0, recordsPerPage, value);
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
                    {rows.map((row, k) => (
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
                    <span className="font-bold">{totalRecords}</span> resultados no total
                </p>
                <ul className="flex items-center">
                    <li className="">
                        <a
                            onClick={prevPage}
                            className="
                                px-3 
                                py-2 
                                block 
                                text-xs 
                                font-normal 
                                uppercase 
                                rounded 
                                cursor-pointer
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
                                    cursor-pointer
                                    ${currentPage == n ? "bg-rose-600 text-white" : "text-zinc-500 hover:bg-zinc-200"}
                                `}
                            >
                                {n}
                            </a>
                        </li>
                    ))}
                    <li>
                        <a
                            onClick={nextPage}
                            className="
                                px-3 
                                py-2 
                                block 
                                text-xs 
                                font-normal 
                                uppercase 
                                rounded 
                                cursor-pointer
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

export default DataTableServer;
