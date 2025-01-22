import { tableData } from "../PlayersInsights/PlayerData"; // Import the tableData from PlayerData
import ReactPaginate from "react-paginate";
import { useState } from "react";

const PlayersComparisonTable = () => {
    const rowsPerPage = 7; // Number of rows per page
    const [currentPage, setCurrentPage] = useState(0);

    // Calculate the rows for the current page
    const offset = currentPage * rowsPerPage;
    const currentRows = tableData.slice(offset, offset + rowsPerPage);

    // Handle page change
    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    return (
        <div className="rounded-lg overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-3 bg-blue-950 text-white font-bold text-center">
                <div className="py-3 border-b border-blue-800">Metric</div>
                <div className="py-3 border-b border-blue-800">Player A</div>
                <div className="py-3 border-b border-blue-800">Player B</div>
            </div>

            {/* Table Rows */}
            {currentRows.map((row, index) => (
                <div
                    key={index}
                    className={`grid grid-cols-3 text-center ${index % 2 === 0 ? "bg-blue-900" : "bg-blue-950"
                        } text-white`}
                >
                    <div className="py-2 border-b border-blue-800">{row.metric}</div>
                    <div className="py-2 border-b border-blue-800">{row.playerA}</div>
                    <div className="py-2 border-b border-blue-800">{row.playerB}</div>
                </div>
            ))}

            {/* Pagination */}
            <div className="bg-blue-950 p-4 text-white">
                <ReactPaginate
                    previousLabel={"Previous"}
                    nextLabel={"Next"}
                    breakLabel={"..."}
                    pageCount={Math.ceil(tableData.length / rowsPerPage)}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={3}
                    onPageChange={handlePageChange}
                    containerClassName={"flex justify-center items-center space-x-4"}
                    pageClassName={"px-3 py-1 rounded-md bg-blue-800 hover:bg-blue-700 cursor-pointer"}
                    activeClassName={"bg-blue-700 text-white"}
                    previousClassName={"px-4 py-2 bg-blue-800 rounded-md hover:bg-blue-700 cursor-pointer"}
                    nextClassName={"px-4 py-2 bg-blue-800 rounded-md hover:bg-blue-700 cursor-pointer"}
                    disabledClassName={"opacity-50 cursor-not-allowed"}
                />
            </div>
        </div>
    );
};

export default PlayersComparisonTable;
