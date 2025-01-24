import ReactPaginate from "react-paginate";
import PropTypes from "prop-types";
import { useState } from "react";

const ReusableTable = ({ headers, rows, rowsPerPage }) => {
    const [currentPage, setCurrentPage] = useState(0);

    const offset = currentPage * rowsPerPage;
    const currentRows = rows.slice(offset, offset + rowsPerPage);

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    return (
        <div className="rounded-lg overflow-hidden bg-blue-950 shadow-md h-full">
            {/* Table */}
            <div className="grid grid-cols-3">
                {/* Table Header */}
                {headers.map((header, index) => (
                    <div
                        key={index}
                        className="bg-blue-800 text-white font-semibold text-center py-3 border-b border-blue-700"
                    >
                        {header}
                    </div>
                ))}
            </div>

            {/* Table Rows */}
            {currentRows.map((row, rowIndex) => (
                <div
                    key={rowIndex}
                    className={`grid grid-cols-3 text-center ${rowIndex % 2 === 0 ? "bg-blue-900" : "bg-blue-950"
                        } text-white`}
                >
                    {headers.map((header, colIndex) => (
                        <div
                            key={colIndex}
                            className="py-3 border-b border-blue-700"
                        >
                            {row[header] || "-"}
                        </div>
                    ))}
                </div>
            ))}

            {/* Pagination */}
            <div className="bg-blue-950 p-4 text-white flex justify-center">
                <ReactPaginate
                    previousLabel={"Previous"}
                    nextLabel={"Next"}
                    breakLabel={"..."}
                    pageCount={Math.ceil(rows.length / rowsPerPage)}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={3}
                    onPageChange={handlePageChange}
                    containerClassName={"flex space-x-2"}
                    pageClassName={
                        "px-3 py-1 rounded-md bg-blue-700 hover:bg-blue-600 cursor-pointer"
                    }
                    activeClassName={"bg-blue-500 text-white font-bold"}
                    previousClassName={
                        "px-4 py-2 bg-blue-700 rounded-md hover:bg-blue-600 cursor-pointer"
                    }
                    nextClassName={
                        "px-4 py-2 bg-blue-700 rounded-md hover:bg-blue-600 cursor-pointer"
                    }
                    disabledClassName={"opacity-50 cursor-not-allowed"}
                />
            </div>
        </div>
    );
};

ReusableTable.propTypes = {
    headers: PropTypes.arrayOf(PropTypes.string).isRequired,
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
    rowsPerPage: PropTypes.number,
};

ReusableTable.defaultProps = {
    rowsPerPage: 5,
};

export default ReusableTable;
